const express = require("express");
const db = require("../db"); // Your database connection
const router = express.Router();
const moment = require("moment");



// Create `sales` table if it doesn't exist
const createSalesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoiceId VARCHAR(100) NOT NULL UNIQUE,
      GrossTotal DECIMAL(10,2) NOT NULL,
      CustomerId VARCHAR(255) NOT NULL DEFAULT 'Unknown',
      discountPercent DECIMAL(10,2),
      discountAmount DECIMAL(10,2),
      netAmount DECIMAL(10,2) NOT NULL,
      CashPay DECIMAL(10,2),
      CardPay DECIMAL(10,2),
      PaymentType VARCHAR(50) NOT NULL,
      Balance DECIMAL(10,2),
      UserName VARCHAR(255) NOT NULL, -- Add UserName
      Store VARCHAR(255) NOT NULL,   -- Add Store
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating sales table:", err.message, err.stack);
    } else {
      console.log("Sales table exists or created successfully");
    }
  });
};



const createInvoicesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoiceId VARCHAR(100) NOT NULL,
    productId VARCHAR(1000) NOT NULL,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10,2),
    mrp DECIMAL(10,2),
    discount DECIMAL(10,2),
    rate DECIMAL(10,2),
    quantity DECIMAL(10,2),
    totalAmount DECIMAL(10,2),
    barcode VARCHAR(255),

    -- Updated totalCost to handle negative cost and quantity
    totalCost DECIMAL(10,2) AS (
        CASE
            WHEN cost < 0 AND quantity < 0 THEN -(cost * quantity)
            ELSE cost * quantity
        END
    ) STORED,

    profit DECIMAL(10,2) AS (
    CASE
        WHEN rate < 0 AND quantity < 0 THEN -((rate * quantity) - (cost * quantity))
        WHEN cost < 0 AND quantity < 0 THEN -((rate * quantity) - (cost * quantity))
        ELSE ((rate * quantity) - (cost * quantity))
    END
) STORED
,
    profitPercentage DECIMAL(10,2) AS (
        CASE 
            WHEN ABS(cost * quantity) > 0 THEN ((rate - cost) / ABS(cost)) * 100
            ELSE 0
        END
    ) STORED,
    discPercentage DECIMAL(10,2) AS (
        CASE 
            WHEN mrp > 0 THEN ((mrp - rate) / mrp) * 100
            ELSE 0
        END
    ) STORED,
    UserName VARCHAR(255) NOT NULL,
    Store VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoiceId) REFERENCES sales(invoiceId) ON DELETE CASCADE
    );
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating invoices table:", err.message, err.stack);
    } else {
      console.log("Invoices table exists or created successfully");
    }
  });
};


// Route to fetch today's sales
router.get("/CurrentMonthSales", (req, res) => {
  const query = `
    SELECT 
      (SELECT SUM(totalAmount) FROM invoices WHERE DATE(createdAt) = CURDATE()) AS totalAmount,
      (SELECT SUM(discountAmount) FROM sales WHERE DATE(createdAt) = CURDATE()) AS totalDiscountAmount
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching today's sales:", err);
      return res.status(500).json({ message: "Failed to fetch today's sales", error: err });
    }

    const totalAmount = results[0].totalAmount || 0;
    const totalDiscountAmount = results[0].totalDiscountAmount || 0;
    const todaySales = parseFloat(totalAmount) - parseFloat(totalDiscountAmount);

    res.json({ todaySales });
  });
});



// Call the functions to create tables on server start
createSalesTable();
createInvoicesTable();





// Generate unique invoice ID
const generateInvoiceId = () => {
  const datePart = moment().format("YYMMDD");
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) AS count FROM sales WHERE DATE(createdAt) = CURDATE()
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error generating invoice ID:", err.message, err.stack);
        return reject(err);
      }
      const count = results[0].count + 1;
      const paddedCount = count.toString().padStart(4, "0");
      const invoiceId = `${datePart}${paddedCount}`;
      console.log(`Generated invoiceId: ${invoiceId}`);
      resolve(invoiceId);
    });
  });
};




// ... (Assuming necessary imports and initializations are done)

router.post('/add_sales', (req, res) => {
  const {
    GrossTotal,
    CustomerId,
    discountPercent,
    discountAmount,
    netAmount,
    CashPay,
    CardPay,
    PaymentType,
    Balance,
    invoiceItems,
    user,
    store,
  } = req.body;

  generateInvoiceId()
    .then((invoiceId) => {
      // Start a database transaction
      db.beginTransaction((err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          return res.status(500).json({ message: 'Transaction error' });
        }

        // Step 1: Insert into sales table, including invoiceId
        const insertSalesQuery = `
          INSERT INTO sales (invoiceId, GrossTotal, CustomerId, discountPercent, discountAmount, netAmount, CashPay, CardPay, PaymentType, Balance, UserName, Store)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const salesValues = [invoiceId, GrossTotal, CustomerId, discountPercent, discountAmount, netAmount, CashPay, CardPay, PaymentType, Balance, user, store];

        db.query(insertSalesQuery, salesValues, (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error inserting into sales:', err);
              res.status(500).json({ message: 'Error saving sale' });
            });
          }

          // Step 2: Insert invoice items and adjust stock quantities
          const processItems = invoiceItems.map((item) => {
            return new Promise((resolve, reject) => {
              const {
                productId,
                name,
                cost,
                mrp,
                discount,
                rate,
                quantity,
                amount,
                barcode,
              } = item;

              // Insert into invoices table
              const insertItemQuery = `
                INSERT INTO invoices (invoiceId, productId, name, cost, mrp, discount, rate, quantity, totalAmount, barcode, UserName, Store)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;

              const itemValues = [invoiceId, productId, name, cost, mrp, discount, rate, quantity, amount, barcode, user, store];

              db.query(insertItemQuery, itemValues, (err, result) => {
                if (err) {
                  return reject(err);
                }

                const parsedQuantity = parseFloat(parseFloat(quantity).toFixed(4));
                const absoluteQuantity = Math.abs(parsedQuantity);

                if (parsedQuantity > 0) {
                  // Sale: Decrease stock and insert into product_stockout
                  updateStockAndInsertStockOut(productId, name, barcode, parsedQuantity, store, invoiceId)
                    .then(() => resolve())
                    .catch((err) => reject(err));
                } else if (parsedQuantity < 0) {
                  // Return: Increase stock and insert into product_stockin
                  updateStockAndInsertStockIn(productId, name, barcode, absoluteQuantity, store, invoiceId)
                    .then(() => resolve())
                    .catch((err) => reject(err));
                } else {
                  // Quantity is zero; do nothing
                  resolve();
                }
              });
            });
          });

          // Process all items
          Promise.all(processItems)
            .then(() => {
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error committing transaction:', err);
                    res.status(500).json({ message: 'Transaction commit error' });
                  });
                }
                res.json({ message: 'Sales data saved successfully!', invoiceId });
              });
            })
            .catch((err) => {
              db.rollback(() => {
                console.error('Error processing invoice items:', err);
                res.status(500).json({ message: 'Error processing invoice items' });
              });
            });
        });
      });
    })
    .catch((err) => {
      console.error('Error generating invoiceId:', err);
      res.status(500).json({ message: 'Error generating invoiceId' });
    });
});

// Function to update stock and insert into product_stockout
function updateStockAndInsertStockOut(productId, productName, barcode, quantity, store, invoiceId) {
  return new Promise((resolve, reject) => {
    const updateStockQuery = `
      UPDATE products
      SET stockQuantity = stockQuantity - ?
      WHERE productId = ?
    `;

    db.query(updateStockQuery, [quantity, productId], (err, result) => {
      if (err) {
        return reject(err);
      }

      // Ensure barcode is not null
      if (!barcode) {
        // Fetch barcode from products table
        const getBarcodeQuery = 'SELECT barcode FROM products WHERE productId = ?';

        db.query(getBarcodeQuery, [productId], (err, results) => {
          if (err) {
            return reject(err);
          }

          barcode = results[0]?.barcode || 'NO_BARCODE';
          proceedInsert();
        });
      } else {
        proceedInsert();
      }

      function proceedInsert() {
        const insertStockOutQuery = `
          INSERT INTO product_stockout (productId, productName, barcode, quantity, type, store, date, invoiceId)
          VALUES (?, ?, ?, ?, 'Selled Item', ?, NOW(), ?)
        `;

        db.query(insertStockOutQuery, [productId, productName, barcode, quantity, store, invoiceId], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }
    });
  });
}

// Function to update stock and insert into product_stockin
function updateStockAndInsertStockIn(productId, productName, barcode, quantity, store, invoiceId) {
  return new Promise((resolve, reject) => {
    const updateStockQuery = `
      UPDATE products
      SET stockQuantity = stockQuantity + ?
      WHERE productId = ?
    `;

    db.query(updateStockQuery, [quantity, productId], (err, result) => {
      if (err) {
        return reject(err);
      }

      // Ensure barcode is not null
      if (!barcode) {
        // Fetch barcode from products table
        const getBarcodeQuery = 'SELECT barcode FROM products WHERE productId = ?';

        db.query(getBarcodeQuery, [productId], (err, results) => {
          if (err) {
            return reject(err);
          }

          barcode = results[0]?.barcode || 'NO_BARCODE';
          proceedInsert();
        });
      } else {
        proceedInsert();
      }

      function proceedInsert() {
        const insertStockInQuery = `
          INSERT INTO product_stockin (productId, productName, barcode, quantity, type, store, date, invoiceId)
          VALUES (?, ?, ?, ?, 'ReturnItem', ?, NOW(), ?)
        `;

        db.query(insertStockInQuery, [productId, productName, barcode, quantity, store, invoiceId], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }
    });
  });
}



/*
router.post("/add_sales", async (req, res) => {
  const {
    GrossTotal,
    CustomerId,
    discountPercent,
    discountAmount,
    netAmount,
    CashPay,
    CardPay,
    PaymentType,
    Balance,
    invoiceItems, // Array of invoice items
    user, // Add user
    store, // Add store
  } = req.body;

  if (
    !GrossTotal ||
    !netAmount ||
    !PaymentType ||
    !Array.isArray(invoiceItems) ||
    !user || // Ensure user is provided
    !store || // Ensure store is provided
    invoiceItems.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields or invalid invoice items." });
  }

  try {
    // Generate unique invoice ID
    const invoiceId = await generateInvoiceId();
    console.log(`Generated invoiceId: ${invoiceId}`);

    // Prepare sales values
    const salesValues = [
      invoiceId,
      GrossTotal,
      CustomerId || "Unknown",
      discountPercent || 0,
      discountAmount || 0,
      netAmount,
      CashPay || 0,
      CardPay || 0,
      PaymentType,
      Balance || 0,
      user, // Include user
      store, // Include store
    ];

    // Prepare invoice items values
    const invoiceItemsValues = invoiceItems.map((item) => [
      invoiceId,
      item.name,
      item.cost,
      item.mrp,
      item.discount,
      item.rate,
      item.quantity,
      item.amount,
      item.barcode, // Include barcode here
      user, // Include UserName
      store, // Include Store
    ]);

    console.log("Invoice Items Values:", invoiceItemsValues);

    // Start transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err.message, err.stack);
        res.status(500).json({ message: "Failed to start transaction" });
        return;
      }

      // Insert into sales
      const insertSalesQuery = `
        INSERT INTO sales (
          invoiceId, GrossTotal, CustomerId, discountPercent, discountAmount,
          netAmount, CashPay, CardPay, PaymentType, Balance, UserName, Store
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertSalesQuery, salesValues, (err) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error adding sales record:", err.message, err.stack);
            res.status(500).json({ message: "Failed to add sales record" });
          });
        }

        // Insert into invoices
        const insertItemsQuery = `
          INSERT INTO invoices (
            invoiceId, name, cost, mrp, discount, rate, quantity, totalAmount, barcode, UserName, Store
          ) VALUES ?
        `;
        db.query(insertItemsQuery, [invoiceItemsValues], async (err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error adding invoice items:", err.message, err.stack);
              res.status(500).json({ message: "Failed to add invoice items" });
            });
          }

          try {
            // Update stock quantities for each product and log stock out
            for (const item of invoiceItems) {
              const quantity = parseFloat(item.quantity);
              const barcode = item.barcode;

              // Step 1: Update stock quantity
              const updateStockQuery = `
                UPDATE products
                SET stockQuantity = stockQuantity - ?
                WHERE barcode = ? AND stockQuantity >= ?
              `;

              await new Promise((resolve, reject) => {
                db.query(updateStockQuery, [quantity, barcode, quantity], (err, results) => {
                  if (err) {
                    console.error(`Error updating stock for barcode ${barcode}:`, err.message, err.stack);
                    return reject(err);
                  }

                  if (results.affectedRows === 0) {
                    return reject(
                      new Error(
                        `Not enough stock available for product with barcode ${barcode}`
                      )
                    );
                  }
                  resolve();
                });
              });

              // Step 2: Ensure productId is available
              const productId = item.productId || (await new Promise((resolve, reject) => {
                const fetchProductQuery = `SELECT productId FROM products WHERE barcode = ?`;
                db.query(fetchProductQuery, [barcode], (err, results) => {
                  if (err || results.length === 0) {
                    console.error(`Error fetching productId for barcode ${barcode}:`, err.message, err.stack);
                    return reject(new Error(`Product ID not found for barcode ${barcode}`));
                  }
                  resolve(results[0].productId);
                });
              }));

              // Step 3: Log stock-out event in `product_stockout` table
              const insertStockOutQuery = `
                INSERT INTO product_stockout (productId, productName, barcode, quantity, type, store, date)
                VALUES (?, ?, ?, ?, 'Selling Product', ?, NOW())
              `;

              await new Promise((resolve, reject) => {
                db.query(
                  insertStockOutQuery,
                  [productId, item.name, barcode, quantity, store],
                  (err) => {
                    if (err) {
                      console.error(`Error logging stock-out for barcode ${barcode}:`, err.message, err.stack);
                      return reject(err);
                    }
                    resolve();
                  }
                );
              });
            }

            // Commit transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Transaction commit failed:", err.message, err.stack);
                  res.status(500).json({ message: "Transaction failed" });
                });
              }
              console.log("Sales record and invoice items saved successfully.");
              res.status(201).json({
                message: "Sales record and invoice items saved successfully.",
                invoiceId,
              });
            });
          } catch (err) {
            db.rollback(() => {
              console.error("Error updating stock quantities:", err.message, err.stack);
              res.status(400).json({ message: err.message });
            });
          }
        });
      });
    });
  } catch (err) {
    console.error("Error saving sales or invoice items:", err.message, err.stack);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});
*/



// Route to fetch all sales records
router.get("/fetch_sales", (req, res) => {
  const fetchQuery = "SELECT * FROM sales";
  db.query(fetchQuery, (err, results) => {
    if (err) {
      console.error("Error fetching sales records:", err.message, err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching sales records", error: err.message });
    }
    res.status(200).json(results);
  });
});




// Route to fetch all sales records where PaymentType is "Credit Payment" and matches the Store
router.get("/fetch_sales_new", (req, res) => {
  const { Store } = req.query;

  if (!Store) {
    return res.status(400).json({ message: "Store parameter is required" });
  }

  const fetchQuery = "SELECT * FROM sales WHERE PaymentType = 'Credit Payment' AND Store = ?";
  db.query(fetchQuery, [Store], (err, results) => {
    if (err) {
      console.error("Error fetching sales records:", err.message, err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching sales records", error: err.message });
    }
    res.status(200).json(results);
  });
});




router.get("/fetch_sales_store_removed", (req, res) => {
  const { customerId } = req.query; // Extract customerId from query params

  const fetchQuery = `
    SELECT * FROM sales 
    WHERE PaymentType = 'Credit Payment'
    ${customerId ? "AND CustomerId = ?" : ""}
  `;

  const queryParams = customerId ? [customerId] : [];

  db.query(fetchQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching sales records:", err.message, err.stack);
      return res
        .status(500)
        .json({ message: "Error fetching sales records", error: err.message });
    }
    res.status(200).json(results);
  });
});






// Route to fetch all invoice items for a specific invoice
router.get("/fetch_invoice_items/:invoiceId", (req, res) => {
  const { invoiceId } = req.params;
  const fetchQuery = "SELECT * FROM invoices WHERE invoiceId = ?";

  db.query(fetchQuery, [invoiceId], (err, results) => {
    if (err) {
      console.error(
        "Error fetching invoice items:",
        err.message,
        err.stack
      );
      return res
        .status(500)
        .json({ message: "Error fetching invoice items", error: err.message });
    }
    res.status(200).json(results);
  });
});




// API to get stock quantity for a product by barcode
router.get('/stock_quantity', (req, res) => {
  const { barcode } = req.query;

  if (!barcode) {
    return res.status(400).json({ message: 'Barcode is required' });
  }

  const query = `
    SELECT stockQuantity 
    FROM products 
    WHERE barcode = ? AND status = 'active'
  `;

  db.query(query, [barcode], (err, results) => {
    if (err) {
      console.error('Error fetching stock quantity:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    const stockQuantity = results[0].stockQuantity;
    res.status(200).json({ stockQuantity });
  });
});




router.get("/fetch_invoices", (req, res) => {
  const { Store } = req.query; // Get Store parameter from the query
  console.log("Store received in API request:", Store); // Log the Store value

  if (!Store) {
    return res.status(400).json({ message: "Store is required." });
  }

  // SQL query to fetch invoices filtered by Store in descending order of createdAt
  const query = `
    SELECT * FROM invoices
    WHERE Store = ?
    ORDER BY createdAt DESC
  `;

  // Execute the query
  db.query(query, [Store], (err, results) => {
    if (err) {
      console.error("Error fetching invoices:", err.message, err.stack);
      return res.status(500).json({
        message: "Failed to fetch invoices",
        error: err.message,
      });
    }
    console.log("Fetched invoices in descending order:", results); // Log the results
    res.status(200).json(results); // Return results as JSON
  });
});





router.get("/fetch_sales_sales", (req, res) => {
  const { Store } = req.query; // Get Store parameter from the query
  console.log("Store received in API request:", Store); // Log the Store value

  if (!Store) {
    return res.status(400).json({ message: "Store is required." });
  }

  // SQL query to fetch sales filtered by Store, sorted by createdAt in descending order
  const query = `
    SELECT id, invoiceId, GrossTotal, CustomerId, discountPercent, discountAmount,
           netAmount, CashPay, CardPay, PaymentType, Balance, createdAt
    FROM sales
    WHERE Store = ?
    ORDER BY createdAt DESC
  `;

  // Execute the query
  db.query(query, [Store], (err, results) => {
    if (err) {
      console.error("Error fetching sales:", err.message, err.stack);
      return res.status(500).json({
        message: "Failed to fetch sales",
        error: err.message,
      });
    }
    console.log("Fetched sales in descending order:", results); // Log the results
    res.status(200).json(results); // Return results as JSON
  });
});





router.get("/fetch_customer_payment_details/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const { invoiceId } = req.query;

  try {
    const customerQuery = `
      SELECT cusName FROM customers WHERE cusId = ? LIMIT 1
    `;
    const [customer] = await db.query(customerQuery, [customerId]);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    const paymentQuery = `
      SELECT CashPay AS cashPayment, CardPay AS cardPayment, PaymentType AS paymentType, Balance AS balanceAmount
      FROM sales
      WHERE CustomerId = ? AND invoiceId = ?
      LIMIT 1
    `;
    const [payment] = await db.query(paymentQuery, [customerId, invoiceId]);

    if (!payment) {
      return res.status(404).json({ message: "Payment details not found." });
    }

    res.json({
      customerName: customer.cusName,
      ...payment,
    });
  } catch (error) {
    console.error("Error fetching customer payment details:", error);
    res.status(500).json({ message: "Failed to fetch payment details." });
  }
});




/*
// DELETE /api/invoices/delete_invoice/:invoiceId
router.delete('/delete_invoice/:invoiceId', (req, res) => {
  const { invoiceId } = req.params;

  // Step 1: Check if the invoice is linked in customer_loan_payment
  const checkLoanPaymentQuery =
    'SELECT COUNT(*) AS count FROM customer_loan_payment WHERE invoiceId = ?';

  db.query(checkLoanPaymentQuery, [invoiceId], (err, loanResults) => {
    if (err) {
      console.error('Error checking customer loan payment:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const loanCount = loanResults[0]?.count || 0;

    if (loanCount > 0) {
      // Invoice is linked to customer loan payments, cannot delete
      return res.status(400).json({
        message:
          'Cannot delete invoice. This invoice is linked to customer loan payments.',
      });
    }

    // Step 2: Proceed to delete the invoice
    // Start a transaction to ensure data integrity
    db.beginTransaction((transactionErr) => {
      if (transactionErr) {
        console.error('Error starting transaction:', transactionErr);
        return res.status(500).json({ message: 'Server error' });
      }

      // Step 2a: Retrieve all products from the invoice
      const getInvoiceItemsQuery = 'SELECT productId, quantity FROM invoices WHERE invoiceId = ?';

      db.query(getInvoiceItemsQuery, [invoiceId], (getItemsErr, invoiceItems) => {
        if (getItemsErr) {
          console.error('Error retrieving invoice items:', getItemsErr);
          return db.rollback(() => {
            res.status(500).json({ message: 'Server error retrieving invoice items' });
          });
        }

        // Prepare to update stock quantities
        const updateStockPromises = invoiceItems.map((item) => {
          return new Promise((resolve, reject) => {
            const { productId, quantity } = item;

            const parsedQuantity = parseFloat(quantity);
            const absoluteQuantity = Math.abs(parsedQuantity);

            let updateStockQuery = '';
            let updateStockParams = [];

            if (parsedQuantity > 0) {
              // Sale: Increase stock quantity by adding back sold quantity
              updateStockQuery = `
                UPDATE products
                SET stockQuantity = stockQuantity + ?
                WHERE productId = ?
              `;
              updateStockParams = [parsedQuantity, productId];
            } else if (parsedQuantity < 0) {
              // Return: Decrease stock quantity by subtracting returned quantity
              updateStockQuery = `
                UPDATE products
                SET stockQuantity = stockQuantity - ?
                WHERE productId = ?
              `;
              updateStockParams = [absoluteQuantity, productId];
            } else {
              // Quantity is zero; do nothing
              return resolve();
            }

            db.query(updateStockQuery, updateStockParams, (updateErr, updateResult) => {
              if (updateErr) {
                console.error(`Error updating stock for productId ${productId}:`, updateErr);
                return reject(updateErr);
              }
              resolve();
            });
          });
        });

        // Execute all stock updates
        Promise.all(updateStockPromises)
          .then(() => {
            // After updating stock quantities, proceed to delete from invoices table
            const deleteInvoicesQuery = 'DELETE FROM invoices WHERE invoiceId = ?';

            db.query(deleteInvoicesQuery, [invoiceId], (deleteInvoicesErr, deleteInvoicesResult) => {
              if (deleteInvoicesErr) {
                console.error(
                  'Error deleting from invoices table:',
                  deleteInvoicesErr
                );
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({ message: 'Server error during deletion from invoices table' });
                });
              }

              // Then delete from sales table
              const deleteSalesQuery = 'DELETE FROM sales WHERE invoiceId = ?';

              db.query(deleteSalesQuery, [invoiceId], (deleteSalesErr, deleteSalesResult) => {
                if (deleteSalesErr) {
                  console.error('Error deleting from sales table:', deleteSalesErr);
                  return db.rollback(() => {
                    res
                      .status(500)
                      .json({ message: 'Server error during deletion from sales table' });
                  });
                }

                // Commit the transaction
                db.commit((commitErr) => {
                  if (commitErr) {
                    console.error('Error committing transaction:', commitErr);
                    return db.rollback(() => {
                      res
                        .status(500)
                        .json({ message: 'Server error during transaction commit' });
                    });
                  }

                  // Deletion successful
                  res.json({ message: `Invoice ${invoiceId} deleted successfully.` });
                });
              });
            });
          })
          .catch((updateStockErr) => {
            console.error('Error updating stock quantities:', updateStockErr);
            return db.rollback(() => {
              res.status(500).json({ message: 'Server error updating stock quantities' });
            });
          });
      });
    });
  });
});

*/


// DELETE /api/invoices/delete_invoice/:invoiceId
// DELETE /api/invoices/delete_invoice/:invoiceId
router.delete('/delete_invoice/:invoiceId', (req, res) => {
  const { invoiceId } = req.params;

  // Step 1: Check if the invoice is linked in customer_loan_payment
  const checkLoanPaymentQuery =
    'SELECT COUNT(*) AS count FROM customer_loan_payment WHERE invoiceId = ?';

  db.query(checkLoanPaymentQuery, [invoiceId], (err, loanResults) => {
    if (err) {
      console.error('Error checking customer loan payment:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const loanCount = loanResults[0]?.count || 0;

    if (loanCount > 0) {
      // Invoice is linked to customer loan payments, cannot delete
      return res.status(400).json({
        message:
          'Cannot delete invoice. This invoice is linked to customer loan payments.',
      });
    }

    // Step 2: Proceed to delete the invoice
    // Start a transaction to ensure data integrity
    db.beginTransaction((transactionErr) => {
      if (transactionErr) {
        console.error('Error starting transaction:', transactionErr);
        return res.status(500).json({ message: 'Server error' });
      }

      // Step 2a: Retrieve all products from the invoice
      const getInvoiceItemsQuery = 'SELECT productId, quantity FROM invoices WHERE invoiceId = ?';

      db.query(getInvoiceItemsQuery, [invoiceId], (getItemsErr, invoiceItems) => {
        if (getItemsErr) {
          console.error('Error retrieving invoice items:', getItemsErr);
          return db.rollback(() => {
            res.status(500).json({ message: 'Server error retrieving invoice items' });
          });
        }

        // Prepare to update stock quantities
        const updateStockPromises = invoiceItems.map((item) => {
          return new Promise((resolve, reject) => {
            const { productId, quantity } = item;

            const parsedQuantity = parseFloat(quantity);
            const absoluteQuantity = Math.abs(parsedQuantity);

            let updateStockQuery = '';
            let updateStockParams = [];

            if (parsedQuantity > 0) {
              // Sale: Increase stock quantity by adding back sold quantity
              updateStockQuery = `
                UPDATE products
                SET stockQuantity = stockQuantity + ?
                WHERE productId = ?
              `;
              updateStockParams = [parsedQuantity, productId];
            } else if (parsedQuantity < 0) {
              // Return: Decrease stock quantity by subtracting returned quantity
              updateStockQuery = `
                UPDATE products
                SET stockQuantity = stockQuantity - ?
                WHERE productId = ?
              `;
              updateStockParams = [absoluteQuantity, productId];
            } else {
              // Quantity is zero; do nothing
              return resolve();
            }

            db.query(updateStockQuery, updateStockParams, (updateErr, updateResult) => {
              if (updateErr) {
                console.error(`Error updating stock for productId ${productId}:`, updateErr);
                return reject(updateErr);
              }
              resolve();
            });
          });
        });

        // Execute all stock updates
        Promise.all(updateStockPromises)
          .then(() => {
            // Delete from product_stockin and product_stockout using invoiceId
            const deleteStockInQuery = 'DELETE FROM product_stockin WHERE invoiceId = ?';
            const deleteStockOutQuery = 'DELETE FROM product_stockout WHERE invoiceId = ?';

            db.query(deleteStockInQuery, [invoiceId], (deleteStockInErr, deleteStockInResult) => {
              if (deleteStockInErr) {
                console.error('Error deleting from product_stockin:', deleteStockInErr);
                return db.rollback(() => {
                  res.status(500).json({ message: 'Server error deleting from product_stockin' });
                });
              }

              db.query(deleteStockOutQuery, [invoiceId], (deleteStockOutErr, deleteStockOutResult) => {
                if (deleteStockOutErr) {
                  console.error('Error deleting from product_stockout:', deleteStockOutErr);
                  return db.rollback(() => {
                    res.status(500).json({ message: 'Server error deleting from product_stockout' });
                  });
                }

                // After updating stock quantities and deleting stock entries, proceed to delete from invoices table
                const deleteInvoicesQuery = 'DELETE FROM invoices WHERE invoiceId = ?';

                db.query(deleteInvoicesQuery, [invoiceId], (deleteInvoicesErr, deleteInvoicesResult) => {
                  if (deleteInvoicesErr) {
                    console.error(
                      'Error deleting from invoices table:',
                      deleteInvoicesErr
                    );
                    return db.rollback(() => {
                      res
                        .status(500)
                        .json({ message: 'Server error during deletion from invoices table' });
                    });
                  }

                  // Then delete from sales table
                  const deleteSalesQuery = 'DELETE FROM sales WHERE invoiceId = ?';

                  db.query(deleteSalesQuery, [invoiceId], (deleteSalesErr, deleteSalesResult) => {
                    if (deleteSalesErr) {
                      console.error('Error deleting from sales table:', deleteSalesErr);
                      return db.rollback(() => {
                        res
                          .status(500)
                          .json({ message: 'Server error during deletion from sales table' });
                      });
                    }

                    // Commit the transaction
                    db.commit((commitErr) => {
                      if (commitErr) {
                        console.error('Error committing transaction:', commitErr);
                        return db.rollback(() => {
                          res
                            .status(500)
                            .json({ message: 'Server error during transaction commit' });
                        });
                      }

                      // Deletion successful
                      res.json({ message: `Invoice ${invoiceId} deleted successfully.` });
                    });
                  });
                });
              });
            });
          })
          .catch((updateStockErr) => {
            console.error('Error updating stock quantities:', updateStockErr);
            return db.rollback(() => {
              res.status(500).json({ message: 'Server error updating stock quantities' });
            });
          });
      });
    });
  });
});







// Route to check if an invoiceId exists in customer_loan_payment
router.get('/check_invoice/:invoiceId', (req, res) => {
  const { invoiceId } = req.params;

  const query = 'SELECT COUNT(*) AS count FROM customer_loan_payment WHERE invoiceId = ?';

  db.query(query, [invoiceId], (error, results) => {
    if (error) {
      console.error('Error checking customer loan payment:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    const count = results[0].count;
    res.json({ hasLoanPayment: count > 0 });
  });
});



// Fetch sales data for chart
router.get('/fetch_sales_chart_table', (req, res) => {
  const { Store, startDate, endDate } = req.query;

  if (!Store || !startDate || !endDate) {
    return res.status(400).json({ message: "Store, startDate, and endDate are required." });
  }

  const query = `
    SELECT invoiceId, netAmount, createdAt
    FROM sales
    WHERE Store = ? AND createdAt BETWEEN ? AND ?
    ORDER BY createdAt ASC
  `;

  db.query(query, [Store, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching sales data:", err);
      return res.status(500).json({ message: "Error fetching sales data." });
    }

    res.status(200).json(results);
  });
});



router.get("/last", (req, res) => {
  const query = `
    SELECT * FROM invoices
    WHERE invoiceId = (SELECT invoiceId FROM invoices ORDER BY id DESC LIMIT 1);
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch invoice data", error: err });
    }
    res.json(results);
  });
});


router.get("/fetchInvoiceData", (req, res) => {
  const { invoiceId } = req.query;

  if (!invoiceId) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }

  const fetchSalesQuery = `
    SELECT * FROM sales WHERE invoiceId = ?;
  `;
  const fetchInvoicesQuery = `
    SELECT * FROM invoices WHERE invoiceId = ?;
  `;
  const fetchCompanyQuery = `
    SELECT * FROM companies LIMIT 1;
  `;

  db.query(fetchSalesQuery, [invoiceId], (err, salesResults) => {
    if (err || salesResults.length === 0) {
      return res.status(500).json({ message: "Failed to fetch sales data", error: err });
    }

    db.query(fetchInvoicesQuery, [invoiceId], (err, invoiceResults) => {
      if (err || invoiceResults.length === 0) {
        return res.status(500).json({ message: "Failed to fetch invoice data", error: err });
      }

      db.query(fetchCompanyQuery, (err, companyResults) => {
        if (err || companyResults.length === 0) {
          return res.status(500).json({ message: "Failed to fetch company data", error: err });
        }

        res.json({
          sales: salesResults[0],
          invoices: invoiceResults,
          company: companyResults[0],
        });
      });
    });
  });
});



router.get('/today_invoices_count', (req, res) => {
  const query = `
    SELECT COUNT(*) AS invoiceCount 
    FROM invoices 
    WHERE DATE(createdAt) = CURDATE()
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching invoice count:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const count = results[0].invoiceCount;
    res.json({ count });
  });
});



// GET total product count
router.get('/productcount', (req, res) => {
  const query = `SELECT COUNT(*) AS productCount FROM products`; // Ensure 'products' is your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching product count:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const count = results[0].productCount;
    res.json({ count });
  });
});



// GET total customer count
router.get('/customercount', (req, res) => {
  const query = `SELECT COUNT(*) AS customerCount FROM customers`; // Ensure 'customers' is your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customer count:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const count = results[0].customerCount;
    res.json({ count });
  });
});



// GET total supplier count
router.get('/suppliercount', (req, res) => {
  const query = `SELECT COUNT(*) AS supplierCount FROM suppliers`; // Ensure 'suppliers' is your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching supplier count:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const count = results[0].supplierCount;
    res.json({ count });
  });
});


// Route to fetch the last invoice ID
router.get("/lastInvoiceId", (req, res) => {
  const query = `
    SELECT invoiceId 
    FROM invoices 
    ORDER BY createdAt DESC 
    LIMIT 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching last invoice ID:", err);
      return res.status(500).json({ message: "Failed to fetch last invoice ID", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No invoices found" });
    }

    res.json({ invoiceId: results[0].invoiceId });
  });
});




module.exports = router;

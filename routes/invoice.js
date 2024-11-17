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
      totalCost DECIMAL(10,2) AS (cost * quantity) STORED, -- Auto-calculated column for total cost
      profit DECIMAL(10,2) AS ((rate * quantity) - (cost * quantity)) STORED, -- Auto-calculated column for profit
      profitPercentage DECIMAL(10,2) AS (
        CASE 
          WHEN (cost * quantity) > 0 THEN ((profit / (cost * quantity)) * 100) 
          ELSE 0 
        END
      ) STORED, -- Auto-calculated column for profit percentage
      discPercentage DECIMAL(10,2) AS (
        CASE 
          WHEN mrp > 0 THEN ((mrp - rate) / mrp) * 100
          ELSE 0
        END
      ) STORED, -- Auto-calculated column for discount percentage
      UserName VARCHAR(255) NOT NULL, -- Include UserName
      Store VARCHAR(255) NOT NULL,    -- Include Store
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoiceId) REFERENCES sales(invoiceId) ON DELETE CASCADE
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating invoices table:", err.message, err.stack);
    } else {
      console.log("Invoices table exists or created successfully");
    }
  });
};



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





// API to add a new sales record
router.post("/add_sales", async (req, res) => {
  const {
    GrossTotal = 0,
    CustomerId = "Unknown",
    discountPercent = 0,
    discountAmount = 0,
    netAmount = 0,
    CashPay = 0,
    CardPay = 0,
    PaymentType = "Cash Payment",
    Balance = 0,
    invoiceItems = [],
    user,
    store,
  } = req.body;

  // Validate required fields
  if (
    typeof GrossTotal !== "number" ||
    typeof netAmount !== "number" ||
    !PaymentType ||
    !Array.isArray(invoiceItems) ||
    !user ||
    !store ||
    invoiceItems.length === 0
  ) {
    return res.status(400).json({
      message: "Missing required fields or invalid invoice items.",
    });
  }

  try {
    // Generate unique invoice ID
    const invoiceId = await generateInvoiceId();
    console.log(`Generated invoiceId: ${invoiceId}`);

    // Prepare sales values
    const salesValues = [
      invoiceId,
      GrossTotal,
      CustomerId,
      discountPercent,
      discountAmount,
      netAmount,
      CashPay,
      CardPay,
      PaymentType,
      Balance,
      user,
      store,
    ];

    // Validate and fetch details for invoice items
    const validatedItems = await Promise.all(
      invoiceItems.map(async (item) => {
        const { barcode, quantity = 0, productId } = item;

        if (!barcode && !productId) {
          throw new Error("Missing barcode or productId for an invoice item.");
        }

        const fetchProductQuery = `
          SELECT productId, productName, barcode, costPrice, mrpPrice, stockQuantity
          FROM products
          WHERE barcode = ? OR productId = ?
          LIMIT 1
        `;

        const productDetails = await new Promise((resolve, reject) => {
          db.query(
            fetchProductQuery,
            [barcode || null, productId || null],
            (err, results) => {
              if (err || results.length === 0) {
                return reject(
                  new Error(
                    `Product not found for barcode or productId: ${barcode || productId}`
                  )
                );
              }
              resolve(results[0]);
            }
          );
        });

        return {
          ...productDetails,
          ...item,
          quantity: parseFloat(quantity) || 0,
        };
      })
    );

    // Prepare invoice items values
    const invoiceItemsValues = validatedItems.map((item) => [
      invoiceId,
      item.productId || "Unknown",
      item.productName || "Unknown Product",
      item.cost || 0,
      item.mrp || 0,
      item.discount || 0,
      item.rate || 0,
      item.quantity || 0,
      item.amount || 0,
      item.barcode || null,
      user,
      store,
    ]);

    // Start transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err.message);
        return res.status(500).json({ message: "Failed to start transaction" });
      }

      // Insert into sales table
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
            console.error("Error adding sales record:", err.message);
            return res.status(500).json({ message: "Failed to add sales record" });
          });
        }

        // Insert into invoices table
        const insertItemsQuery = `
          INSERT INTO invoices (
            invoiceId, productId, name, cost, mrp, discount, rate, quantity, totalAmount, barcode, UserName, Store
          ) VALUES ?
        `;

        db.query(insertItemsQuery, [invoiceItemsValues], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error adding invoice items:", err.message);
              return res.status(500).json({ message: "Failed to add invoice items" });
            });
          }

          // Commit transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Transaction commit failed:", err.message);
                return res.status(500).json({ message: "Transaction failed" });
              });
            }
            console.log("Sales record and invoice items saved successfully.");
            return res.status(201).json({
              message: "Sales record and invoice items saved successfully.",
              invoiceId,
            });
          });
        });
      });
    });
  } catch (err) {
    console.error("Error processing sales request:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});



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



module.exports = router;

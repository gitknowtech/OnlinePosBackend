const express = require('express');
const db = require('../db'); // Your database connection
const router = express.Router();
// Promisify db.query if using mysql without promise support
const util = require('util');
db.query = util.promisify(db.query);


// Create `Customer` table if it doesn't exist
const createCustomerTable = () => {
  console.log("Initializing table creation...");
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cusId VARCHAR(100) NOT NULL UNIQUE,
      cusName VARCHAR(255) NOT NULL,
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      mobile1 VARCHAR(15) NOT NULL UNIQUE,
      mobile2 VARCHAR(15) UNIQUE,
      idNumber VARCHAR(100) UNIQUE,
      creditLimit DECIMAL(10,2),
      user VARCHAR(255),
      store VARCHAR(255),
      status VARCHAR(10) DEFAULT 'active',
      createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating customers table:", err.message);
      console.error(err.stack); // Log detailed stack trace
    } else {
      console.log("Customers table exists or created successfully");
    }
  });
};


// Function to create the banksupplier table
const createCustomerLoanPaymentTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS customer_loan_payment (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customerId VARCHAR(255) NOT NULL,
      invoiceId VARCHAR(255) NOT NULL,
      cashPayment DECIMAL(10, 2) NOT NULL,
      cardPayment DECIMAL(10, 2) NOT NULL,
      totalPayment DECIMAL(10, 2) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoiceId) REFERENCES sales(invoiceId)
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating customer_loan_payment table:", err);
    } else {
      console.log("customer_loan_payment table created or already exists.");
    }
  });
};


// Call the function to create the table on server start
createCustomerTable();
createCustomerLoanPaymentTable(); 




// API to add a new customer
router.post('/add_customer', (req, res) => {
  const {
    cusId,
    cusName,
    address1,
    address2,
    mobile1,
    mobile2,
    idNumber,
    user,
    store,
    creditLimit, // New field
  } = req.body;

  // Validate required fields
  if (!cusId || !cusName || !address1 || !mobile1) {
    return res.status(400).json({ message: 'Customer ID, Customer Name, Address 1, and Mobile 1 are required.' });
  }

  // Additional validation for creditLimit
  if (creditLimit && isNaN(creditLimit)) {
    return res.status(400).json({ message: 'Credit Limit must be a valid number.' });
  }

  // Check for duplicates
  let duplicateConditions = `cusId = ? OR mobile1 = ?`;
  let duplicateParams = [cusId, mobile1];

  if (mobile2) {
    duplicateConditions += ` OR mobile2 = ?`;
    duplicateParams.push(mobile2);
  }

  if (idNumber) {
    duplicateConditions += ` OR idNumber = ?`;
    duplicateParams.push(idNumber);
  }

  const checkDuplicateQuery = `SELECT * FROM customers WHERE ${duplicateConditions}`;
  db.query(checkDuplicateQuery, duplicateParams, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking for duplicates', error: err.message });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Duplicate found: Customer ID, Mobile 1, Mobile 2, or ID Number already exists.' });
    }

    // Insert the customer
    const insertCustomerQuery = `
      INSERT INTO customers (cusId, cusName, address1, address2, mobile1, mobile2, idNumber, creditLimit, user, store)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const customerValues = [cusId, cusName, address1, address2, mobile1, mobile2 || null, idNumber || null, creditLimit || null, user, store];

    db.query(insertCustomerQuery, customerValues, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding customer', error: err.message });
      }

      res.status(201).json({ message: 'Customer added successfully!' });
    });
  });
});




// Route to fetch all customers using raw SQL (adjust as necessary based on your database structure)
router.get('/fetch_customers', (req, res) => {
  const fetchQuery = 'SELECT * FROM customers';
  db.query(fetchQuery, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err.message);
      console.error(err.stack); // Log detailed stack trace
      return res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
    res.status(200).json(results);
  });
});



// Delete customer route
router.delete('/delete_customer/:cusId', (req, res) => {
  const { cusId } = req.params;
  const deleteQuery = 'DELETE FROM customers WHERE cusId = ?';

  db.query(deleteQuery, [cusId], (err, result) => {
    if (err) {
      console.error('Error deleting customer:', err.message);
      return res.status(500).json({ message: 'Error deleting customer', error: err.message });
    }
    if (result.affectedRows > 0) {
      console.log(`Customer "${cusId}" deleted successfully`);
      return res.status(200).json({ message: `Customer "${cusId}" deleted successfully` });
    } else {
      console.log('Customer not found');
      return res.status(404).json({ message: 'Customer not found' });
    }
  });
});



// Route to update a customer
router.put('/update_customer/:cusId', (req, res) => {
  const { cusId } = req.params;
  const { address1, address2, mobile1, mobile2, idNumber, user, store, creditLimit } = req.body;

  // Validate creditLimit
  if (creditLimit && isNaN(creditLimit)) {
    return res.status(400).json({ message: 'Credit Limit must be a valid number.' });
  }

  const checkCustomerQuery = 'SELECT * FROM customers WHERE cusId = ?';
  db.query(checkCustomerQuery, [cusId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking customer existence', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const updateCustomerQuery = `
      UPDATE customers
      SET address1 = ?, address2 = ?, mobile1 = ?, mobile2 = ?, idNumber = ?, creditLimit = ?, user = ?, store = ?
      WHERE cusId = ?
    `;
    const updateValues = [address1, address2, mobile1, mobile2 || null, idNumber || null, creditLimit || null, user, store, cusId];

    db.query(updateCustomerQuery, updateValues, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating customer', error: err.message });
      }

      res.status(200).json({ message: 'Customer updated successfully!' });
    });
  });
});



// API to fetch customers by mobile number (supports both mobile1 and mobile2)
router.get('/customers', (req, res) => {
  const mobile = req.query.mobile;

  if (!mobile) {
    return res.status(400).json({ message: 'Mobile number is required.' });
  }

  const query = `
    SELECT id, cusName, mobile1, mobile2
    FROM customers
    WHERE mobile1 LIKE ? OR mobile2 LIKE ?
    LIMIT 5
  `;

  db.query(query, [`%${mobile}%`, `%${mobile}%`], (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err.message);
      return res.status(500).json({ message: 'Error fetching customers' });
    }

    res.json(results);
  });
});


router.put("/update_sale/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params;
  const { CashPay, CardPay, Balance, customerId } = req.body;

  try {
    // Validate input data
    if (
      CashPay === undefined || isNaN(CashPay) ||
      CardPay === undefined || isNaN(CardPay) ||
      Balance === undefined || isNaN(Balance) ||
      !customerId
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Fetch current sales details
    const fetchQuery = `
      SELECT CashPay, CardPay, Balance, PaymentType 
      FROM sales 
      WHERE invoiceId = ?
    `;
    const [currentData] = await db.query(fetchQuery, [invoiceId]);

    if (!currentData) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const currentBalance = parseFloat(currentData.Balance) || 0;

    // Determine new PaymentType only if Balance is 0
    let paymentType = currentData.PaymentType; // Default to existing PaymentType
    if (parseFloat(Balance) === 0) {
      if (CashPay > 0 && CardPay > 0) {
        paymentType = "Cash and Card Payment";
      } else if (CashPay > 0) {
        paymentType = "Cash Payment";
      } else if (CardPay > 0) {
        paymentType = "Card Payment";
      } else {
        paymentType = "Unknown"; // If no valid payment
      }
    }

    // Update the sales record
    const updateQuery = `
      UPDATE sales 
      SET CashPay = ?, CardPay = ?, Balance = ? 
      ${parseFloat(Balance) === 0 ? ", PaymentType = ?" : ""} 
      WHERE invoiceId = ?
    `;
    const updateParams = parseFloat(Balance) === 0
      ? [CashPay, CardPay, Balance, paymentType, invoiceId]
      : [CashPay, CardPay, Balance, invoiceId];

    const updateResult = await db.query(updateQuery, updateParams);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Update failed, invoice not found" });
    }

    res.status(200).json({ message: "Sale updated successfully" });
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ message: "Failed to update sale", error: error.message });
  }
});


/*
router.put("/update_sale/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params;
  const { CashPay, CardPay, Balance, customerId } = req.body;

  try {
    // Validate input data
    if (
      CashPay === undefined || CashPay === null || isNaN(CashPay) ||
      CardPay === undefined || CardPay === null || isNaN(CardPay) ||
      Balance === undefined || Balance === null || isNaN(Balance) ||
      //!customerId
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Fetch the current amounts from the sales table
    const fetchQuery = `
      SELECT CashPay, CardPay 
      FROM sales 
      WHERE invoiceId = ?
    `;

    const rows = await db.query(fetchQuery, [invoiceId]);

    // Check if the invoice exists
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const currentData = rows[0];
    const currentCash = parseFloat(currentData.CashPay) || 0;
    const currentCard = parseFloat(currentData.CardPay) || 0;

    // Parse incoming amounts
    const newCashPay = parseFloat(CashPay) || 0;
    const newCardPay = parseFloat(CardPay) || 0;
    const newBalance = parseFloat(Balance) || 0;

    // Determine the PaymentType
    let paymentType = "Unknown";
    if (newCashPay > 0 && newCardPay > 0) {
      paymentType = "Cash and Card Payment";
    } else if (newCashPay > 0) {
      paymentType = "Cash Payment";
    } else if (newCardPay > 0) {
      paymentType = "Card Payment";
    }

    // Calculate incremental amounts
    const cashIncrement = newCashPay - currentCash;
    const cardIncrement = newCardPay - currentCard;
    const totalIncrement = cashIncrement + cardIncrement;

    // Validate increments
    if (cashIncrement < 0 || cardIncrement < 0) {
      return res.status(400).json({
        message: "Invalid input: CashPay and CardPay cannot decrease.",
      });
    }

    // Insert the incremental amounts into the customer_loan_payment table
    const insertPaymentQuery = `
      INSERT INTO customer_loan_payment (customerId, invoiceId, cashPayment, cardPayment, totalPayment)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(insertPaymentQuery, [
      customerId,
      invoiceId,
      cashIncrement > 0 ? cashIncrement : 0,
      cardIncrement > 0 ? cardIncrement : 0,
      totalIncrement > 0 ? totalIncrement : 0,
    ]);

    // Update the sales table with the new values
    const updateSalesQuery = `
      UPDATE sales 
      SET CashPay = ?, CardPay = ?, Balance = ?, PaymentType = ?
      WHERE invoiceId = ?
    `;
    const updateResult = await db.query(updateSalesQuery, [
      newCashPay,
      newCardPay,
      newBalance,
      paymentType,
      invoiceId,
    ]);

    // Check if the update was successful
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Invoice not found during update" });
    }

    res.status(200).json({ message: "Sale updated successfully" });
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ message: "Failed to update sale", error: error.message });
  }
});

*/


router.get("/payment_history/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const query = `
      SELECT * FROM customer_loan_payment
      WHERE invoiceId = ?
      ORDER BY saveTime DESC
    `;
    const payments = await db.query(query, [invoiceId]);

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
});



/*
router.delete("/delete_payment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  try {
    // Fetch the payment details to determine the amounts to revert
    const fetchPaymentQuery = `
      SELECT invoiceId, cashPayment, cardPayment, totalPayment 
      FROM customer_loan_payment 
      WHERE id = ?
    `;
    const [payment] = await db.query(fetchPaymentQuery, [paymentId]);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const { invoiceId, cashPayment, cardPayment, totalPayment } = payment;

    // Fetch current sales details
    const fetchSalesQuery = `
      SELECT CashPay, CardPay, Balance, PaymentType 
      FROM sales 
      WHERE invoiceId = ?
    `;
    const [sale] = await db.query(fetchSalesQuery, [invoiceId]);

    if (!sale) {
      return res.status(404).json({ message: "Invoice not found in sales table" });
    }

    const currentCashPay = parseFloat(sale.CashPay) || 0;
    const currentCardPay = parseFloat(sale.CardPay) || 0;
    const currentBalance = parseFloat(sale.Balance) || 0;

    // Calculate new values for the sales table
    const updatedCashPay = currentCashPay - (parseFloat(cashPayment) || 0);
    const updatedCardPay = currentCardPay - (parseFloat(cardPayment) || 0);
    const updatedBalance = currentBalance - (parseFloat(totalPayment) || 0);

    // Determine if PaymentType should be updated
    let newPaymentType = sale.PaymentType; // Default to existing PaymentType

    if (updatedBalance === 0) {
      // Only update PaymentType if balance is 0
      if (updatedCashPay > 0 && updatedCardPay > 0) {
        newPaymentType = "Cash and Card Payment";
      } else if (updatedCashPay > 0) {
        newPaymentType = "Cash Payment";
      } else if (updatedCardPay > 0) {
        newPaymentType = "Card Payment";
      } else {
        newPaymentType = "Unknown"; // Default case if no payments exist
      }
    }

    // Update the sales table
    const updateSalesQuery = `
      UPDATE sales 
      SET CashPay = ?, CardPay = ?, Balance = ?
      ${updatedBalance === 0 ? ", PaymentType = ?" : ""} 
      WHERE invoiceId = ?
    `;
    const updateParams = updatedBalance === 0
      ? [updatedCashPay, updatedCardPay, updatedBalance, newPaymentType, invoiceId]
      : [updatedCashPay, updatedCardPay, updatedBalance, invoiceId];

    await db.query(updateSalesQuery, updateParams);

    // Delete the payment record from the customer_loan_payment table
    const deletePaymentQuery = `
      DELETE FROM customer_loan_payment 
      WHERE id = ?
    `;
    await db.query(deletePaymentQuery, [paymentId]);

    res.status(200).json({
      message: "Payment deleted and sales updated successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({
      message: "Failed to delete payment",
      error: error.message,
    });
  }
});*/



router.delete("/delete_payment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  try {
    // Fetch the payment details
    const fetchPaymentQuery = `
      SELECT invoiceId, cashPayment, cardPayment, totalPayment 
      FROM customer_loan_payment 
      WHERE id = ?
    `;
    const [payment] = await db.query(fetchPaymentQuery, [paymentId]);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const { invoiceId, cashPayment, cardPayment, totalPayment } = payment;

    // Fetch current sales details
    const fetchSalesQuery = `
      SELECT CashPay, CardPay, Balance, PaymentType 
      FROM sales 
      WHERE invoiceId = ?
    `;
    const [sale] = await db.query(fetchSalesQuery, [invoiceId]);

    if (!sale) {
      return res.status(404).json({ message: "Invoice not found in sales table" });
    }

    const currentCashPay = parseFloat(sale.CashPay) || 0;
    const currentCardPay = parseFloat(sale.CardPay) || 0;
    const currentBalance = parseFloat(sale.Balance) || 0;

    // Calculate updated values
    const updatedCashPay = currentCashPay - (parseFloat(cashPayment) || 0);
    const updatedCardPay = currentCardPay - (parseFloat(cardPayment) || 0);
    const updatedBalance = currentBalance - (parseFloat(totalPayment) || 0);

    // Determine new PaymentType only if Balance becomes 0
    let newPaymentType = sale.PaymentType;
    if (updatedBalance === 0) {
      if (updatedCashPay > 0 && updatedCardPay > 0) {
        newPaymentType = "Cash and Card Payment";
      } else if (updatedCashPay > 0) {
        newPaymentType = "Cash Payment";
      } else if (updatedCardPay > 0) {
        newPaymentType = "Card Payment";
      } else {
        newPaymentType = "Unknown";
      }
    }

    // Update the sales record
    const updateSalesQuery = `
      UPDATE sales 
      SET CashPay = ?, CardPay = ?, Balance = ?
      ${updatedBalance === 0 ? ", PaymentType = ?" : ""} 
      WHERE invoiceId = ?
    `;
    const updateParams = updatedBalance === 0
      ? [updatedCashPay, updatedCardPay, updatedBalance, newPaymentType, invoiceId]
      : [updatedCashPay, updatedCardPay, updatedBalance, invoiceId];

    await db.query(updateSalesQuery, updateParams);

    // Delete the payment record
    const deletePaymentQuery = `
      DELETE FROM customer_loan_payment 
      WHERE id = ?
    `;
    await db.query(deletePaymentQuery, [paymentId]);

    res.status(200).json({
      message: "Payment deleted and sales updated successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({
      message: "Failed to delete payment",
      error: error.message,
    });
  }
});




router.get("/report", async (req, res) => {
  const { query, startDate, endDate } = req.query;

  try {
    // Fetch customer details
    const customerQuery = `
      SELECT * FROM customers 
      WHERE id = ? OR mobile1 = ? OR mobile2 = ? 
    `;
    const [customer] = await db.query(customerQuery, [query, query, query, query]);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch sales data with date range filtering
    let salesQuery = `
      SELECT * FROM sales 
      WHERE CustomerId = ?
    `;
    const params = [customer.id];

    if (startDate) {
      salesQuery += ` AND createdAt >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      salesQuery += ` AND createdAt <= ?`;
      params.push(endDate);
    }

    const sales = await db.query(salesQuery, params);

    res.status(200).json({ sales });
  } catch (error) {
    console.error("Error fetching customer report:", error.message);
    res.status(500).json({ message: "Failed to fetch customer report" });
  }
});




router.get("/fetch_loan_payments", async (req, res) => {
  const { invoiceId, startDate, endDate } = req.query;

  try {
    let query = `
      SELECT * FROM customer_loan_payment WHERE 1=1
    `;
    const params = [];

    if (invoiceId) {
      query += ` AND invoiceId = ?`;
      params.push(invoiceId);
    }
    if (startDate) {
      query += ` AND saveTime >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND saveTime <= ?`;
      params.push(endDate);
    }

    const results = await db.query(query, params);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching loan payments:", error.message);
    res.status(500).json({ message: "Failed to fetch loan payments" });
  }
});













module.exports = router;

const express = require('express');
const db = require('../db'); // Your database connection
const moment = require('moment'); // For formatting dates

const router = express.Router();

// Create suppliers table if it doesn't exist
const createSuppliersTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS suppliers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      Supid VARCHAR(255) NOT NULL UNIQUE,
      Supname VARCHAR(255) NOT NULL,
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      address3 VARCHAR(255),
      email VARCHAR(255),
      idno VARCHAR(255),
      mobile1 VARCHAR(10),
      mobile2 VARCHAR(10),
      mobile3 VARCHAR(10),
      company VARCHAR(255),
      faxnum VARCHAR(255),
      website VARCHAR(255),
      status ENUM('active', 'inactive') DEFAULT 'active',
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating suppliers table:', err);
    } else {
      console.log('Suppliers table exists or created successfully.');
    }
  });
};

// Function to create the banksupplier table
const createBankSupplierTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS banksupplier (
      id INT AUTO_INCREMENT PRIMARY KEY,
      supId VARCHAR(255) NOT NULL,
      supName VARCHAR(255) NOT NULL,
      supBank VARCHAR(255) NOT NULL,
      supBankNo VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating banksupplier table:', err);
    } else {
      console.log('Banksupplier table created or already exists.');
    }
  });
};

// Function to create the delete_suppliers table
const createDeleteSuppliersTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS delete_suppliers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      Supid VARCHAR(255) NOT NULL,
      Supname VARCHAR(255) NOT NULL,
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      address3 VARCHAR(255),
      email VARCHAR(255),
      idno VARCHAR(255),
      mobile1 VARCHAR(255),
      mobile2 VARCHAR(255),
      mobile3 VARCHAR(255),
      company VARCHAR(255),
      faxnum VARCHAR(255),
      website VARCHAR(255),
      status VARCHAR(255),
      user VARCHAR(255),
      store VARCHAR(255),
      deleteTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating delete_suppliers table:', err);
    } else {
      console.log('Delete_suppliers table created or already exists.');
    }
  });
};

// Function to create the delete_bank_supplier table
const createDeleteBankSupplierTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS delete_bank_supplier (
      id INT AUTO_INCREMENT PRIMARY KEY,
      supId VARCHAR(255) NOT NULL,
      supName VARCHAR(255) NOT NULL,
      supBank VARCHAR(255) NOT NULL,
      supBankNo VARCHAR(255) NOT NULL,
      deleteTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating delete_bank_supplier table:', err);
    } else {
      console.log('Delete_bank_supplier table created or already exists.');
    }
  });
};




// Initialize tables
createSuppliersTable();
createBankSupplierTable();
createDeleteSuppliersTable();
createDeleteBankSupplierTable();




// API to create a supplier and save bank details
router.post("/create_supplier", (req, res) => {
  const {
    Supid, Supname, address1, address2, address3, email, idno, mobile1,
    mobile2, mobile3, company, faxnum, website, status, user, store,
    bankName, accountNumber
  } = req.body;

  if (!Supid || !Supname) {
    return res.status(400).json({ message: "Supplier ID and Supplier Name are required." });
  }

  const insertSupplierQuery = `
    INSERT INTO suppliers 
    (Supid, Supname, address1, address2, address3, email, idno, mobile1, mobile2, mobile3, company, faxnum, website, status, user, store) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(insertSupplierQuery, [
    Supid, Supname, address1, address2, address3, email, idno, mobile1,
    mobile2, mobile3, company, faxnum, website, status, user, store
  ], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Duplicate Supplier ID" });
      }
      return res.status(500).json({ message: "Error saving supplier." });
    }

    if (accountNumber && bankName) {
      const insertBankSupplierQuery = `
        INSERT INTO banksupplier (supId, supName, supBank, supBankNo) 
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertBankSupplierQuery, [Supid, Supname, bankName, accountNumber], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error saving supplier bank details." });
        }
        res.status(201).json({ message: "Supplier and bank details added successfully." });
      });
    } else {
      res.status(201).json({ message: "Supplier added successfully without bank details." });
    }
  });
});





// API to check for duplicate Supplier ID or Name
router.post("/check_supplier_duplicate", (req, res) => {
  const { Supid, Supname } = req.body;

  const query = `
    SELECT * FROM suppliers WHERE Supid = ? OR Supname = ?
  `;
  db.query(query, [Supid, Supname], (err, results) => {
    if (err) {
      console.error('Error checking for duplicates:', err);
      return res.status(500).json({ message: 'Error checking for duplicates' });
    }
    if (results.length > 0) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  });
});





// API to delete supplier from delete_suppliers and banksupplier tables
router.delete("/delete_supplier_removed/:supId", (req, res) => {
  const { supId } = req.params;

  const selectBankSupplierQuery = `SELECT * FROM delete_bank_supplier WHERE supId = ?`;
  db.query(selectBankSupplierQuery, [supId], (err, bankResult) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bank details" });
    }

    if (bankResult.length > 0) {
      const deleteBankSupplierQuery = `DELETE FROM delete_bank_supplier WHERE supId = ?`;
      db.query(deleteBankSupplierQuery, [supId], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error deleting bank details" });
        }

        const deleteSupplierQuery = `DELETE FROM delete_suppliers WHERE Supid = ?`;
        db.query(deleteSupplierQuery, [supId], (err) => {
          if (err) {
            return res.status(500).json({ message: "Error deleting supplier" });
          }
          res.status(200).json({ message: "Supplier and bank details deleted successfully" });
        });
      });
    } else {
      const deleteSupplierQuery = `DELETE FROM delete_suppliers WHERE Supid = ?`;
      db.query(deleteSupplierQuery, [supId], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error deleting supplier" });
        }
        res.status(200).json({ message: "Supplier deleted successfully without bank details" });
      });
    }
  });
});




// API to delete supplier and save deleted details
router.delete("/delete_supplier/:supId", (req, res) => {
  const { supId } = req.params;

  const selectSupplierQuery = `SELECT * FROM suppliers WHERE Supid = ?`;
  db.query(selectSupplierQuery, [supId], (err, supplierResult) => {
    if (err || supplierResult.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const supplierData = supplierResult[0];

    const insertDeleteSupplierQuery = `
      INSERT INTO delete_suppliers 
      (Supid, Supname, address1, address2, address3, email, idno, mobile1, mobile2, mobile3, company, faxnum, website, status, user, store) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertDeleteSupplierQuery, [
      supplierData.Supid, supplierData.Supname, supplierData.address1,
      supplierData.address2, supplierData.address3, supplierData.email,
      supplierData.idno, supplierData.mobile1, supplierData.mobile2,
      supplierData.mobile3, supplierData.company, supplierData.faxnum,
      supplierData.website, supplierData.status, supplierData.user, supplierData.store
    ], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving deleted supplier data" });
      }

      const selectBankSupplierQuery = `SELECT * FROM banksupplier WHERE supId = ?`;
      db.query(selectBankSupplierQuery, [supId], (err, bankResult) => {
        if (err) {
          return res.status(500).json({ message: "Error fetching bank details" });
        }

        if (bankResult.length > 0) {
          const bankData = bankResult[0];
          const insertDeleteBankSupplierQuery = `
            INSERT INTO delete_bank_supplier (supId, supName, supBank, supBankNo) 
            VALUES (?, ?, ?, ?)
          `;
          db.query(insertDeleteBankSupplierQuery, [bankData.supId, bankData.supName, bankData.supBank, bankData.supBankNo], (err) => {
            if (err) {
              return res.status(500).json({ message: "Error saving deleted bank details" });
            }

            const deleteSupplierQuery = `DELETE FROM suppliers WHERE Supid = ?`;
            db.query(deleteSupplierQuery, [supId], (err) => {
              if (err) {
                return res.status(500).json({ message: "Error deleting supplier" });
              }

              const deleteBankSupplierQuery = `DELETE FROM banksupplier WHERE supId = ?`;
              db.query(deleteBankSupplierQuery, [supId], (err) => {
                if (err) {
                  return res.status(500).json({ message: "Error deleting bank details" });
                }
                res.status(200).json({ message: "Supplier and bank details deleted successfully" });
              });
            });
          });
        } else {
          const deleteSupplierQuery = `DELETE FROM suppliers WHERE Supid = ?`;
          db.query(deleteSupplierQuery, [supId], (err) => {
            if (err) {
              return res.status(500).json({ message: "Error deleting supplier" });
            }
            res.status(200).json({ message: "Supplier deleted successfully without bank details" });
          });
        }
      });
    });
  });
});




// API to get all suppliers
router.get("/get_suppliers", (req, res) => {
  const query = "SELECT Supid, Supname, address1, email, mobile1, company, status, store FROM suppliers";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching suppliers" });
    }
    res.status(200).json(results);
  });
});




// API to get all removed suppliers
router.get("/get_suppliers_removed", (req, res) => {
  const query = "SELECT Supid, Supname, address1, email, mobile1, company, status, store FROM delete_suppliers";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching suppliers" });
    }
    res.status(200).json(results);
  });
});





// API to get bank details for a specific supplier
router.get("/get_supplier_bank_details/:supId", (req, res) => {
  const { supId } = req.params;
  const selectBankQuery = `SELECT supBank, supBankNo FROM banksupplier WHERE supId = ?`;

  db.query(selectBankQuery, [supId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bank details" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No bank details found for this supplier" });
    }
    return res.status(200).json(results[0]);
  });
});




// API to get removed bank details for a specific supplier
router.get("/get_supplier_bank_details_removed/:supId", (req, res) => {
  const { supId } = req.params;
  const selectBankQuery = `SELECT supBank, supBankNo FROM delete_bank_supplier WHERE supId = ?`;

  db.query(selectBankQuery, [supId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bank details" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No bank details found for this supplier" });
    }
    return res.status(200).json(results[0]);
  });
});



// Export the router
module.exports = router;

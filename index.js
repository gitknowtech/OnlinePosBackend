const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../OnlinePosBackend/db'); 
const moment = require('moment'); 

const app = express();
app.use(cors());
app.use(express.json());

// Check if the uploads directory exists, if not, create it
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });





// Function to create the 'categories' table if it doesn't exist
const createBankTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS banks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bankName VARCHAR(255) NOT NULL,
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating categories table:', err);
    } else {
      console.log('Categories table exists or created successfully');
    }
  });
};



// Function to create the 'companies' table if it doesn't exist
const createCompaniesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS companies (
      Comid VARCHAR(255) PRIMARY KEY,
      Comname VARCHAR(255) NOT NULL,
      Mobile VARCHAR(15) NOT NULL,
      Location VARCHAR(255) NOT NULL,
      Email VARCHAR(255) NOT NULL,
      Image VARCHAR(255)
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating companies table:', err);
    } else {
      console.log('Companies table exists or created successfully');
    }
  });
};


// Function to create the 'User' table if it doesn't exist
const createUserTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(255) NOT NULL,
      Email VARCHAR(255) NOT NULL UNIQUE,
      UserName VARCHAR(255) NOT NULL UNIQUE,
      Password VARCHAR(255) NOT NULL,
      Image VARCHAR(255),
      Type VARCHAR(255) NOT NULL,
      Store VARCHAR(255) NOT NULL,
      register_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
      last_login DATETIME DEFAULT NULL 
    )
  `;

  // Execute the query to create the table
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created or already exists.');
    }
  });
};


// Function to create the 'categories' table if it doesn't exist
const createCategoriesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      catName VARCHAR(255) NOT NULL,
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating categories table:', err);
    } else {
      console.log('Categories table exists or created successfully');
    }
  });
};




const createUnitsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS units (
      id INT AUTO_INCREMENT PRIMARY KEY,
      unitName VARCHAR(255) NOT NULL,
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating units table:', err);
    } else {
      console.log('Units table exists or created successfully');
    }
  });
};


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

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating suppliers table:', err);
    } else {
      console.log('Suppliers table exists or created successfully');
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

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating banksupplier table:", err);
    } else {
      console.log("Banksupplier table exists or created successfully");
    }
  });
};



// Function to create the 'delete_suppliers' table if it doesn't exist
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

  // Execute the query to create the delete_suppliers table
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating delete_suppliers table:', err);
    } else {
      console.log('delete_suppliers table created or already exists.');
    }
  });
};

// Function to create the 'delete_bank_supplier' table if it doesn't exist
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

  // Execute the query to create the delete_bank_supplier table
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating delete_bank_supplier table:', err);
    } else {
      console.log('delete_bank_supplier table created or already exists.');
    }
  });
};


const createStoresTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS stores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      storeName VARCHAR(255) NOT NULL,
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating stores table:', err);
    } else {
      console.log('Stores table exists or created successfully');
    }
  });
};


// Create the products table if it doesn't exist
const createProductTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productId VARCHAR(255) NOT NULL,
      productName VARCHAR(255) NOT NULL,
      productNameSinhala VARCHAR(255),
      barcode VARCHAR(255),
      batchNumber VARCHAR(255),
      selectedSupplier VARCHAR(255),
      selectedCategory VARCHAR(255),
      selectedUnit VARCHAR(255),
      manufacturingDate DATE,
      expiringDate DATE,
      costPrice DECIMAL(10, 2),
      mrpPrice DECIMAL(10, 2),
      profitPercentage DECIMAL(5, 2),
      profitAmount DECIMAL(10, 2),
      discountPrice DECIMAL(10, 2),
      discountPercentage DECIMAL(5, 2),
      wholesalePrice DECIMAL(10, 2),
      wholesalePercentage DECIMAL(5, 2),
      lockedPrice DECIMAL(10, 2),
      availableStock INT,
      stockAlert INT,
      store VARCHAR(255),
      user VARCHAR(255),
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating products table:", err);
    } else {
      console.log("Products table exists or created successfully");
    }
  });
};


// Create batches table
const createBatchesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS batches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      batchName VARCHAR(255) NOT NULL,
      user VARCHAR(255) NOT NULL,
      store VARCHAR(255) NOT NULL,
      saveTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating batches table:', err);
    } else {
      console.log('Batches table exists or created successfully');
    }
  });
};





// Call these functions when initializing your database

createDeleteSuppliersTable();
createDeleteBankSupplierTable();
createUnitsTable();
createCategoriesTable();
createCompaniesTable();
createUserTable();
createBankTable();
createSuppliersTable();
createBankSupplierTable();
createStoresTable();
createProductTable();
createBatchesTable();



// Assuming Express.js is being used
app.get("/api/user/:username", (req, res) => {
  const { username } = req.params;

  // Query to get user details from the database
  const query = "SELECT * FROM users WHERE UserName = ?";

  db.query(query, [username], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Log the error for debugging
      return res.status(500).json({ message: "Internal server error", error: err });
    }

    // If user is found, return the user data
    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } 
    // If no user is found, return a 404 error
    else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});




const bcrypt = require('bcrypt');

// POST route to handle form data and file upload for inserting admin data
// POST route to handle form data and file upload for inserting admin data
app.post('/create-admin', upload.single('Image'), async (req, res) => {
  const { Name, Email, UserName, Password } = req.body;
  const imagePath = req.file ? req.file.path : null; // Get file path of the uploaded image

  try {
    console.log('Received data:', { Name, Email, UserName, Password, imagePath }); // Debugging log

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(Password, 10); // 10 salt rounds

    // Get current timestamp for register_time and last_login
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss'); // Timestamp in MySQL format

    // Insert query to save data into the users table, including register_time and last_login
    const insertQuery = `
      INSERT INTO users (Name, Email, UserName, Password, Image, Type, Store, register_time, last_login)
      VALUES (?, ?, ?, ?, ?, 'admin', 'all', ?, ?)
    `;

    // Execute the query with the current time for both fields
    db.query(insertQuery, [Name, Email, UserName, hashedPassword, imagePath, currentTime, currentTime], (err, result) => {
      if (err) {
        console.error('Database error:', err); // Log the exact error
        return res.status(500).json({ error: JSON.stringify(err) }); // Return the exact error object as a string
      }
      res.status(200).json({ message: 'Admin account created successfully', id: result.insertId });
    });
  } catch (err) {
    console.error('Error during hashing or database query:', err); // Log detailed error
    res.status(500).json({ error: err.message || 'Server error' }); // Return a detailed error message
  }
});




// POST route to handle form data and file upload
app.post('/companies', upload.single('Image'), (req, res) => {
  const { Comid, Comname, Mobile, Location, Email } = req.body; // Added email
  const imagePath = req.file ? req.file.path : null; // Get file path

  // Check if the company already exists in the database
  const checkQuery = `SELECT * FROM companies WHERE Comid = ?`;

  db.query(checkQuery, [Comid], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ error: 'Database error occurred' });
    }

    // If company with the same Comid exists, return an error
    if (checkResult.length > 0) {
      return res.status(400).json({ error: 'Company with this ID already exists' });
    }

    // If the company does not exist, proceed with inserting the new company
    const insertQuery = `
      INSERT INTO companies (Comid, Comname, Mobile, Location, Email, Image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [Comid, Comname, Mobile, Location, Email, imagePath], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving company data' });
      }
      res.status(200).json({ message: 'Company added successfully', id: result.insertId });
    });
  });
});




// New route to check if the companies table has any data
app.get('/check-companies', (req, res) => {
  const checkQuery = `SELECT COUNT(*) as count FROM companies`;

  db.query(checkQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred' });
    }

    const count = result[0].count;
    if (count > 0) {
      res.status(200).json({ hasData: true });
    } else {
      res.status(200).json({ hasData: false });
    }
  });
});



app.get('/check-duplicate', (req, res) => {
  const { Email, UserName } = req.query;

  const emailCheckQuery = `SELECT COUNT(*) as emailCount FROM users WHERE Email = ?`;
  const usernameCheckQuery = `SELECT COUNT(*) as usernameCount FROM users WHERE UserName = ?`;

  db.query(emailCheckQuery, [Email], (emailErr, emailResult) => {
    if (emailErr) return res.status(500).json({ error: 'Database error' });

    db.query(usernameCheckQuery, [UserName], (usernameErr, usernameResult) => {
      if (usernameErr) return res.status(500).json({ error: 'Database error' });

      res.json({
        emailExists: emailResult[0].emailCount > 0,
        usernameExists: usernameResult[0].usernameCount > 0,
      });
    });
  });
});



// New route to check if the users table has any data
app.get('/check-users', (req, res) => {
  const checkQuery = `SELECT COUNT(*) as count FROM users`;

  db.query(checkQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred' });
    }

    const count = result[0].count;
    if (count > 0) {
      res.status(200).json({ hasData: true });
    } else {
      res.status(200).json({ hasData: false });
    }
  });
});




// POST route for login
app.post('/login', (req, res) => {
  const { UserName, Password } = req.body;

  // Query to get the user by username
  const loginQuery = `SELECT * FROM users WHERE UserName = ?`;

  db.query(loginQuery, [UserName], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (result.length > 0) {
      const user = result[0];

      // Compare the entered password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(Password, user.Password);

      if (passwordMatch) {
        // Update last_login to the current timestamp
        const updateLastLoginQuery = `UPDATE users SET last_login = ? WHERE id = ?`;
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

        db.query(updateLastLoginQuery, [currentTime, user.id], (err, updateResult) => {
          if (err) {
            console.error('Error updating last login:', err);
            return res.status(500).json({ success: false, message: 'Failed to update last login' });
          }

          // After updating, send user details in the response
          return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
              UserName: user.UserName,
              Image: user.Image,   // Assuming there's an Image field in your DB
              Store: user.Store,   // Assuming there's a Store field in your DB
              Type: user.Type,     // Assuming there's a Type field in your DB
              Email: user.Email,   // Added the Email field
              LastLogin: currentTime // Return the updated last_login time
            }
          });
        });
      } else {
        // If passwords don't match
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } else {
      // If username is not found
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});




//add category for the table
app.post("/api/create_categories", (req, res) => {
  const { id, catName, user, store, saveTime } = req.body;

  const insertQuery = "INSERT INTO categories (id, catName, user, store, saveTime) VALUES (?, ?, ?, ?, ?)";

  db.query(insertQuery, [id, catName, user, store, saveTime], (err, result) => {
    if (err) {
      // Handle duplicate entry error (MySQL error code 1062)
      if (err.code === 'ER_DUP_ENTRY') {
        console.error('Duplicate ID detected:', err);
        return res.status(400).json({ 
          message: "Duplicate ID",
          error: err.message || 'Duplicate ID error',
          code: err.code || 'No code',
          errno: err.errno || 'No errno'
        });
      }

      // Log other MySQL errors
      console.error('Error saving category to database:', err);
      return res.status(500).json({ 
        message: "Error saving category. Please try again.", 
        error: err.message || 'Unknown error', 
        sqlMessage: err.sqlMessage || 'No SQL message', 
        code: err.code || 'No code', 
        errno: err.errno || 'No errno'
      });
    }

    return res.status(201).json({ message: "Category added successfully" });
  });
});




// Fetch all categories from the database
app.get("/api/get_categories", (req, res) => {
  const query = "SELECT * FROM categories";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ message: "Error fetching categories" });
    }
    return res.status(200).json(results);
  });
});


// API to update the category by categoryId
app.put('/api/update_category/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const { catName } = req.body;

  // Check if category name is provided
  if (!catName || catName.trim() === '') {
    return res.status(400).json({ message: 'Category name cannot be empty' });
  }

  // Check if category name already exists (ignore case)
  const checkDuplicateQuery = `SELECT * FROM categories WHERE LOWER(catName) = LOWER(?) AND id != ?`;
  db.query(checkDuplicateQuery, [catName, categoryId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking for duplicate category' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    // Update category name in the database
    const updateCategoryQuery = `UPDATE categories SET catName = ? WHERE id = ?`;
    db.query(updateCategoryQuery, [catName, categoryId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating category' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json({ message: 'Category updated successfully' });
    });
  });
});



app.delete("/api/delete_category", (req, res) => {
  const { catName } = req.body;

  const deleteQuery = "DELETE FROM categories WHERE catName = ?";

  db.query(deleteQuery, [catName], (err, result) => {
    if (err) {
      console.error('Error deleting category from database:', err);
      return res.status(500).json({ message: "Error deleting category" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  });
});




app.delete("/api/delete_unit", (req, res) => {
  const { unitName } = req.body;

  const deleteQuery = "DELETE FROM units WHERE unitName = ?";

  db.query(deleteQuery, [unitName], (err, result) => {
    if (err) {
      console.error('Error deleting unit from database:', err);
      return res.status(500).json({ message: "Error deleting unit" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Unit not found" });
    }

    return res.status(200).json({ message: "Unit deleted successfully" });
  });
});


app.put('/api/update_unit/:unitId', (req, res) => {
  const { unitId } = req.params;
  const { unitName } = req.body;

  if (!unitName || unitName.trim() === '') {
    return res.status(400).json({ message: 'Unit name cannot be empty' });
  }

  // Check for duplicate unit name
  const checkDuplicateQuery = `SELECT * FROM units WHERE LOWER(unitName) = LOWER(?) AND id != ?`;
  db.query(checkDuplicateQuery, [unitName, unitId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking for duplicate unit' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Unit name already exists' });
    }

    // Update the unit in the database
    const updateUnitQuery = `UPDATE units SET unitName = ? WHERE id = ?`;
    db.query(updateUnitQuery, [unitName, unitId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating unit' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Unit not found' });
      }

      res.status(200).json({ message: 'Unit updated successfully' });
    });
  });
});



app.get("/api/get_units", (req, res) => {
  const query = "SELECT * FROM units";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching units:', err);
      return res.status(500).json({ message: "Error fetching units" });
    }
    return res.status(200).json(results);
  });
});


app.post("/api/create_units", (req, res) => {
  const { id, unitName, user, store, saveTime } = req.body;

  const insertQuery = "INSERT INTO units (id, unitName, user, store, saveTime) VALUES (?, ?, ?, ?, ?)";

  db.query(insertQuery, [id, unitName, user, store, saveTime], (err, result) => {
    if (err) {
      // Handle duplicate entry error (MySQL error code 1062)
      if (err.code === 'ER_DUP_ENTRY') {
        console.error('Duplicate ID detected:', err);
        return res.status(400).json({ 
          message: "Duplicate ID",
          error: err.message || 'Duplicate ID error',
          code: err.code || 'No code',
          errno: err.errno || 'No errno'
        });
      }

      // Log other MySQL errors
      console.error('Error saving unit to database:', err);
      return res.status(500).json({ 
        message: "Error saving unit. Please try again.", 
        error: err.message || 'Unknown error', 
        sqlMessage: err.sqlMessage || 'No SQL message', 
        code: err.code || 'No code', 
        errno: err.errno || 'No errno'
      });
    }

    return res.status(201).json({ message: "Unit added successfully" });
  });
});


//bank databse data codes
app.delete("/api/delete_bank", (req, res) => {
  const { bankName } = req.body;

  const deleteQuery = "DELETE FROM banks WHERE bankName = ?";

  db.query(deleteQuery, [bankName], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting bank" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bank not found" });
    }

    return res.status(200).json({ message: "Bank deleted successfully" });
  });
});
 

app.get("/api/get_banks", (req, res) => {
  const query = "SELECT * FROM banks";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching banks" });
    }
    return res.status(200).json(results);
  });
});


app.post("/api/create_banks", (req, res) => {
  const { id, bankName, user, store, saveTime } = req.body;

  const insertQuery = "INSERT INTO banks (id, bankName, user, store, saveTime) VALUES (?, ?, ?, ?, ?)";

  db.query(insertQuery, [id, bankName, user, store, saveTime], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          message: "Duplicate ID",
          error: err.message,
          code: err.code,
        });
      }
      return res.status(500).json({
        message: "Error saving bank. Please try again.",
        error: err.message,
      });
    }
    return res.status(201).json({ message: "Bank added successfully" });
  });
});





// API to create supplier and save bank details
app.post("/api/create_supplier", (req, res) => {
  const {
    Supid,
    Supname,
    address1,
    address2,
    address3,
    email,
    idno,
    mobile1,
    mobile2,
    mobile3,
    company,
    faxnum,
    website,
    status,
    user,
    store,
    bankName,
    accountNumber,
  } = req.body;

  if (!Supid || !Supname) {
    return res.status(400).json({ message: "Supplier ID and Supplier Name are required." });
  }

  const insertSupplierQuery = `
    INSERT INTO suppliers 
    (Supid, Supname, address1, address2, address3, email, idno, mobile1, mobile2, mobile3, company, faxnum, website, status, user, store) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertSupplierQuery,
    [Supid, Supname, address1, address2, address3, email, idno, mobile1, mobile2, mobile3, company, faxnum, website, status, user, store],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Duplicate Supplier ID" });
        }
        return res.status(500).json({ message: "Error saving supplier." });
      }

      // Only save to banksupplier if account number is provided
      if (accountNumber && bankName) {
        const insertBankSupplierQuery = `
          INSERT INTO banksupplier (supId, supName, supBank, supBankNo) 
          VALUES (?, ?, ?, ?)
        `;
        db.query(
          insertBankSupplierQuery,
          [Supid, Supname, bankName, accountNumber],
          (err) => {
            if (err) {
              return res.status(500).json({ message: "Error saving supplier bank details." });
            }
            res.status(201).json({ message: "Supplier and bank details added successfully" });
          }
        );
      } else {
        // If no bank details, just return a success response for supplier data
        res.status(201).json({ message: "Supplier added successfully without bank details" });
      }
    }
  );
});





// API to check for duplicate Supplier ID or Name
app.post("/api/check_duplicate", (req, res) => {
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



// API to get bank names
app.get("/api/get_banks", (req, res) => {
  const query = "SELECT id, bankName FROM banks";
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching banks." });
    }
    res.status(200).json(results);
  });
});


//removed supplier delete method
app.delete("/api/delete_supplier_removed/:supId", (req, res) => {
  const { supId } = req.params;

  // Check if bank details exist for the supplier
  const selectBankSupplierQuery = `SELECT * FROM delete_bank_supplier WHERE supId = ?`;
  db.query(selectBankSupplierQuery, [supId], (err, bankResult) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching bank details" });
    }

    if (bankResult.length > 0) {
      // Delete bank details from banksupplier table
      const deleteBankSupplierQuery = `DELETE FROM delete_bank_supplier WHERE supId = ?`;
      db.query(deleteBankSupplierQuery, [supId], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error deleting bank details" });
        }

        // Delete supplier from suppliers table
        const deleteSupplierQuery = `DELETE FROM delete_suppliers WHERE Supid = ?`;
        db.query(deleteSupplierQuery, [supId], (err) => {
          if (err) {
            return res.status(500).json({ message: "Error deleting supplier" });
          }
          res.status(200).json({ message: "Supplier and bank details deleted successfully" });
        });
      });
    } else {
      // If no bank details, just delete the supplier from suppliers table
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
app.delete("/api/delete_supplier/:supId", (req, res) => {
  const { supId } = req.params;

  // Query to get supplier data before deletion
  const selectSupplierQuery = `SELECT * FROM suppliers WHERE Supid = ?`;
  db.query(selectSupplierQuery, [supId], (err, supplierResult) => {
    if (err || supplierResult.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const supplierData = supplierResult[0];

    // Save supplier data to delete_suppliers table
    const insertDeleteSupplierQuery = `
      INSERT INTO delete_suppliers 
      (Supid, Supname, address1, address2, address3, email, idno, mobile1, mobile2, mobile3, company, faxnum, website, status, user, store) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertDeleteSupplierQuery,
      [
        supplierData.Supid,
        supplierData.Supname,
        supplierData.address1,
        supplierData.address2,
        supplierData.address3,
        supplierData.email,
        supplierData.idno,
        supplierData.mobile1,
        supplierData.mobile2,
        supplierData.mobile3,
        supplierData.company,
        supplierData.faxnum,
        supplierData.website,
        supplierData.status,
        supplierData.user,
        supplierData.store,
      ],
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Error saving deleted supplier data" });
        }

        // Check if bank details exist for the supplier
        const selectBankSupplierQuery = `SELECT * FROM banksupplier WHERE supId = ?`;
        db.query(selectBankSupplierQuery, [supId], (err, bankResult) => {
          if (err) {
            return res.status(500).json({ message: "Error fetching bank details" });
          }

          if (bankResult.length > 0) {
            const bankData = bankResult[0];

            // Save bank details to delete_bank_supplier table
            const insertDeleteBankSupplierQuery = `
              INSERT INTO delete_bank_supplier (supId, supName, supBank, supBankNo) 
              VALUES (?, ?, ?, ?)
            `;
            db.query(
              insertDeleteBankSupplierQuery,
              [bankData.supId, bankData.supName, bankData.supBank, bankData.supBankNo],
              (err) => {
                if (err) {
                  return res.status(500).json({ message: "Error saving deleted bank details" });
                }

                // Delete supplier from suppliers table
                const deleteSupplierQuery = `DELETE FROM suppliers WHERE Supid = ?`;
                db.query(deleteSupplierQuery, [supId], (err) => {
                  if (err) {
                    return res.status(500).json({ message: "Error deleting supplier" });
                  }

                  // Delete bank details from banksupplier table
                  const deleteBankSupplierQuery = `DELETE FROM banksupplier WHERE supId = ?`;
                  db.query(deleteBankSupplierQuery, [supId], (err) => {
                    if (err) {
                      return res.status(500).json({ message: "Error deleting bank details" });
                    }
                    res.status(200).json({ message: "Supplier and bank details deleted successfully" });
                  });
                });
              }
            );
          } else {
            // If no bank details, just delete the supplier from suppliers table
            const deleteSupplierQuery = `DELETE FROM suppliers WHERE Supid = ?`;
            db.query(deleteSupplierQuery, [supId], (err) => {
              if (err) {
                return res.status(500).json({ message: "Error deleting supplier" });
              }
              res.status(200).json({ message: "Supplier deleted successfully without bank details" });
            });
          }
        });
      }
    );
  });
});




app.get("/api/get_suppliers", (req, res) => {
  const query = "SELECT Supid, Supname, address1, email, mobile1, company, status, store FROM suppliers";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching suppliers" });
    }
    res.status(200).json(results);
  });
});



app.get("/api/get_suppliers_removed", (req, res) => {
  const query = "SELECT Supid, Supname, address1, email, mobile1, company, status, store FROM delete_suppliers";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching suppliers" });
    }
    res.status(200).json(results);
  });
});


// API to get bank details for a specific supplier
app.get("/api/get_bank_details/:supId", (req, res) => {
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




// API to get bank details for a specific supplier/
app.get("/api/get_bank_details_removed/:supId", (req, res) => {
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



// Delete store
app.delete("/api/delete_store/:storeId", (req, res) => {
  const { storeId } = req.params;

  const deleteQuery = "DELETE FROM stores WHERE id = ?";

  db.query(deleteQuery, [storeId], (err, result) => {
    if (err) {
      console.error('Error deleting store from database:', err);
      return res.status(500).json({ message: "Error deleting store" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json({ message: "Store deleted successfully" });
  });
});



// Get all stores
app.get("/api/get_stores", (req, res) => {
  const query = "SELECT * FROM stores";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching stores:', err);
      return res.status(500).json({ message: "Error fetching stores" });
    }
    return res.status(200).json(results);
  });
});


// Create new store
app.post("/api/create_store", (req, res) => {
  const { storeName, user, store } = req.body;

  const insertQuery = "INSERT INTO stores (storeName, user, store, saveTime) VALUES (?, ?, ?, NOW())";

  db.query(insertQuery, [storeName, user, store], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "Duplicate store name" });
      }

      console.error('Error saving store to database:', err);
      return res.status(500).json({ message: "Error saving store" });
    }

    return res.status(201).json({ message: "Store added successfully", id: result.insertId });
  });
});

// Update store API
app.put('/api/update_store/:id', (req, res) => {
  const storeId = req.params.id; // Get the store ID from the URL parameters
  const { storeName } = req.body; // Extract new store name from the request body

  // Validation
  if (!storeName) {
    return res.status(400).json({ message: 'Store name is required' });
  }

  const query = 'UPDATE stores SET storeName = ? WHERE id = ?';
  db.query(query, [storeName, storeId], (err, result) => {
    if (err) {
      console.error('Error updating store:', err);
      return res.status(500).json({ message: 'Error updating store' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({ message: `Store has been updated successfully.` });
  });
});



// Get batches API
app.get('/api/get_batches', (req, res) => {
  const query = 'SELECT * FROM batches';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching batches:', err);
      return res.status(500).json({ message: 'Error fetching batches' });
    }
    res.status(200).json(results);
  });
});


// Create batch API
app.post('/api/create_batches', (req, res) => {
  const { batchName, user, store } = req.body;
  
  // Validation
  if (!batchName || !user || !store) {
    return res.status(400).json({ message: 'Batch name, user, and store are required' });
  }

  const query = 'INSERT INTO batches (batchName, user, store) VALUES (?, ?, ?)';
  db.query(query, [batchName, user, store], (err, result) => {
    if (err) {
      console.error('Error creating batch:', err);
      return res.status(500).json({ message: 'Error creating batch' });
    }
    res.status(201).json({ id: result.insertId, batchName, user, store });
  });
});


// Delete batch API
app.delete('/api/delete_batch', (req, res) => {
  const { batchName } = req.body;

  // Validation
  if (!batchName) {
    return res.status(400).json({ message: 'Batch name is required' });
  }

  const query = 'DELETE FROM batches WHERE batchName = ?';
  db.query(query, [batchName], (err, result) => {
    if (err) {
      console.error('Error deleting batch:', err);
      return res.status(500).json({ message: 'Error deleting batch' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: `Batch "${batchName}" has been deleted successfully.` });
  });
});


// Update batch API
app.put('/api/update_batch/:id', (req, res) => {
  const batchId = req.params.id; // Get the batch ID from the URL parameters
  const { batchName } = req.body; // Extract new batch name from the request body

  // Validation
  if (!batchName) {
    return res.status(400).json({ message: 'Batch name is required' });
  }

  const query = 'UPDATE batches SET batchName = ? WHERE id = ?';
  db.query(query, [batchName, batchId], (err, result) => {
    if (err) {
      console.error('Error updating batch:', err);
      return res.status(500).json({ message: 'Error updating batch' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: `Batch has been updated successfully.` });
  });
});





// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

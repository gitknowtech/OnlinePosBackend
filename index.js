const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../OnlinePosBackend/db'); 
const moment = require('moment'); 
const crypto = require('crypto');
const productRoutes = require('./routes/products')
const companyRoute = require('./routes/company')
const categoryRoute = require('./routes/category')
const unitRoutes = require('./routes/unit')
const storeRoutes = require('./routes/store')
const batchRoutes = require('./routes/batch')
const bankRoutes = require('./routes/bank')
const supplierRoutes = require('./routes/supplier')
const stockRoutes = require('./routes/stock')
const invoiceRouter = require('./routes/invoice')
const expensesRouter = require('./routes/expenses')
const customerRouter = require('./routes/customer')
const supplierPurchaseRouter = require('./routes/purchases')

const app = express();
app.use(cors());
app.use(express.json());



//use the routes
app.use('/api/products', productRoutes)
app.use('/api/companies', companyRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/units', unitRoutes)
app.use('/api/stores', storeRoutes)
app.use('/api/batches', batchRoutes)
app.use('/api/banks', bankRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/stock', stockRoutes)
app.use('/api/invoices', invoiceRouter)
app.use('/api/expenses', expensesRouter)
app.use('/api/customer', customerRouter)
app.use('/api/purchases', supplierPurchaseRouter)




// Check if the uploads directory exists, if not, create it
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}




// Generate a 32-byte key from the environment variable or a default string
const generateKey = () => {
  return crypto
    .createHash('sha256')
    .update(process.env.SECRET_KEY || 'mySuperSecretKey')
    .digest('base64')
    .substr(0, 32); // Ensure exactly 32 bytes
};



// Encrypt the password
const encryptPassword = (password) => {
  const algorithm = 'aes-256-ctr';
  const key = generateKey();
  const iv = crypto.randomBytes(16); // 16 bytes for IV

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    encryptedPassword: encrypted.toString('hex'),
  };
};



// Decrypt the password
const decryptPassword = (encryptedPassword, iv) => {
  const algorithm = 'aes-256-ctr';
  const key = generateKey();

  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPassword, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString();
};



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




// Function to create the 'User' table if it doesn't exist
const createUserTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(255) NOT NULL,
      Email VARCHAR(255) NOT NULL UNIQUE,
      UserName VARCHAR(255) NOT NULL UNIQUE,
      Password VARCHAR(255) NOT NULL,
      iv VARCHAR(255) NOT NULL,
      Image VARCHAR(255),
      Type VARCHAR(255) NOT NULL,
      Store VARCHAR(255) NOT NULL,
      register_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME DEFAULT NULL
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created or already exists.');
    }
  });
};


// Call these functions when initializing your database

createUserTable();



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
app.post('/create-admin', upload.single('Image'), async (req, res) => {
  const { Name, Email, UserName, Password } = req.body;
  const imagePath = req.file ? req.file.path : null; // Get file path of the uploaded image

  try {
    console.log('Received data:', { Name, Email, UserName, Password, imagePath }); // Debugging log

    // Encrypt the password using your `encryptPassword` method
    const { encryptedPassword, iv } = encryptPassword(Password);

    // Get current timestamp for register_time and last_login
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss'); // Timestamp in MySQL format

    // Insert query to save data into the users table, including register_time, last_login, and iv
    const insertQuery = `
      INSERT INTO users (Name, Email, UserName, Password, iv, Image, Type, Store, register_time, last_login)
      VALUES (?, ?, ?, ?, ?, ?, 'admin', 'all', ?, ?)
    `;

    // Execute the query with the provided data
    db.query(insertQuery, [Name, Email, UserName, encryptedPassword, iv, imagePath, currentTime, currentTime], (err, result) => {
      if (err) {
        console.error('Database error:', err); // Log the exact error
        return res.status(500).json({ error: JSON.stringify(err) }); // Return the exact error object as a string
      }
      res.status(200).json({ message: 'Admin account created successfully', id: result.insertId });
    });
  } catch (err) {
    console.error('Error during encryption or database query:', err); // Log detailed error
    res.status(500).json({ error: err.message || 'Server error' }); // Return a detailed error message
  }
});




//create user file
app.post('/create-user', upload.single('Image'), async (req, res) => {
  const { Name, Email, UserName, Password, Store, Type } = req.body; // Use UserName directly
  const imagePath = req.file ? req.file.path : null;

  try {
    const { encryptedPassword, iv } = encryptPassword(Password); // Assume encryptPassword is defined
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // Insert user into `users` table
    const insertUserQuery = `
      INSERT INTO users (Name, Email, UserName, Password, iv, Image, Type, Store, register_time, last_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertUserQuery,
      [Name, Email, UserName, encryptedPassword, iv, imagePath, Type, Store, currentTime, currentTime],
      (err, result) => {
        if (err) {
          console.error('Database error during user creation:', err);
          return res.status(500).json({ error: 'Failed to save user to the database.' });
        }

        // Use the username to create the table
        const userTableName = `user_${UserName}`;
        const createTableQuery = `
          CREATE TABLE ${userTableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            value ENUM('yes', 'no') NOT NULL DEFAULT 'no'
          )
        `;

        db.query(createTableQuery, (createErr) => {
          if (createErr) {
            console.error('Database error during table creation:', createErr);
            return res.status(500).json({ error: 'Failed to create user-specific table.' });
          }

          // Predefine rows and insert into the new table
          const rows = [
            'Dashboard', 'Invoice', 'Sales', 'InvoiceList', 'SalesList',
            'Stock', 'StockIn', 'StockOut', 'GetStock', 'OutStock',
            'StockByCategory', 'StockBySupplier', 'StockByBatch', 'Product',
            'ProductCard', 'ProductList', 'AddProduct', 'ManageBatch',
            'ManageUnit', 'ManageCategory', 'RemovedProducts', 'Purchasing',
            'SupplierList', 'AddSupplier', 'SupplierPayment', 'ManageBank',
            'RemovedSupplier', 'User', 'AddUser', 'ManageUser', 'Customer',
            'ManageCustomer', 'AddCustomer', 'CreditSales', 'CustomerBalance',
            'Quotation', 'QuotationList', 'Charts', 'CustomerChart',
            'StockChart', 'StockOutChart', 'SaleChart', 'Setting', 'Reports',
            'Backup'
          ];

          const insertRowsQuery = `
            INSERT INTO ${userTableName} (name, value)
            VALUES ?
          `;

          const rowData = rows.map((rowName) => [rowName, 'no']);
          db.query(insertRowsQuery, [rowData], (insertErr) => {
            if (insertErr) {
              console.error('Database error during row insertion:', insertErr);
              return res.status(500).json({ error: 'Failed to populate user-specific table.' });
            }

            res.status(200).json({
              message: 'User account created successfully with user-specific table.',
              userName: UserName,
              tableName: userTableName,
            });
          });
        });
      }
    );
  } catch (err) {
    console.error('Error during user creation:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});



// Fetch all users
app.get("/api/users/get_users", (req, res) => {
  const query = "SELECT id, Name, Email, UserName, Password, iv, Type FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Failed to fetch users." });
    }
    res.status(200).json(results);
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

  const loginQuery = `SELECT * FROM users WHERE UserName = ?`;

  db.query(loginQuery, [UserName], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (result.length > 0) {
      const user = result[0];

      try {
        // Decrypt the stored password
        const decryptedPassword = decryptPassword(user.Password, user.iv);

        // Compare the decrypted password with the input password
        if (decryptedPassword === Password) {
          const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
          const updateLastLoginQuery = `UPDATE users SET last_login = ? WHERE id = ?`;

          db.query(updateLastLoginQuery, [currentTime, user.id], (err) => {
            if (err) {
              console.error('Error updating last login:', err);
              return res.status(500).json({ success: false, message: 'Failed to update last login' });
            }

            return res.status(200).json({
              success: true,
              message: 'Login successful',
              user: {
                UserName: user.UserName,
                Image: user.Image,
                Store: user.Store,
                Type: user.Type,
                Email: user.Email,
                LastLogin: currentTime,
              },
            });
          });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
      } catch (error) {
        console.error('Decryption error:', error);
        return res.status(500).json({ success: false, message: 'Password decryption failed' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
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





app.get('/check-duplicate', (req, res) => {
  const { Email, UserName } = req.query;

  const checkQuery = `
    SELECT 
      CASE WHEN EXISTS (SELECT 1 FROM users WHERE Email = ?) THEN 1 ELSE 0 END AS emailExists,
      CASE WHEN EXISTS (SELECT 1 FROM users WHERE UserName = ?) THEN 1 ELSE 0 END AS usernameExists
  `;

  db.query(checkQuery, [Email, UserName], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: "Internal server error", error: err });
    }

    const { emailExists, usernameExists } = result[0];
    res.status(200).json({ emailExists: !!emailExists, usernameExists: !!usernameExists });
  });
});




// Delete user
app.delete("/delete_user/:UserName", (req, res) => {
  const { UserName } = req.params;

  // First, check if there are any related entries in the invoices table
  const checkInvoicesQuery = "SELECT COUNT(*) AS count FROM invoices WHERE UserName = ?";
  db.query(checkInvoicesQuery, [UserName], (err, results) => {
    if (err) {
      console.error("Error checking invoices:", err);
      return res.status(500).json({ message: "Failed to check related invoices." });
    }

    if (results[0].count > 0) {
      // If related invoices exist, do not delete the user
      return res.status(400).json({ message: "Cannot delete this user because related invoice data exists in the system." });
    }

    // If no related invoices, proceed to delete the user
    const deleteUserQuery = "DELETE FROM users WHERE UserName = ?";
    db.query(deleteUserQuery, [UserName], (deleteErr, result) => {
      if (deleteErr) {
        console.error("Error deleting user:", deleteErr);
        return res.status(500).json({ message: "Failed to delete user." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({ message: "User deleted successfully." });
    });
  });
});





// Fetch All Users
app.get("/api/users/get_users", (req, res) => {
  const query = "SELECT id, Name, Email, UserName, Password, Type FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Failed to fetch users." });
    }
    res.status(200).json(results);
  });
});



// Fetch All Users (excluding admin users)
app.get("/api/users/get_users_new", (req, res) => {
  const query = `
    SELECT id, Name, Email, UserName, Password, Type, Store 
    FROM users 
    WHERE Type != 'admin'
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Failed to fetch users." });
    }
    res.status(200).json(results);
  });
});




// API to get the decrypted password
app.get('/api/users/get_password/:UserName', (req, res) => {
  const { UserName } = req.params;

  const query = 'SELECT Password, iv FROM users WHERE UserName = ?';
  db.query(query, [UserName], (err, results) => {
    if (err) {
      console.error('Error fetching password:', err);
      return res.status(500).json({ message: 'Failed to fetch password.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    try {
      const decryptedPassword = decryptPassword(results[0].Password, results[0].iv);
      res.status(200).json({ password: decryptedPassword });
    } catch (error) {
      console.error('Error decrypting password:', error);
      res.status(500).json({ message: 'Failed to decrypt password.' });
    }
  });
});


//update user name
app.put('/api/users/update_user/:UserName', async (req, res) => {
  const { UserName } = req.params;
  const { Email, Password } = req.body;

  try {
    // Encrypt the password if provided
    const updatedFields = {};
    if (Password) {
      const { encryptedPassword, iv } = encryptPassword(Password);
      updatedFields.Password = encryptedPassword;
      updatedFields.iv = iv;
    }
    if (Email) {
      updatedFields.Email = Email;
    }

    // Update user in the database
    const updateQuery = `UPDATE users SET ? WHERE UserName = ?`;
    db.query(updateQuery, [updatedFields, UserName], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      res.status(200).json({ success: true, message: "User updated successfully." });
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});


// Endpoint to Fetch All Users
app.get('/api/users', (req, res) => {
  const query = 'SELECT UserName FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Failed to fetch users.' });
    }
    res.status(200).json(results);
  });
});



// Endpoint to Fetch Settings for a Specific User
app.get('/api/settings/:username', (req, res) => {
  const { username } = req.params;

  // Validate Username
  const isValidUsername = /^[a-zA-Z0-9_]+$/.test(username);
  if (!isValidUsername) {
    return res.status(400).json({ error: 'Invalid username.' });
  }

  const userTableName = `user_${username}`;
  const query = `SELECT id, name, value FROM \`${userTableName}\``;

  db.query(query, (err, results) => {
    if (err) {
      console.error(`Error fetching settings for ${username}:`, err);

      // Handle case where the table does not exist
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(404).json({ error: `No settings found for ${username}.` });
      }

      return res.status(500).json({ error: `Failed to fetch settings for ${username}.` });
    }
    res.status(200).json(results);
  });
});



// Endpoint to Update a Specific Setting Value
app.put('/api/settings/:username/:id', (req, res) => {
  const { username, id } = req.params;
  const { value } = req.body;

  const userTableName = `user_${username}`;
  const updateQuery = `UPDATE \`${userTableName}\` SET value = ? WHERE id = ?`;

  db.query(updateQuery, [value, id], (err, result) => {
    if (err) {
      console.error(`Error updating setting for ${username}:`, err);
      return res.status(500).json({ error: `Failed to update setting for ${username}.` });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Setting not found.' });
    }

    res.status(200).json({ message: 'Setting updated successfully.' });
  });
});




// Endpoint to check access for a specific section
// Backend API for access check
app.get('/api/access/:username/:section', (req, res) => {
  const { username, section } = req.params;

  const isValidUsername = /^[a-zA-Z0-9_]+$/.test(username);
  if (!isValidUsername) {
    return res.status(400).json({ error: 'Invalid username.' });
  }

  const userTableName = `user_${username}`;
  const query = `SELECT value FROM \`${userTableName}\` WHERE name = ?`;

  db.query(query, [section], (err, results) => {
    if (err) {
      console.error(`Error checking access for ${section} in ${username}:`, err);

      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(404).json({ error: `User settings not found for ${username}.` });
      }

      return res.status(500).json({ error: `Failed to check access for ${section}.` });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: `Section ${section} not found for ${username}.` });
    }

    res.status(200).json({ access: results[0].value === 'yes' });
  });
});



















// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

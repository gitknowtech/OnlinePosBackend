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
app.use('/api/invoice', invoiceRouter)
app.use('/api/expenses', expensesRouter)
app.use('/api/customer', customerRouter)
app.use('/api/purchases', supplierPurchaseRouter)




// Check if the uploads directory exists, if not, create it
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Encryption configuration
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Replace this with a securely stored key
const iv = crypto.randomBytes(16); // Replace this with a securely stored IV

// Encrypt function
const encryptPassword = (password) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedPassword: encrypted, iv: iv.toString('hex') };
};

// Decrypt function
const decryptPassword = (encryptedPassword, iv) => {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
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





// POST route to handle form data and file upload for inserting user data
app.post('/create-user', upload.single('Image'), async (req, res) => {
  const { Name, Email, UserName, Password } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    const { encryptedPassword, iv } = encryptPassword(Password);
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    const insertQuery = `
      INSERT INTO users (Name, Email, UserName, Password, iv, Image, Type, Store, register_time, last_login)
      VALUES (?, ?, ?, ?, ?, ?, 'user', 'all', ?, ?)
    `;

    db.query(insertQuery, [Name, Email, UserName, encryptedPassword, iv, imagePath, currentTime, currentTime], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: JSON.stringify(err) });
      }
      res.status(200).json({ message: 'User account created successfully', id: result.insertId });
    });
  } catch (err) {
    console.error('Error during encryption or database query:', err);
    res.status(500).json({ error: err.message || 'Server error' });
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
app.delete("/api/users/delete_user/:UserName", (req, res) => {
  const { UserName } = req.params;

  const query = "DELETE FROM users WHERE UserName = ?";
  db.query(query, [UserName], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Failed to delete user." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
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



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

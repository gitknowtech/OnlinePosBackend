const express = require('express');
const db = require('../db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const moment = require('moment');


const router = express.Router();

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

  createCompaniesTable();


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



// POST route to handle form data and file upload
router.post('/companies', upload.single('Image'), (req, res) => {
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
router.get('/check-companies', (req, res) => {
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


router.get('/info', (req, res) => {
  // Fetch the first company from the database
  const query = 'SELECT Comid, Comname, Mobile, Location, Image FROM companies LIMIT 1';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching company info:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No company found' });
    }

    const company = results[0];

    // Map Image to LogoUrl as expected by the frontend
    const response = {
      LogoUrl: company.Image,
      Comname: company.Comname,
      Location: company.Location,
      Mobile: company.Mobile,
    };

    res.status(200).json(response);
  });
});

module.exports = router; 
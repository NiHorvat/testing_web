const express = require('express');
const app = express();
require('dotenv').config();

// Import the pool correctly from db.js
const pool = require('./db');

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to MySQL database');
        connection.release();
    }
});

// API endpoint
app.get('/api/entries', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM persons');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching entries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});
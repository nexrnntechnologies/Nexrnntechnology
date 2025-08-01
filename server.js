// =================================================================
//              Nexgen Technology Server (Production Ready)
// =================================================================

// 1. IMPORT LIBRARIES
require('dotenv').config(); // This must be at the very top
const express = require('express');
const { Pool } = require('pg'); // Use pg for PostgreSQL

// 2. INITIALIZE APP
const app = express();
const PORT = process.env.PORT || 3000;

// 3. MIDDLEWARE
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. DATABASE CONNECTION
// This 'Pool' will use the DATABASE_URL environment variable on Render
// or your local connection string if you provide one in a .env file.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Create the 'contacts' table if it doesn't exist.
const createTable = async () => {
    const sqlCreateTable = `
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            submitted_at TIMESTAMPTZ DEFAULT NOW()
        );`;
    try {
        await pool.query(sqlCreateTable);
        console.log("'contacts' table is ready.");
    } catch (err) {
        console.error("Error creating table:", err);
    }
};
createTable();


// 5. API ROUTES
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please fill out all fields.' });
    }

    const sqlInsert = `INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id`;
    const params = [name, email, message];

    try {
        const result = await pool.query(sqlInsert, params);
        console.log(`A new contact has been added with ID: ${result.rows[0].id}`);
        res.status(200).json({ success: true, message: 'Your message has been received and saved successfully!' });
    } catch (err) {
        console.error("Database insertion error:", err);
        res.status(500).json({ success: false, message: 'An error occurred while saving your message.' });
    }
});

// 6. START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
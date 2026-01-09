const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: 'postgresql://admin:arinat_pass123!@localhost:5434/arinat_db'
});

pool.query('SELECT 1', (err, res) => {
    if (err) {
        console.error('Connection error:', err);
    } else {
        console.log('Connection successful!');
    }
    pool.end();
});

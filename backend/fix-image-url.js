const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://admin:arinat_pass123!@localhost:5434/arinat_db'
});

client.connect()
    .then(() => {
        console.log('Connected to database');
        return client.query('ALTER TABLE events ALTER COLUMN image_url TYPE TEXT;');
    })
    .then(() => {
        console.log('✅ Column updated successfully!');
        client.end();
    })
    .catch(err => {
        console.error('Error:', err);
        client.end();
    });

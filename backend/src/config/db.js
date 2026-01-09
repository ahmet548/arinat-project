const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
      connectionString: process.env.DATABASE_URL,
    }
    : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    }
);

pool.on('error', (err) => {
  console.error('Beklenmedik veritabanı hatası:', err);
});

module.exports = pool;
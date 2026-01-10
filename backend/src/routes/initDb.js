const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ⚠️ GEÇİCİ ENDPOINT - Database kurulumundan sonra SİL!
router.get('/init-db', async (req, res) => {
    try {
        // 1. Users tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'admin'
            );
        `);

        // 2. Admin kullanıcısı ekle
        await pool.query(`
            INSERT INTO users (username, password, role) 
            VALUES ('arinat429', 'arnt710.', 'admin')
            ON CONFLICT (username) DO UPDATE SET password = 'arnt710.';
        `);

        // 3. Announcements tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(50),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // 4. Events tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                short_desc TEXT,
                long_desc TEXT,
                image_url TEXT,
                start_date DATE NOT NULL,
                start_time TIME,
                location VARCHAR(255),
                deadline TIMESTAMP,
                quota INTEGER NOT NULL,
                custom_questions JSONB,
                is_active BOOLEAN DEFAULT true
            );
        `);

        // 5. Notifications tablosu
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
                event_title VARCHAR(255),
                fullname VARCHAR(255),
                student_no VARCHAR(100),
                class_info VARCHAR(100),
                phone VARCHAR(50),
                attended_before BOOLEAN,
                custom_answers JSONB,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // Doğrulama - admin kullanıcısını göster
        const result = await pool.query('SELECT username, role FROM users;');

        res.status(200).json({
            success: true,
            message: '✅ Database başarıyla oluşturuldu!',
            tables: ['users', 'announcements', 'events', 'notifications'],
            admin_user: result.rows[0],
            warning: '⚠️ Bu endpoint\'i artık silebilirsiniz!'
        });

    } catch (error) {
        console.error('Database init hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;

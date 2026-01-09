const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// --- 1. TÜM ETKİNLİKLERİ GETİR (Public/Admin) ---
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events ORDER BY start_date ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. YENİ ETKİNLİK OLUŞTUR (Admin) ---
router.post('/create', verifyAdmin, async (req, res) => {
    const { title, short_desc, long_desc, image_url, start_date, start_time, location, deadline, quota, custom_questions } = req.body;

    try {
        await db.query(
            `INSERT INTO events 
            (title, short_desc, long_desc, image_url, start_date, start_time, location, deadline, quota, custom_questions) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                title, short_desc, long_desc, image_url, start_date,
                start_time, location, deadline, quota,
                JSON.stringify(custom_questions || []) // JSONB olarak saklanır
            ]
        );
        res.json({ success: true, message: 'Etkinlik başarıyla eklendi.' });
    } catch (err) {
        console.error("Etkinlik Oluşturma Hatası:", err);
        res.status(500).json({ error: 'Veritabanı hatası.' });
    }
});

// --- 3. ETKİNLİK GÜNCELLE (Admin) ---
router.put('/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, short_desc, long_desc, image_url, start_date, start_time, location, deadline, quota, is_active, custom_questions } = req.body;

    try {
        await db.query(
            `UPDATE events SET 
            title=$1, short_desc=$2, long_desc=$3, image_url=$4, start_date=$5, 
            start_time=$6, location=$7, deadline=$8, quota=$9, is_active=$10, 
            custom_questions=$11 
            WHERE id=$12`,
            [
                title, short_desc, long_desc, image_url, start_date,
                start_time, location, deadline, quota, is_active,
                JSON.stringify(custom_questions || []), // custom_questions GÜNCELLENDİ
                id
            ]
        );
        res.json({ success: true, message: 'Etkinlik başarıyla güncellendi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. KULLANICI KAYDI (Public - App.jsx ile %100 uyumlu) ---
router.post('/:id/register', async (req, res) => {
    const event_id = req.params.id;
    const { fullname, student_no, class_info, phone, attended_before, custom_answers } = req.body; //

    try {
        // Etkinlik başlığını otomatik alalım
        const eventInfo = await db.query('SELECT title FROM events WHERE id = $1', [event_id]);
        const event_title = eventInfo.rows[0]?.title || 'Bilinmeyen Etkinlik';

        await db.query(
            `INSERT INTO notifications 
            (event_id, event_title, fullname, student_no, class_info, phone, attended_before, custom_answers) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                event_id, event_title, fullname, student_no,
                class_info, phone, attended_before,
                JSON.stringify(custom_answers || []) // custom_answers isimlendirmesi düzeltildi
            ]
        );
        res.json({ success: true, message: 'Başvuru başarıyla alındı.' });
    } catch (err) {
        console.error("Kayıt Hatası:", err);
        res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu.' });
    }
});

// --- 5. ETKİNLİK SİL (Admin) ---
router.delete('/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM events WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
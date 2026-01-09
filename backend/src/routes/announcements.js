const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// Herkese açık: Aktif duyuruları listele
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Yeni duyuru ekle
router.post('/', verifyAdmin, async (req, res) => {
    const { title, type } = req.body;
    try {
        await db.query('INSERT INTO announcements (title, type) VALUES ($1, $2)', [title, type]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Duyuru güncelle (Durumunu değiştirme dahil)
router.patch('/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId > 2147483647) {
        return res.status(400).json({ error: 'Geçersiz veya aralık dışı ID.' });
    }
    const { title, type, is_active } = req.body;
    try {
        await db.query(
            'UPDATE announcements SET title = $1, type = $2, is_active = $3 WHERE id = $4',
            [title, type, is_active, numericId]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Duyuru sil
router.delete('/:id', verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId > 2147483647) {
        return res.status(400).json({ error: 'Geçersiz veya aralık dışı ID.' });
    }
    try {
        await db.query('DELETE FROM announcements WHERE id = $1', [numericId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
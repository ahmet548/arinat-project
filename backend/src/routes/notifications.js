const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyAdmin } = require('../middleware/auth');

// Admin: Tüm bildirimleri (başvuruları) getir
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM notifications ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: Bildirimi okundu olarak işaretle
router.patch('/:id/read', verifyAdmin, async (req, res) => {
    try {
        await db.query('UPDATE notifications SET is_read = true WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
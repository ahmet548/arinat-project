const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // BACKEND'E GELEN VERİYİ GÖRMEK İÇİN:
    console.log("Giriş denemesi yapılıyor. Kullanıcı:", username, "Şifre:", password);

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        // VERİTABANINDAN GELEN VERİYİ GÖRMEK İÇİN:
        if (user) {
            console.log("Veritabanında kullanıcı bulundu. Kayıtlı şifre:", user.password);
        } else {
            console.log("Kullanıcı veritabanında yok!");
        }

        // Karşılaştırma kısmı (Düz metin şifre kullandığın için):
        if (user && password === user.password) {
            console.log("Şifreler eşleşti, giriş başarılı.");
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role, username: user.username });
        } else {
            console.log("Şifre yanlış!");
            res.status(401).json({ error: 'Kimlik bilgileri hatalı.' });
        }
    } catch (err) {
        console.error("Hata oluştu:", err);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

module.exports = router;
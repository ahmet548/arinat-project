const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" kısmını ayırır

    if (!token) return res.status(401).json({ error: 'Erişim engellendi, token eksik.' });

    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET value:', process.env.JWT_SECRET);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Error:', err);
            return res.status(403).json({ error: 'Token geçersiz veya süresi dolmuş.' });
        }
        console.log('Decoded User:', user);
        if (user.role !== 'admin') {
            console.error('Role Mismatch:', user.role);
            return res.status(403).json({ error: 'Yetkisiz erişim.' });
        }
        req.user = user;
        next();
    });
};

module.exports = { verifyAdmin };
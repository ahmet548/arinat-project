const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); // .env dosyasını okumak için

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const announcementRoutes = require('./routes/announcements');
const notificationRoutes = require('./routes/notifications');
const initDbRoute = require('./routes/initDb'); // GEÇİCİ - Database kurulumundan sonra sil


const app = express();

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "default-src": ["'self'"],
            // connect-src kısmına hem localhost'u hem de kullandığın IP'yi ekle
            "connect-src": ["'self'", "http://localhost:*", "http://127.0.0.1:*", "http://10.64.128.19:*"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "https:"],
        },
    },
}));

app.use(cors({
    origin: process.env.FRONTEND_URL ?
        [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://10.64.128.19:5173'] :
        ['http://localhost:5173', 'http://10.64.128.19:5173'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes); // EKLENDİ
app.use('/api/notifications', notificationRoutes); // EKLENDİ
app.use('/api', initDbRoute); // GEÇİCİ - Database kurulumundan sonra sil


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend ${PORT} portunda aktif ve ağdaki tüm cihazlardan erişilebilir.`));
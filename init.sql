CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin'
);

-- Düz metin şifre olarak ekle
INSERT INTO users (username, password, role) 
VALUES ('arinat429', 'arnt710.', 'admin')
ON CONFLICT (username) DO UPDATE SET password = 'arnt710.';

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
# Environment Variables Kurulum Rehberi

Bu dokümanda production deployment için gerekli environment variables açıklanmıştır.

---

## 🎨 Frontend (Vercel)

### Gerekli Environment Variables

| Variable | Açıklama | Örnek Değer |
|----------|----------|-------------|
| `VITE_API_URL` | Backend API endpoint URL'i | `https://arinat-backend.onrender.com/api` |

### Vercel Dashboard'da Ayarlama

1. Vercel Dashboard → Projeniz → **Settings**
2. **Environment Variables** sekmesi
3. **Add New** butonuna tıklayın
4. Name: `VITE_API_URL`
5. Value: Render'dan aldığınız backend URL + `/api`
6. **Environments:** Production, Preview, Development (hepsini seçin)
7. **Save** edin

### Güncelleme Sonrası

Environment variable değiştiğinde **Redeploy** etmeniz gerekir:
1. **Deployments** sekmesi
2. En son deployment'ın yanındaki **⋯** (üç nokta)
3. **Redeploy** → **Use existing Build Cache** → **Redeploy**

---

## 🔧 Backend (Render)

### Gerekli Environment Variables

| Variable | Açıklama | Değer | Otomatik? |
|----------|----------|-------|-----------|
| `DATABASE_URL` | PostgreSQL bağlantı string'i | Render'ın oluşturduğu | ✅ Evet |
| `JWT_SECRET` | JWT token için secret key | Random güvenli string | ✅ Evet (Blueprint) |
| `NODE_ENV` | Node environment | `production` | ⚠️ Manuel |
| `PORT` | Server port | `5000` | ⚠️ Manuel |
| `FRONTEND_URL` | Frontend URL (CORS için) | `https://arinat.com.tr` | ⚠️ Manuel |

### Render Dashboard'da Ayarlama

1. Render Dashboard → **arinat-backend** → **Environment**
2. Her değişken için **Add Environment Variable** butonuna tıklayın

#### NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### PORT
```
Key: PORT
Value: 5000
```

#### FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://arinat.com.tr
```

> **📌 Not:** `DATABASE_URL` ve `JWT_SECRET` Blueprint tarafından otomatik oluşturulur.

### JWT_SECRET Güncelleme (Opsiyonel)

Daha güvenli bir JWT secret kullanmak isterseniz:

1. Güçlü bir random string oluşturun:
```bash
# PowerShell'de:
[System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes((New-Guid).Guid + (New-Guid).Guid))
```

2. Render Dashboard → Environment → `JWT_SECRET` değişkenini güncelleyin

> **⚠️ Dikkat:** JWT_SECRET değiştiğinde mevcut tüm JWT tokenlar geçersiz olur (kullanıcılar logout olur).

---

## 🗄️ Database (Render PostgreSQL)

### DATABASE_URL Format

Render otomatik oluşturur:
```
postgresql://user:password@host:5432/database_name
```

### Database Bilgilerine Erişim

1. Render Dashboard → **arinat-db** (database servisiniz)
2. **Info** sekmesinde:
   - **Internal Database URL** (backend için kullanılır)
   - **External Database URL** (lokal bağlantı için)
   - **PSQL Command** (terminal ile bağlanma)

### Lokal Bağlantı (Test için)

```bash
# PSQL ile bağlanın (Render'dan komut kopyalayın)
psql -h dpg-xxxxx.oregon-postgres.render.com -U arinat_user arinat_db

# Şifre girin (Render'da gösterilir)
```

---

## 🔒 Güvenlik Önerileri

### ✅ Production Checklist

- [ ] **JWT_SECRET:** En az 32 karakter, random, güçlü
- [ ] **Database Password:** Render'ın oluşturduğu (random ve güçlü) ✅
- [ ] **Environment Variables:** Git'e commit edilmemiş (.gitignore'da)
- [ ] **CORS:** Sadece production domain'e izin verilmiş
- [ ] **HTTPS:** Her iki platform da SSL aktif ✅

### ❌ Yapılmaması Gerekenler

- ❌ `.env` dosyasını GitHub'a pushlama
- ❌ Production secrets'ı kodda hardcode etme
- ❌ Zayıf JWT secret kullanma (örn: "secret123")
- ❌ Database şifresini paylaşma
- ❌ CORS'u `origin: '*'` yapma

---

## 🔄 Environment Değişikliği Sonrası

### Vercel'de

1. Environment variable güncelleyin
2. **Manuel redeploy** gerekir (otomatik değil)
3. Deployment → Redeploy

### Render'da

1. Environment variable güncelleyin
2. **Otomatik redeploy** olur
3. ~2-3 dakika bekleyin

---

## 📝 .env Dosyası Örnekleri

### Frontend (.env - Lokal Development)
```bash
VITE_API_URL=http://localhost:5001/api
```

### Backend (.env - Lokal Development)
```bash
DATABASE_URL=postgresql://admin:arinat_pass123!@localhost:5434/arinat_db
JWT_SECRET=development-secret-key-change-in-production
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

> **⚠️ Dikkat:** Lokal `.env` dosyaları **asla** production'da kullanılmaz. Production values Vercel ve Render dashboard'larında ayarlanır.

---

## 🆘 Troubleshooting

### "Environment variable bulunamadı" hatası

**Sebep:** Backend environment variable okuyamıyor  
**Çözüm:**
1. Render Dashboard → Environment'ı kontrol edin
2. Variable name'leri doğru yazdığınızdan emin olun
3. Manual redeploy yapın

### "CORS policy" hatası

**Sebep:** FRONTEND_URL yanlış veya eksik  
**Çözüm:**
1. Render'da `FRONTEND_URL=https://arinat.com.tr` olduğunu kontrol edin
2. Backend `server.js` CORS ayarlarını kontrol edin

### Database bağlantı hatası

**Sebep:** DATABASE_URL yanlış  
**Çözüm:**
1. Render database servisinin **Active** olduğunu kontrol edin
2. `DATABASE_URL` variable'ının database'den otomatik geldiğini kontrol edin
3. Backend logs'u kontrol edin: Render Dashboard → Logs

---

**Son Güncelleme:** 2026-01-10

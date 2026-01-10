# Render - Manuel Deployment Rehberi

Blueprint çalışmıyorsa, manual olarak deployment yapalım. Daha kolay! 🚀

## 📦 Adım 1: PostgreSQL Database Oluştur

1. [Render Dashboard](https://dashboard.render.com) → **New +** → **PostgreSQL**

2. Ayarları girin:
   - **Name:** `arinat-db`
   - **Database:** `arinat_db`
   - **User:** `arinat_user` (otomatik gelir)
   - **Region:** Frankfurt veya Oregon (size yakın olan)
   - **Plan:** **Free** ✅

3. **Create Database** butonuna tıklayın

4. Database oluşturulunca **Internal Database URL**'i kopyalayın:
   ```
   postgresql://arinat_user:xxx@xxx.oregon-postgres.render.com/arinat_db
   ```
   **Bu URL'i bir yere not alın!** 📝

⏱️ **Süre:** 1-2 dakika

---

## 🔧 Adım 2: Backend Web Service Oluştur

1. Render Dashboard → **New +** → **Web Service**

2. **GitHub Repository** seçin:
   - Repository: `ahmet548/arinat-project`
   - Branch: `main`
   - **Connect** butonuna tıklayın

3. **Ayarları yapın:**

   | Alan | Değer |
   |------|-------|
   | **Name** | `arinat-backend` |
   | **Region** | Frankfurt veya Oregon (database ile aynı) |
   | **Root Directory** | **Boş bırakın** |
   | **Runtime** | `Node` |
   | **Build Command** | `cd backend && npm install` |
   | **Start Command** | `cd backend && npm start` |
   | **Plan** | **Free** ✅ |

4. **Advanced** butonuna tıklayın

5. **Environment Variables** ekleyin:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `DATABASE_URL` | **Adım 1'de kopyaladığınız URL** |
   | `JWT_SECRET` | `arinat-super-secret-jwt-key-2026-prod` |
   | `FRONTEND_URL` | `https://arinat.com.tr` |

   > **💡 İpucu:** Her satır için **Add Environment Variable** butonunu kullanın

6. **Health Check Path:** `/api/health`

7. **Create Web Service** butonuna tıklayın

⏱️ **Süre:** 5-10 dakika (build + deploy)

---

## ✅ Adım 3: Deployment'i İzleyin

1. **Logs** sekmesinde build sürecini izleyin
2. "Your service is live 🎉" mesajını bekleyin
3. Backend URL'inizi kopyalayın (üstte gösterilir):
   ```
   https://arinat-backend.onrender.com
   ```

---

## 🗄️ Adım 4: Database Tablolarını Oluşturun

Database oluştu ama tablolar yok. İki seçenek:

### Seçenek A: PSQL ile (Önerilen)

1. Render Dashboard → **arinat-db** → **Connect** → **PSQL Command** kopyalayın

2. Bilgisayarınızda PowerShell açın:
   ```powershell
   # PSQL command'i yapıştırın (Render'dan kopyaladığınız)
   # Örnek:
   # PGPASSWORD=xxxx psql -h dpg-xxx.oregon-postgres.render.com -U arinat_user arinat_db
   ```

3. Şifre sormazsa (PGPASSWORD ile verildiği için), direkt bağlanacak

4. SQL dosyanızı çalıştırın:
   ```sql
   \i 'c:/Users/Ahmet'"'"'s Monster/Documents/GitHub/arinat-project/init.sql'
   ```

5. Çıkış yapın:
   ```sql
   \q
   ```

### Seçenek B: Render Shell

1. Render Dashboard → **arinat-backend** → **Shell** açın
2. Database'e bağlanın:
   ```bash
   psql $DATABASE_URL < init.sql
   ```

---

## 🚀 Sonraki Adım: Vercel

Backend hazır! Şimdi frontend'i Vercel'e deploy edin:

1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) dosyasındaki **BÖLÜM 2: Frontend Deployment** kısmını takip edin
2. Environment variable olarak backend URL'inizi kullanın:
   ```
   VITE_API_URL=https://arinat-backend.onrender.com/api
   ```

---

## 🔧 Troubleshooting

### ❌ "Build failed" hatası
- **Çözüm:** Build Command doğru mu kontrol edin: `cd backend && npm install`

### ❌ "Application failed to respond" hatası
- **Çözüm:** 
  1. Logs'u kontrol edin
  2. Start Command doğru mu: `cd backend && npm start`
  3. PORT environment variable `5000` olmalı

### ❌ Database connection hatası
- **Çözüm:** DATABASE_URL'i kontrol edin, Internal URL kullandığınızdan emin olun

---

**Başarılar!** 🎉

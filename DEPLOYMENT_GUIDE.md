# Arinat Projesi - Deployment Rehberi 🚀

Bu rehber, Arinat projenizi **ücretsiz** hosting platformlarında yayınlamanız ve **arinat.com.tr** domain'inizi bağlamanız için adım adım talimatlar içerir.

## 📋 Gereksinimler

- ✅ GitHub hesabı (projeniz GitHub'da olmalı)
- ✅ Vercel hesabı (ücretsiz - GitHub ile giriş yapabilirsiniz)
- ✅ Render hesabı (ücretsiz - GitHub ile giriş yapabilirsiniz)
- ✅ METU domain yönetim paneline erişim (DNS ayarları için)

---

## 🎯 Deployment Stratejisi

| Servis | Platform | Maliyet | URL |
|--------|----------|---------|-----|
| **Frontend** | Vercel | Ücretsiz | `arinat.com.tr` |
| **Backend + API** | Render | Ücretsiz | `arinat-backend.onrender.com` |
| **Database** | Render PostgreSQL | Ücretsiz | Dahili bağlantı |

---

## 📦 BÖLÜM 1: Backend Deployment (Render)

### Adım 1: Render Hesabı Oluşturun

1. [render.com](https://render.com) adresine gidin
2. **"Get Started for Free"** butonuna tıklayın
3. **GitHub** ile giriş yapın
4. GitHub repository'nize erişim izni verin

### Adım 2: Blueprint ile Deploy Edin

1. Dashboard'da **"New +"** butonuna tıklayın
2. **"Blueprint"** seçeneğini seçin
3. Repository'nizi seçin: `arinat-project`
4. **Branch:** `main` (veya kullandığınız ana branch)
5. **Blueprint dosyası:** `render.yaml` (otomatik algılanacak)
6. **Apply** butonuna tıklayın

> **📌 Not:** Render otomatik olarak:
> - PostgreSQL veritabanı oluşturacak
> - Backend web servisini başlatacak
> - Database bağlantı stringini otomatik ayarlayacak

### Adım 3: Environment Variables Kontrol Edin

Backend servisi oluşturulduktan sonra:

1. **Dashboard** → **arinat-backend** seçin
2. **Environment** sekmesine gidin
3. Aşağıdaki değişkenlerin olduğunu kontrol edin:

```
DATABASE_URL  (Otomatik oluşturuldu ✅)
JWT_SECRET    (Otomatik oluşturuldu ✅)
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://arinat.com.tr
```

> **⚠️ Önemli:** `JWT_SECRET` güvenli bir değer olmalı. Render otomatik oluşturuyor ama isterseniz değiştirebilirsiniz.

### Adım 4: Backend URL'inizi Kaydedin

1. Deployment tamamlandığında **Live** olarak gösterilecek
2. URL'yi kopyalayın, örnek: `https://arinat-backend.onrender.com`
3. **Bu URL'yi kaydedin** - frontend için lazım olacak! 📝

### Adım 5: Health Check Test

Tarayıcınızda backend URL'inizi açın:
```
https://arinat-backend.onrender.com
```

API çalışıyorsa bir yanıt alacaksınız.

---

## 🎨 BÖLÜM 2: Frontend Deployment (Vercel)

### Adım 1: Vercel Hesabı Oluşturun

1. [vercel.com](https://vercel.com) adresine gidin
2. **"Start Deploying"** butonuna tıklayın
3. **GitHub** ile giriş yapın

### Adım 2: Projeyi İmport Edin

1. **"Add New..."** → **"Project"** seçin
2. GitHub repository'nizi seçin: `arinat-project`
3. **Root Directory:** `arinat` klasörünü seçin (önemli!)
4. **Framework Preset:** Vite (otomatik algılanır)

### Adım 3: Environment Variables Ekleyin

**Configure Project** sayfasında:

1. **Environment Variables** bölümünü açın
2. Şu değişkeni ekleyin:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://arinat-backend.onrender.com/api` |

> **📝 Not:** `arinat-backend.onrender.com` kısmını Render'dan aldığınız **gerçek URL** ile değiştirin!

### Adım 4: Deploy Edin

1. **"Deploy"** butonuna tıklayın
2. Deployment sürecini izleyin (1-2 dakika sürer)
3. **"Congratulations!"** mesajını gördüğünüzde tamamdır ✅

### Adım 5: Deployment Test Edin

1. Vercel size geçici bir URL verecek: `arinat-xyz123.vercel.app`
2. Bu URL'yi tarayıcıda açın
3. Sitenizin çalıştığını kontrol edin
4. API çağrılarının backend'e gittiğini kontrol edin

---

## 🌐 BÖLÜM 3: Custom Domain Bağlama (arinat.com.tr)

### Adım 1: Vercel'de Domain Ekleyin

1. Vercel Dashboard → Projeniz → **"Settings"**
2. **"Domains"** sekmesini açın
3. **"Add"** butonuna tıklayın
4. Domain'inizi girin: `arinat.com.tr`
5. **"Add"** butonuna basın

Vercel size DNS kayıtları gösterecek. Şimdi bunları METU paneline ekleyeceğiz.

### Adım 2: METU Domain Paneline Girin

1. METU domain yönetim paneline giriş yapın
2. **arinat.com.tr** domain'ini seçin
3. **DNS Yönetimi** veya **DNS Settings** bölümüne gidin

### Adım 3: DNS Kayıtlarını Ekleyin

Vercel'in verdiği DNS kayıtlarını ekleyin. Genellikle şöyle olacak:

#### **A Record (ana domain için):**
```
Type: A
Name: @
Value: 76.76.21.21  (Vercel IP - panel size gösterecek)
TTL: 3600
```

#### **CNAME Record (www için):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com  (Vercel size gösterecek)
TTL: 3600
```

> **📌 İpucu:** METU panelindeki eski kayıtları (varsa) silin veya devre dışı bırakın.

### Adım 4: DNS Propagation Bekleyin

1. DNS kayıtları kaydetildikten sonra **24-48 saat** sürebilir
2. Genellikle **10-30 dakika** içinde çalışır
3. Kontrol etmek için: [dnschecker.org](https://dnschecker.org)

### Adım 5: SSL Sertifikası (Otomatik)

Vercel otomatik olarak **Let's Encrypt SSL** sertifikası ekleyecek:
- DNS doğrulandıktan sonra aktif olur
- Tarayıcıda **yeşil kilit** ikonu görünür
- `https://arinat.com.tr` otomatik çalışır ✅

---

## 🔧 BÖLÜM 4: Production Ayarları

### Database Migration (İlk Deploy)

Render'da database oluşturuldu ama tablolar yok. İki seçenek:

#### **Seçenek 1: init.sql kullanın**
1. Render Dashboard → Database → **"Connect"** butonuna tıklayın
2. **PSQL Command** kopyalayın
3. Lokal bilgisayarınızda terminal açın:
```bash
# PSQL command'i yapıştırın (Render'dan kopyaladığınız)
psql -h <host> -U <user> -d <database>

# Şifre girin

# Tablolarınızı oluşturun
\i c:/Users/Ahmet's\ Monster/Documents/GitHub/arinat-project/init.sql

# Çıkış
\q
```

#### **Seçenek 2: Backend'den çalıştırın**
Eğer backend'inizde migration script varsa, Render console'dan çalıştırabilirsiniz.

### CORS Kontrolü

Backend `server.js` dosyasında CORS ayarları güncellendi:
```javascript
origin: process.env.FRONTEND_URL
```

`FRONTEND_URL` environment variable'ı Render'da `https://arinat.com.tr` olarak ayarlandı ✅

---

## ✅ BÖLÜM 5: Test & Doğrulama

### Kontrol Listesi

- [ ] Backend erişilebilir: `https://arinat-backend.onrender.com`
- [ ] Frontend yükleniyor: `https://arinat.com.tr`
- [ ] SSL aktif (yeşil kilit görünüyor)
- [ ] Kullanıcı kayıt/giriş çalışıyor
- [ ] Database bağlantısı çalışıyor
- [ ] Tüm sayfalar yükleniyor
- [ ] Console'da hata yok

### Yaygın Sorunlar ve Çözümler

#### ❌ **"Failed to fetch" hatası**
- **Sebep:** API URL yanlış
- **Çözüm:** Vercel environment variables'ı kontrol edin

#### ❌ **CORS hatası**
- **Sebep:** Backend CORS ayarları yanlış
- **Çözüm:** Render'da `FRONTEND_URL` değişkenini kontrol edin

#### ❌ **Database bağlanamıyor**
- **Sebep:** DATABASE_URL yanlış
- **Çözüm:** Render otomatik ayarlar, backend loglarını kontrol edin

#### ❌ **Domain çalışmıyor**
- **Sebep:** DNS henüz yayılmadı
- **Çözüm:** 30-60 dakika bekleyin, dnschecker.org ile kontrol edin

---

## 🔄 Gelecek Güncellemeler

### Auto-Deployment (Otomatik Deploy)

Her iki platform da GitHub'a push yaptığınızda **otomatik deploy** yapar:

1. Kodu GitHub'a push edin:
```bash
git add .
git commit -m "Güncelleme"
git push origin main
```

2. Vercel ve Render otomatik olarak yeni versiyonu deploy eder
3. 2-3 dakika içinde değişiklikler yayında olur ✅

### Environment Variables Güncelleme

**Vercel'de:**
1. Dashboard → Settings → Environment Variables
2. Değişkeni güncelleyin
3. **Redeploy** edin

**Render'da:**
1. Dashboard → Environment
2. Değişkeni güncelleyin  
3. Otomatik redeploy olur

---

## 🎉 Tebrikler!

Projeniz artık canlı: **https://arinat.com.tr** 🚀

### Sonraki Adımlar

- 🔒 Production için güçlü şifreler kullanın
- 📊 Render ve Vercel analytics'i kontrol edin
- 💾 Database backup stratejisi oluşturun
- 🚀 Performance optimizasyonları yapın

---

## 📞 Yardım & Destek

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Render Docs:** [render.com/docs](https://render.com/docs)
- **METU Domain:** Rektörlük BİDB

**Başarılar! 🎊**

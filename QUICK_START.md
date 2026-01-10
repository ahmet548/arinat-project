# 🚀 Hızlı Başlangıç - Deployment

Bu projeyi 3 adımda yayınlayın!

## ✅ Ön Hazırlık

1. **GitHub'a Push Edin** (henüz yapmadıysanız):
```bash
git add .
git commit -m "Production deployment hazırlığı"
git push origin main
```

2. **Hesaplar Oluşturun:**
   - [Render.com](https://render.com) - Backend için
   - [Vercel.com](https://vercel.com) - Frontend için
   - Her ikisine de GitHub ile giriş yapın

---

## 🔧 Adım 1: Backend'i Deploy Edin (Render)

1. Render Dashboard → **New +** → **Blueprint**
2. Repository seçin: `arinat-project`
3. Apply → Blueprint otomatik çalışacak
4. **Backend URL'inizi kaydedin** (örn: `https://arinat-backend.onrender.com`)

⏱️ **Süre:** 5-10 dakika

---

## 🎨 Adım 2: Frontend'i Deploy Edin (Vercel)

1. Vercel Dashboard → **New Project**
2. Repository seçin: `arinat-project`
3. **Root Directory:** `arinat` seçin
4. **Environment Variable ekleyin:**
   - Name: `VITE_API_URL`
   - Value: `https://arinat-backend.onrender.com/api` (Adım 1'deki URL)
5. **Deploy** edin

⏱️ **Süre:** 2-3 dakika

---

## 🌐 Adım 3: Domain Bağlayın (arinat.com.tr)

### Vercel'de:
1. Settings → Domains → Add: `arinat.com.tr`
2. DNS kayıtlarını kopyalayın

### METU Panel'de:
1. DNS Yönetimi'ne girin
2. Vercel'in verdiği A ve CNAME kayıtlarını ekleyin
3. Kaydedin

⏱️ **Bekleme:** 10-60 dakika (DNS propagation)

---

## 🎉 Tamamlandı!

Siteniz: **https://arinat.com.tr** 🚀

### Sonraki Adımlar:
- [ ] Database tablolarını oluşturun (detaylı rehbere bakın)
- [ ] Production JWT_SECRET güncelleyin
- [ ] Test edin: Kayıt/Giriş çalışıyor mu?

---

**Detaylı Rehber:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)  
**Environment Variables:** [ENV_SETUP.md](./ENV_SETUP.md)

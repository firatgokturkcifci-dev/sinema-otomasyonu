# 🎬 TMDB Klon - Full-Stack Sinema & İçerik Yönetim Platformu

Bu proje, **React.js** bileşen (component) mimarisi ile **ASP.NET Core / Node.js & MongoDB** arka uç (backend) teknolojilerini bir araya getiren, **The Movie Database (TMDB) REST API** entegrasyonuna sahip uçtan uca (full-stack) dinamik bir web platformudur.

## 🚀 Öne Çıkan Özellikler

### Frontend & Kullanıcı Deneyimi (React.js)
- **Canlı Arama & Keşfet:** TMDB REST API entegrasyonu ile popüler filmlerin listelenmesi ve anahtar kelimeye göre anlık canlı arama (Live Search).
- **Gelişmiş Filtreleme & Sıralama:** Filmleri türlerine (Genre), yayın yılına veya popülerlik puanına göre dinamik olarak filtreleme ve sıralama.
- **Dinamik Sayfalama (Pagination):** Hem harici TMDB API'sinden hem de özel RESTful API uç noktalarından dönen verilere uyumlu sayfalama yapısı.
- **Zengin Detay Sayfası:** Oyuncu kadrosu (Cast), resmi YouTube fragman oynatıcı entegrasyonu ve benzer film önerileri.
- **Durum Yönetimi & Favoriler:** `LocalStorage` ve `SessionStorage` kullanılarak oturum sürekliliğinin sağlanması ve kullanıcıya özel favori listesi yönetimi.

### Backend, Güvenlik & Yönetim (ASP.NET Core / Node.js & MongoDB)
- **Özel RESTful API Mimarisi:** Sıfırdan tasarlanmış API uç noktaları (endpoints) üzerinden veri akışı, filtreleme ve sunucu taraflı sayfalama.
- **Kimlik Doğrulama & Yetkilendirme (JWT & RBAC):** JSON Web Token (JWT) tabanlı güvenli kullanıcı kayıt/giriş sistemi ve **Ziyaretçi, Üye, Admin** olmak üzere rol bazlı erişim kontrolü.
- **Admin Paneli (CRUD):** Yöneticilerin platforma özel içerik ekleyebileceği, güncelleyebileceği ve silebileceği tam yetkili içerik yönetim paneli.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React.js (Component Architecture, Hooks), HTML5, CSS3 (Responsive & Dark Mode)
- **Backend:** ASP.NET Core / MVC (C#), Node.js, RESTful API
- **Veritabanı:** MongoDB
- **Güvenlik & Oturum:** JWT (JSON Web Token), Role-Based Access Control (RBAC), `localStorage` & `sessionStorage`
- **Harici Servisler:** TMDB REST API, YouTube IFrame API

## 🔒 Güvenlik ve Mimari Notu

> **Çevresel Değişkenler (`.env`) & API Güvenliği:** Uygulama uçtan uca (full-stack) mimariye sahip olduğundan, TMDB API anahtarları, veritabanı bağlantı dizeleri (Connection Strings) ve JWT gizli anahtarları istemci tarafında açık bırakılmamış; sunucu tarafındaki `.env` ve `appsettings.json` yapılandırma dosyalarında güvence altına alınmıştır.

## 💻 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda ayağa kaldırmak için hem Backend hem de Frontend servislerini başlatmanız gerekmektedir:

1. **Repoyu klonlayın:**
   ```bash
   git clone [https://github.com/kullanici-adiniz/proje-adi.git](https://github.com/kullanici-adiniz/proje-adi.git)

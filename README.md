# 🎬 TMDB Klon - Premium Sinema Platformu

Bu proje, **The Movie Database (TMDB) REST API** kullanılarak sıfırdan geliştirilmiş, dinamik ve responsive bir sinema arayüzü uygulamasıdır. Proje, modern web standartlarına uygun olarak tasarlanmış olup, saf Frontend (İstemci Tarafı) yeteneklerini sergilemek amacıyla yapılmıştır.


## 🚀 Öne Çıkan Özellikler

* **Dinamik Veri Çekme:** TMDB API üzerinden popüler filmlerin eşzamanlı olarak listelenmesi.
* **Akıllı Arama Motoru:** Kullanıcının yazdığı anahtar kelimeye göre anlık arama (Search API) yeteneği.
* **Kategori (Genre) Filtreleme:** Filmleri aksiyon, komedi, bilim-kurgu gibi türlerine göre dinamik olarak filtreleme.
* **Sayfalama (Pagination):** API'den dönen `total_pages` verisine göre güvenli ve sınırlı sayfalama mantığı.
* **Gelişmiş Detay Sayfası:** 
  * Oyuncu kadrosu (Cast) yatay kaydırma veya grid listesi.
  * İlgili filme ait resmi YouTube fragman entegrasyonu (IFrame).
  * İzlenen filme göre "Benzer Filmler" öneri algoritması.
* **Favoriler Sistemi (Local Storage):** Kullanıcıların beğendiği filmleri tarayıcı hafızasına (Session/Local Storage) kaydetme ve ayrı bir sekmede yönetebilme imkanı.
* **Durum Yönetimi (State Management):** Sayfalar arası geçişte veya yenilemelerde kullanıcının son aramasını ve bulunduğu sayfayı hafızada tutma.

## 🛠️ Kullanılan Teknolojiler

* **HTML5 & CSS3:** Modern, karanlık tema (Dark Mode), Flexbox & CSS Grid mimarisi.
* **JavaScript (ES6+) & jQuery:** DOM manipülasyonu, AJAX istekleri ve asenkron veri yönetimi.
* **Tarayıcı Depolama:** `localStorage` ve `sessionStorage` ile veri kalıcılığı.
* **TMDB API:** Dış veri kaynağı ve uç noktalar (Endpoints).

## ⚠️ Geliştirici Notu (Güvenlik)

> **API Key Gizliliği Hakkında:** Gerçek yaşam profesyonel projelerinde (React/Node.js mimarilerinde) API anahtarları `.env` dosyalarında tutulur ve asla frontend tarafında (istemciye açık kodlarda) bulundurulmaz. Bu proje bir statik site (HTML/JS) demonstrasyonu olduğu için, API anahtarı geçici olarak `script.js` içerisinde tutulmaktadır. Bir sonraki aşamada (Node.js Backend entegrasyonunda) bu yapı gizli sunucu değişkenlerine taşınacaktır.

## 💻 Kurulum ve Çalıştırma

Bu projeyi bilgisayarınızda çalıştırmak için herhangi bir paket yöneticisine (npm, yarn) ihtiyaç yoktur.

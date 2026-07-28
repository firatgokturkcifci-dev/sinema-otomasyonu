// GÜVENLİK NOTU: 
// Gerçek profesyonel projelerde (React/Node.js) API_KEY bir '.env' dosyasında tutulur ve asla frontend'e açıkça yazılmaz.
// Bu proje statik HTML/JS (Client-Side) olduğu için demonstrasyon amaçlı burada tanımlanmıştır.
const CONFIG = {
    API_KEY: '4f298a53e552283bee957836a529baec',
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500'
};

// Durum Yönetimi (Hafıza)
let state = {
    page: 1,
    totalPages: 1, 
    mode: 'POPULAR', // POPULAR, SEARCH, GENRE, FAVORITES
    argument: '',
    scrollPos: 0
};

$(document).ready(function() {
    
    // --- ANA SAYFA BAŞLANGIÇ ---
    if ($('#home-page').length) {
        
        // URL'den 'Favorilerim' sayfasına direkt gelinip gelinmediğini kontrol et
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'favorites') {
            state.mode = 'FAVORITES';
            // Temiz bir görünüm için URL'deki parametreyi sil
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            // Normal Hafızayı Kontrol Et
            const savedState = sessionStorage.getItem('movieAppState');
            if (savedState) {
                state = JSON.parse(savedState);
                if (state.mode === 'SEARCH') {
                    $('#search-input').val(state.argument);
                }
            }
        }

        loadContentByState();
        getGenres();

       // Buton Olayları
        $('#search-btn').click(handleSearch);
        $('#search-input').keypress(function(e) { if (e.which == 13) handleSearch(); });
        $('#prev-btn').click(() => changePage(-1));
        $('#next-btn').click(() => changePage(1));
        
        // YENİ EKLENEN KOD: Logoya tıklanınca hafızayı sıfırla ve gerçek Ana Sayfaya dön
        $('header h1 a').click(function() {
            sessionStorage.removeItem('movieAppState');
        });
        
        // Favoriler Butonu (Ana Sayfa İçin)
        $('#show-favorites-btn').click(function() {
            state.mode = 'FAVORITES';
            state.argument = '';
            state.page = 1;
            saveState();
            loadContentByState();
        });

        if (state.scrollPos > 0) $('html, body').animate({ scrollTop: state.scrollPos }, 0);
    }

    // --- DETAY SAYFASI BAŞLANGIÇ ---
    if ($('#detail-page').length) {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        if (movieId) {
            getMovieDetail(movieId);
        } else {
            $('#movie-detail').html('<p>Film bulunamadı.</p>');
        }
    }
});

// --- FAVORİLER MANTIĞI (LOCALSTORAGE) ---
function getFavorites() {
    return JSON.parse(localStorage.getItem('tmdb_favorites')) || [];
}

function isFavorite(id) {
    return getFavorites().some(movie => movie.id === id);
}

function toggleFavorite(movieData) {
    let favs = getFavorites();
    if (isFavorite(movieData.id)) {
        favs = favs.filter(m => m.id !== movieData.id); // Çıkar
    } else {
        favs.push(movieData); // Ekle
    }
    localStorage.setItem('tmdb_favorites', JSON.stringify(favs));
}

// --- MANTIK VE YÖNLENDİRME ---
function handleSearch() {
    const query = $('#search-input').val().trim();
    if (query) {
        state.mode = 'SEARCH';
        state.argument = query;
    } else {
        state.mode = 'POPULAR';
        state.argument = '';
    }
    state.page = 1;
    saveState();
    loadContentByState();
}

function changePage(direction) {
    state.page += direction;
    if (state.page < 1) state.page = 1;
    if (state.page > state.totalPages) state.page = state.totalPages; 
    saveState();
    loadContentByState();
    $('html, body').scrollTop(0);
}

function loadContentByState() {
    const pageTitle = $('#page-title');
    
    // Favoriler Modu İse
    if (state.mode === 'FAVORITES') {
        pageTitle.text('❤️ Favori Filmlerim');
        $('#tags').hide(); // Kategorileri gizle
        $('#pagination-controls').hide(); // Sayfalamayı gizle
        const favs = getFavorites();
        displayMovies(favs);
        return; // API'ye gitme
    }

    // Diğer Modlar İçin
    $('#tags').show();
    $('#pagination-controls').show();
    let url = '';

    if (state.mode === 'POPULAR') {
        pageTitle.text('Popüler Filmler');
        url = `${CONFIG.BASE_URL}/movie/popular?api_key=${CONFIG.API_KEY}&language=tr-TR&page=${state.page}`;
    } else if (state.mode === 'SEARCH') {
        pageTitle.text(`"${state.argument}" için sonuçlar`);
        url = `${CONFIG.BASE_URL}/search/movie?api_key=${CONFIG.API_KEY}&language=tr-TR&query=${state.argument}&page=${state.page}`;
    } else if (state.mode === 'GENRE') {
        url = `${CONFIG.BASE_URL}/discover/movie?api_key=${CONFIG.API_KEY}&language=tr-TR&with_genres=${state.argument}&sort_by=popularity.desc&page=${state.page}`;
    }

    fetchMovies(url);
}

function fetchMovies(url) {
    $('#movies-grid').html('<div class="loader" style="color:white; text-align:center; padding:20px;">Yükleniyor...</div>');
    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            state.totalPages = data.total_pages; 
            displayMovies(data.results);
            updatePaginationButtons(); 
        },
        error: function(err) {
            $('#movies-grid').html('<p>Hata oluştu.</p>');
        }
    });
}

function displayMovies(movies) {
    const container = $('#movies-grid');
    container.empty();

    if (!movies || movies.length === 0) {
        container.html('<p>Gösterilecek film bulunamadı.</p>');
        return;
    }

    movies.forEach(movie => {
        const imagePath = movie.poster_path ? CONFIG.IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=Resim+Yok';
        const date = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        
        const movieCard = `
            <div class="movie-card" onclick="goToDetail(${movie.id})">
                <img src="${imagePath}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <span>${date}</span>
                    <span class="rating">${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        `;
        container.append(movieCard);
    });
}

function getGenres() {
    $.ajax({
        url: `${CONFIG.BASE_URL}/genre/movie/list?api_key=${CONFIG.API_KEY}&language=tr-TR`,
        method: 'GET',
        success: function(data) {
            const tagsContainer = $('#tags');
            tagsContainer.empty();
            data.genres.forEach(genre => {
                const isActive = (state.mode === 'GENRE' && state.argument == genre.id) ? 'active' : '';
                const tag = $(`<div class="tag ${isActive}" data-id="${genre.id}">${genre.name}</div>`);
                tag.click(function() {
                    $('.tag').removeClass('active');
                    $(this).addClass('active');
                    state.mode = 'GENRE';
                    state.argument = genre.id;
                    state.page = 1;
                    $('#page-title').text(`${genre.name} Filmleri`);
                    saveState();
                    loadContentByState();
                });
                tagsContainer.append(tag);
            });
        }
    });
}

// --- DETAY SAYFASI ---
function getMovieDetail(id) {
    $.ajax({
        url: `${CONFIG.BASE_URL}/movie/${id}?api_key=${CONFIG.API_KEY}&language=tr-TR`,
        method: 'GET',
        success: function(movie) {
            renderDetail(movie);
            getMovieCast(movie.id); // Oyuncuları Getir
            getSimilarMovies(movie.id); // Benzer Filmleri Getir
        },
        error: function() {
            $('#movie-detail').html('<p>Detaylar yüklenemedi.</p>');
        }
    });
}

function renderDetail(movie) {
    const container = $('#movie-detail');
    window.currentMovieData = movie; 
    
    const imagePath = movie.poster_path ? CONFIG.IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750';
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'Tarih Yok';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const runtime = movie.runtime ? movie.runtime : 'Bilinmiyor';
    const overview = movie.overview ? movie.overview : 'Bu film için henüz bir özet bulunmuyor.';
    const genres = movie.genres && movie.genres.length > 0 ? movie.genres.map(g => g.name).join(', ') : 'Belirtilmemiş';
    
    const isFav = isFavorite(movie.id);
    const favBtnClass = isFav ? 'fav-btn active' : 'fav-btn';
    const favBtnText = isFav ? '❤️ Favorilerden Çıkar' : '🤍 Favorilere Ekle';

    // HTML İçeriği Kusursuz Düzen İçin 2'ye Bölündü (Top ve Bottom)
    const htmlContent = `
        <div class="detail-top">
            <div class="detail-poster">
                <img src="${imagePath}" alt="${movie.title}">
                <button id="add-fav-btn" class="${favBtnClass}">${favBtnText}</button>
            </div>
            <div class="detail-info">
                <h1>${movie.title} (${releaseYear})</h1>
                <p class="tagline">${movie.tagline || ''}</p>
                <div style="margin: 15px 0;">
                    <strong>Puan:</strong> ${rating} / 10 
                    <span style="margin-left:15px"><strong>Süre:</strong> ${runtime} dk</span>
                </div>
                <h3>Özet</h3>
                <p class="overview">${overview}</p>
                <div style="margin-top: 20px;">
                    <strong>Türler:</strong> ${genres}
                </div>
            </div>
        </div>

        <div class="detail-bottom">
            <div class="cast-section">
                <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-left: 4px solid var(--primary); padding-left: 15px;">Oyuncu Kadrosu</h2>
                <div id="cast-grid" class="cast-container">Yükleniyor...</div>
            </div>

            <div id="video-container" style="margin-top: 50px;">
                <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-left: 4px solid var(--primary); padding-left: 15px;">Fragman</h2>
                <div class="video-wrapper">
                    <p style="padding:20px;">Yükleniyor...</p>
                </div>
            </div>
        </div>
    `;
    
    // Benzer Filmler Alanı
    const similarHTML = `
        <div class="similar-section">
            <h2>Benzer Filmler</h2>
            <div id="similar-grid" class="grid-container" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">Yükleniyor...</div>
        </div>
    `;
    
    container.html(htmlContent);
    
    // Sayfa içi geçişlerde eski "Benzer Filmler" alanı çoğalmasın diye temizlik yapıyoruz
    $('.similar-section').remove();
    container.after(similarHTML);

    $('#add-fav-btn').click(function() {
        toggleFavorite(window.currentMovieData);
        const nowFav = isFavorite(window.currentMovieData.id);
        $(this).text(nowFav ? '❤️ Favorilerden Çıkar' : '🤍 Favorilere Ekle');
        $(this).toggleClass('active', nowFav);
    });

    getMovieTrailer(movie.id, movie.backdrop_path);
}

// Oyuncu Kadrosunu Getir
function getMovieCast(movieId) {
    $.ajax({
        url: `${CONFIG.BASE_URL}/movie/${movieId}/credits?api_key=${CONFIG.API_KEY}&language=tr-TR`,
        method: 'GET',
        success: function(data) {
            const castContainer = $('#cast-grid');
            const castList = data.cast.slice(0, 10); // Sadece ilk 10 oyuncu
            
            if(castList.length === 0) {
                castContainer.html('<p>Oyuncu bilgisi bulunamadı.</p>');
                return;
            }
            
            let castHTML = '';
            castList.forEach(actor => {
                const imgPath = actor.profile_path ? CONFIG.IMAGE_BASE_URL + actor.profile_path : 'https://via.placeholder.com/150x225?text=Foto+Yok';
                castHTML += `
                    <div class="cast-card">
                        <img src="${imgPath}" alt="${actor.name}">
                        <h4>${actor.name}</h4>
                        <p>${actor.character}</p>
                    </div>
                `;
            });
            castContainer.html(castHTML);
        }
    });
}

// Benzer Filmleri Getir
function getSimilarMovies(movieId) {
    $.ajax({
        url: `${CONFIG.BASE_URL}/movie/${movieId}/similar?api_key=${CONFIG.API_KEY}&language=tr-TR&page=1`,
        method: 'GET',
        success: function(data) {
            const similarContainer = $('#similar-grid');
            const similarList = data.results.slice(0, 6); // Sadece 6 film göster
            
            if(similarList.length === 0) {
                similarContainer.html('<p>Benzer film bulunamadı.</p>');
                return;
            }

            let similarHTML = '';
            similarList.forEach(movie => {
                const imagePath = movie.poster_path ? CONFIG.IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=Resim+Yok';
                similarHTML += `
                    <div class="movie-card" onclick="goToDetail(${movie.id})">
                        <img src="${imagePath}" alt="${movie.title}">
                        <div class="movie-info" style="padding:15px;">
                            <h3 style="font-size:0.9rem;">${movie.title}</h3>
                            <span class="rating">${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                    </div>
                `;
            });
            similarContainer.html(similarHTML);
        }
    });
}

function getMovieTrailer(movieId, backdropPath) {
    const videoWrapper = $('.video-wrapper');
    
    $.ajax({
        url: `${CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${CONFIG.API_KEY}&language=en-US`,
        method: 'GET',
        success: function(data) {
            const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            
            if (trailer) {
                if (backdropPath) {
                    const backdropUrl = CONFIG.IMAGE_BASE_URL + backdropPath;
                    videoWrapper.html(`
                        <div class="video-cover" style="background-image: url('${backdropUrl}')">
                            <div class="play-icon">▶</div>
                        </div>
                    `);
                    
                    videoWrapper.find('.video-cover').click(function() {
                        // İzinler (allow parametresi) genişletildi
                        videoWrapper.html(`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
                    });
                    
                } else {
                    videoWrapper.html(`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${trailer.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
                }
            } else {
                videoWrapper.html('<p style="padding:20px;">Fragman bulunamadı.</p>');
            }
        },
        error: function() {
            videoWrapper.html('<p style="padding:20px;">Fragman yüklenemedi.</p>');
        }
    });
}

// --- YARDIMCI FONKSİYONLAR ---
function updatePaginationButtons() {
    $('#prev-btn').prop('disabled', state.page === 1);
    $('#next-btn').prop('disabled', state.page >= state.totalPages); 
    $('#current-page').text(`Sayfa ${state.page}`);
}

function goToDetail(id) {
    state.scrollPos = $(window).scrollTop();
    saveState();
    window.location.href = `movie-detail.html?id=${id}`;
}

function saveState() {
    sessionStorage.setItem('movieAppState', JSON.stringify(state));
}
// ============ PAGE NAVIGATION ============
const pages = document.querySelectorAll('.page');
const wrapper = document.getElementById('pagesWrapper');
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');
const indicator = document.getElementById('pageIndicator');
let currentPage = 0;
let isAnimating = false;

// Creer les dots
pages.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('page-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToPage(i));
    indicator.appendChild(dot);
});

function goToPage(index) {
    if (isAnimating || index === currentPage) return;
    isAnimating = true;
    currentPage = index;
    wrapper.style.transform = `translateX(-${currentPage * 100}vw)`;

    // Update dots
    document.querySelectorAll('.page-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentPage);
    });

    // Update arrows
    prevBtn.classList.toggle('hidden', currentPage === 0);
    nextBtn.classList.toggle('hidden', currentPage === pages.length - 1);

    // Update navbar
    navbar.classList.toggle('scrolled', currentPage > 0);

    // Update nav links active state
    const pageIds = Array.from(pages).map(p => p.id);
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.classList.toggle('nav-active', href === '#' + pageIds[currentPage]);
        }
    });

    // Trigger animations on active page
    pages[currentPage].classList.add('page-active');

    setTimeout(() => { isAnimating = false; }, 800);
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) goToPage(currentPage - 1);
});

nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1) goToPage(currentPage + 1);
});

// Hide left arrow on first page
prevBtn.classList.add('hidden');

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 0) goToPage(currentPage - 1);
    if (e.key === 'ArrowRight' && currentPage < pages.length - 1) goToPage(currentPage + 1);
});

// Mouse wheel navigation (on pages that don't need scrolling)
document.addEventListener('wheel', (e) => {
    const activePage = pages[currentPage];
    const isScrollable = activePage.scrollHeight > activePage.clientHeight;
    const atTop = activePage.scrollTop === 0;
    const atBottom = activePage.scrollTop + activePage.clientHeight >= activePage.scrollHeight - 5;

    if (!isScrollable || (e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        if (e.deltaY > 0 && currentPage < pages.length - 1) {
            goToPage(currentPage + 1);
        } else if (e.deltaY < 0 && currentPage > 0) {
            goToPage(currentPage - 1);
        }
    }
}, { passive: true });

// Touch swipe
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});
document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 80) {
        if (diff > 0 && currentPage < pages.length - 1) goToPage(currentPage + 1);
        if (diff < 0 && currentPage > 0) goToPage(currentPage - 1);
    }
});

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');

// Nav links click -> go to page
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetIndex = Array.from(pages).findIndex(p => p.id === targetId);
            if (targetIndex !== -1) goToPage(targetIndex);
        }
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ============ HAMBURGER MENU ============
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// ============ COMPTEUR STATS ============
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
}

// ============ OBSERVER ANIMATIONS ============
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observer les elements
document.querySelectorAll('.about-card, .feature-card, .rule-item, .staff-card, .shop-card, .vip-card, .hero-stats').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Ajout de la classe visible
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// Delay stagger pour les grilles
document.querySelectorAll('.about-grid, .features-grid, .staff-grid, .rules-container, .shop-grid, .vip-grid').forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.15}s`;
    });
});

// ============ CURSOR GLOW EFFECT ============
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        heroSection.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 25%, var(--bg-dark) 60%)`;
    });
}

// ============ TYPING EFFECT HERO SUBTITLE ============
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    heroSubtitle.style.borderRight = '2px solid var(--cyan)';
    let i = 0;
    setTimeout(() => {
        const typeInterval = setInterval(() => {
            heroSubtitle.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
                setTimeout(() => { heroSubtitle.style.borderRight = 'none'; }, 1000);
            }
        }, 40);
    }, 1500);
}

// ============ PARTICULES ============
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#8B5CF6', '#06B6D4', '#D946EF', '#F59E0B'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}
createParticles();

// ============ CANDIDATURE FORM ============
const form = document.getElementById('candidatureForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', function() {
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        // Ajouter les champs caches (id, date, statut)
        const addHidden = (name, value) => {
            let input = form.querySelector('input[name="' + name + '"]');
            if (!input) {
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                form.appendChild(input);
            }
            input.value = value;
        };

        addHidden('id', Date.now().toString());
        addHidden('date', new Date().toLocaleString('fr-FR'));
        addHidden('statut', 'En attente');

        // Le formulaire s'envoie normalement via action/target
        // Afficher succes apres 2 secondes
        setTimeout(function() {
            form.style.display = 'none';
            formSuccess.classList.add('show');
        }, 2000);
    });
}

// ============ MUSIQUE DE FOND ============
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bg-music');
const volumeRange = document.getElementById('volumeRange');
let isMuted = false;
let currentVolume = 50;

const playlist = [
    'X4yDzAMOGqI',
    'vk6014HuxcE'
];
let currentTrack = 0;

// Detecter quand la video se termine pour passer a la suivante
window.addEventListener('message', function(event) {
    try {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange' && data.info === 0) {
            currentTrack = (currentTrack + 1) % playlist.length;
            bgMusic.src = 'https://www.youtube.com/embed/' + playlist[currentTrack] + '?autoplay=1&loop=0&controls=0&showinfo=0&mute=' + (isMuted ? '1' : '0') + '&enablejsapi=1';
            // Remettre le volume apres changement de track
            setTimeout(() => setVolume(currentVolume), 1000);
        }
    } catch(e) {}
});

// Verifier toutes les 5 secondes si la video est finie (backup)
setInterval(() => {
    if (bgMusic) {
        bgMusic.contentWindow.postMessage('{"event":"listening","id":1}', '*');
    }
}, 5000);

// Fonction pour set le volume
function setVolume(vol) {
    currentVolume = vol;
    if (bgMusic && bgMusic.contentWindow) {
        bgMusic.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[' + vol + ']}', '*');
    }
    // Mettre a jour l'icone
    if (vol == 0) {
        musicIcon.className = 'fas fa-volume-mute';
    } else if (vol < 40) {
        musicIcon.className = 'fas fa-volume-down';
    } else {
        musicIcon.className = 'fas fa-volume-up';
    }
}

// Volume slider
if (volumeRange) {
    volumeRange.addEventListener('input', (e) => {
        const vol = parseInt(e.target.value);
        setVolume(vol);
        if (vol === 0) {
            isMuted = true;
            musicToggle.classList.add('muted');
        } else {
            isMuted = false;
            musicToggle.classList.remove('muted');
        }
    });
}

// Set volume initial apres chargement
setTimeout(() => setVolume(50), 2000);

// Bouton mute/unmute
if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            bgMusic.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
            musicIcon.className = 'fas fa-volume-mute';
            musicToggle.classList.add('muted');
            volumeRange.value = 0;
        } else {
            bgMusic.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            setVolume(currentVolume || 50);
            volumeRange.value = currentVolume || 50;
            musicToggle.classList.remove('muted');
        }
    });
}

// ============ INIT FIRST PAGE ============
pages[0].classList.add('page-active');

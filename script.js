// ============ NAVBAR SCROLL ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ============ HAMBURGER MENU ============
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
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
document.querySelectorAll('.about-card, .feature-card, .rule-item, .staff-card, .hero-stats').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Ajout de la classe visible
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// Delay stagger pour les grilles
document.querySelectorAll('.about-grid, .features-grid, .staff-grid, .rules-container').forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
    });
});

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
const API_URL = 'https://script.google.com/macros/s/AKfycbwXsIdLWLMIG82zrKKgx4FMBmJ8pPCLHHlgOfWB2PcvSa_f9gHMp91j4Tq1DJK7utXUWA/exec';

const form = document.getElementById('candidatureForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        data.date = new Date().toLocaleString('fr-FR');
        data.statut = 'En attente';
        data.id = Date.now().toString();

        // Envoi via formulaire classique pour eviter CORS
        const formIframe = document.createElement('iframe');
        formIframe.name = 'hidden_iframe';
        formIframe.style.display = 'none';
        document.body.appendChild(formIframe);

        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = API_URL;
        tempForm.target = 'hidden_iframe';

        Object.keys(data).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);
        tempForm.submit();

        setTimeout(() => {
            form.style.display = 'none';
            formSuccess.classList.add('show');
            tempForm.remove();
            formIframe.remove();
        }, 2000);
    });
}

// ============ MUSIQUE DE FOND ============
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bg-music');
let isMuted = false;

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
        }
    } catch(e) {}
});

// Verifier toutes les 5 secondes si la video est finie (backup)
setInterval(() => {
    if (bgMusic) {
        bgMusic.contentWindow.postMessage('{"event":"listening","id":1}', '*');
    }
}, 5000);

if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            bgMusic.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
            musicIcon.className = 'fas fa-volume-mute';
            musicToggle.classList.add('muted');
        } else {
            bgMusic.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            musicIcon.className = 'fas fa-volume-up';
            musicToggle.classList.remove('muted');
        }
    });
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

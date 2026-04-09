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
const API_URL = 'https://script.google.com/macros/s/AKfycbxrsOLM7DxBM82t8Bq5k_J58HVSMn9AFEJVsVNSgzBh2qC_1y0n_ds3uLkNcapecR2ZMQ/exec';

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

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'text/plain' }
        })
        .then(res => res.json())
        .then(result => {
            form.style.display = 'none';
            formSuccess.classList.add('show');
        })
        .catch(err => {
            alert('Erreur lors de l\'envoi. Reessaye plus tard.');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer ma candidature';
            submitBtn.disabled = false;
        });
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

document.addEventListener('DOMContentLoaded', () => {

    // ── Smooth scroll ──────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ── Accordion ──────────────────────────────────────────────
    document.querySelectorAll('.accordion-item').forEach(item => {
        const header = item.querySelector('.accordion-header');
        const body   = item.querySelector('.accordion-body');
        const icon   = item.querySelector('.acc-icon');
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.accordion-body').style.maxHeight = null;
                i.querySelector('.acc-icon').textContent = '+';
            });
            if (!isOpen) {
                item.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
                icon.textContent = '+';
            }
        });
    });

    // ── Scroll-reveal ──────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .bridge-card, .accordion-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        revealObserver.observe(el);
    });

    // ── Testimonials Carousel ──────────────────────────────────
    const track   = document.querySelector('.carousel-track');
    const dots    = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track) {
        const slides = document.querySelectorAll('.testi-card');
        let current  = 0;
        const total  = slides.length;
        let autoplayTimer;

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }
        function startAutoplay() {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(() => goTo(current + 1), 4500);
        }
        function stopAutoplay() { clearInterval(autoplayTimer); }

        prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
        nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });
        dots.forEach(dot => dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index)); startAutoplay();
        }));

        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAutoplay(); }
        });

        const carouselWrapper = document.querySelector('.carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', stopAutoplay);
            carouselWrapper.addEventListener('mouseleave', startAutoplay);
        }
        startAutoplay();
    }

    // ── Purchase Proof Toast ───────────────────────────────────
    const toast     = document.getElementById('proofToast');
    const toastName = document.getElementById('toastName');
    const toastTime = document.getElementById('toastTime');
    const toastAvatar = document.getElementById('toastAvatar');
    const toastClose  = document.getElementById('toastClose');

    if (!toast) return;

    // 40 unique buyers — names + cities, never repeat until all shown
    const buyers = [
        { name: 'Valentina R.',  city: 'Bogotá',          country: '🇨🇴' },
        { name: 'Camila S.',     city: 'Lima',             country: '🇵🇪' },
        { name: 'Sofía M.',      city: 'Ciudad de México', country: '🇲🇽' },
        { name: 'Andrea P.',     city: 'Santiago',         country: '🇨🇱' },
        { name: 'Luciana F.',    city: 'Buenos Aires',     country: '🇦🇷' },
        { name: 'Mariana T.',    city: 'Guadalajara',      country: '🇲🇽' },
        { name: 'Isabella C.',   city: 'Medellín',         country: '🇨🇴' },
        { name: 'Daniela V.',    city: 'Montevideo',       country: '🇺🇾' },
        { name: 'Paula A.',      city: 'Quito',            country: '🇪🇨' },
        { name: 'Fernanda L.',   city: 'Monterrey',        country: '🇲🇽' },
        { name: 'Natalia G.',    city: 'Cali',             country: '🇨🇴' },
        { name: 'Gabriela N.',   city: 'Rosario',          country: '🇦🇷' },
        { name: 'Carolina H.',   city: 'Caracas',          country: '🇻🇪' },
        { name: 'Juliana M.',    city: 'La Paz',           country: '🇧🇴' },
        { name: 'Alejandra Q.',  city: 'Asunción',         country: '🇵🇾' },
        { name: 'Renata B.',     city: 'Córdoba',          country: '🇦🇷' },
        { name: 'Ana Sofía D.',  city: 'San José',         country: '🇨🇷' },
        { name: 'Paola E.',      city: 'Guayaquil',        country: '🇪🇨' },
        { name: 'Laura K.',      city: 'Barranquilla',     country: '🇨🇴' },
        { name: 'María J.',      city: 'Cochabamba',       country: '🇧🇴' },
        { name: 'Verónica O.',   city: 'Puebla',           country: '🇲🇽' },
        { name: 'Silvana C.',    city: 'Mendoza',          country: '🇦🇷' },
        { name: 'Tatiana R.',    city: 'Arequipa',         country: '🇵🇪' },
        { name: 'Ximena P.',     city: 'Concepción',       country: '🇨🇱' },
        { name: 'Mónica E.',     city: 'Maracaibo',        country: '🇻🇪' },
        { name: 'Adriana T.',    city: 'San Salvador',     country: '🇸🇻' },
        { name: 'Lorena W.',     city: 'Tijuana',          country: '🇲🇽' },
        { name: 'Florencia A.',  city: 'Tucumán',          country: '🇦🇷' },
        { name: 'Micaela B.',    city: 'Trujillo',         country: '🇵🇪' },
        { name: 'Sandra R.',     city: 'Valparaíso',       country: '🇨🇱' },
        { name: 'Yessica N.',    city: 'Bucaramanga',      country: '🇨🇴' },
        { name: 'Rebeca L.',     city: 'Tegucigalpa',      country: '🇭🇳' },
        { name: 'Patricia D.',   city: 'Managua',          country: '🇳🇮' },
        { name: 'Norma F.',      city: 'Santa Cruz',       country: '🇧🇴' },
        { name: 'Karina S.',     city: 'Mérida',           country: '🇲🇽' },
        { name: 'Estefanía C.',  city: 'Corrientes',       country: '🇦🇷' },
        { name: 'Betania R.',    city: 'Chiclayo',         country: '🇵🇪' },
        { name: 'Tania M.',      city: 'Temuco',           country: '🇨🇱' },
        { name: 'Rocío V.',      city: 'Maracay',          country: '🇻🇪' },
        { name: 'Claudia P.',    city: 'Pereira',          country: '🇨🇴' },
    ];

    // Shuffle helper (Fisher-Yates)
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Time labels — feel natural
    const timeLabels = [
        'hace 1 minuto',
        'hace 2 minutos',
        'hace 3 minutos',
        'hace 5 minutos',
        'hace 7 minutos',
        'hace 10 minutos',
        'hace 12 minutos',
        'hace 15 minutos',
        'hace 20 minutos',
    ];

    let queue = shuffle(buyers);
    let queueIndex = 0;
    let toastVisible = false;
    let toastTimer;
    let manuallyDismissed = false;

    function getNextBuyer() {
        if (queueIndex >= queue.length) {
            queue = shuffle(buyers);
            queueIndex = 0;
        }
        return queue[queueIndex++];
    }

    function showToast() {
        if (manuallyDismissed) return;

        const buyer = getNextBuyer();
        const time  = timeLabels[Math.floor(Math.random() * timeLabels.length)];
        const initial = buyer.name.charAt(0).toUpperCase();

        toastAvatar.textContent = initial;
        toastName.textContent   = `${buyer.country} ${buyer.name} de ${buyer.city}`;
        toastTime.textContent   = time;

        toast.classList.add('visible');
        toastVisible = true;

        // Auto-hide after 5s
        clearTimeout(toastTimer);
        toastTimer = setTimeout(hideToast, 5000);
    }

    function hideToast() {
        toast.classList.remove('visible');
        toastVisible = false;

        // Show next notification after 8–14 seconds
        if (!manuallyDismissed) {
            const delay = 8000 + Math.random() * 6000;
            setTimeout(showToast, delay);
        }
    }

    toastClose.addEventListener('click', () => {
        clearTimeout(toastTimer);
        manuallyDismissed = true;
        toast.classList.remove('visible');
        // Re-enable after 60s so it doesn't stop forever
        setTimeout(() => { manuallyDismissed = false; }, 60000);
        setTimeout(showToast, 60000);
    });

    // Start after 6s delay on page load
    setTimeout(showToast, 6000);
});

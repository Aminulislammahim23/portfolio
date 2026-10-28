const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navbar scroll effect + progress bar + active link
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const progress = document.getElementById('scroll-progress');
    const links = document.querySelectorAll('.nav-links a');
    const sections = Array.from(links)
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);

        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';

        let current = null;
        sections.forEach(s => {
            if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id;
        });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Mobile menu
function toggleMobileMenu() {
    document.getElementById('nav-links').classList.toggle('open');
}

// Close the mobile menu after choosing a link
document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('nav-links').classList.remove('open');
    });
});

// Contact modal
function showContactModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-head">
                <h3>Let's talk</h3>
                <button type="button" class="modal-close" aria-label="Close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <form onsubmit="submitContactForm(event)">
                <div class="form-group">
                    <label>Your name</label>
                    <input type="text" required placeholder="Jane Doe">
                </div>
                <div class="form-group">
                    <label>Email address</label>
                    <input type="email" required placeholder="jane@company.com">
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea required placeholder="Hi Mahim, I'd love to chat about..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" onclick="this.closest('.modal').remove()" class="btn btn-outline">Cancel</button>
                    <button type="submit" class="btn btn-primary">Send message</button>
                </div>
            </form>
        </div>
    `;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
    const first = modal.querySelector('input');
    if (first) first.focus();
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => m.remove());
});

function submitContactForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    setTimeout(function () {
        btn.innerHTML = '✓ Sent!';
        setTimeout(function () {
            const modal = btn.closest('.modal');
            if (modal) modal.remove();

            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = "✓ Thanks! I'll reply within 24 hours.";
            document.body.appendChild(toast);

            setTimeout(function () {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3800);
        }, 1200);
    }, 1600);
}

// Smooth scroll for nav links (also closes mobile menu)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const target = document.getElementById(this.getAttribute('href').substring(1));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('nav-links').classList.remove('open');
            }
        });
    });
}

// Scroll reveal + stat counters
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(i => i.classList.add('visible'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            en.target.classList.add('visible');
            en.target.querySelectorAll('[data-count]').forEach(countUp);
            io.unobserve(en.target);
        });
    }, { threshold: 0.15 });
    items.forEach(i => io.observe(i));
}

function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const dur = 1400;
    (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
    })(start);
}

// Typing effect
function initTyped() {
    const el = document.getElementById('typed');
    if (!el) return;
    const words = ['scalable backend systems.', 'clean REST APIs.', 'delightful interfaces.', 'reliable software.'];
    if (prefersReducedMotion) { el.textContent = words[0]; return; }
    let w = 0, c = 0, deleting = false;
    (function step() {
        const word = words[w];
        c += deleting ? -1 : 1;
        el.textContent = word.slice(0, c);
        let delay = deleting ? 35 : 70;
        if (!deleting && c === word.length) { deleting = true; delay = 1600; }
        else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
        setTimeout(step, delay);
    })();
}

// 3D tilt on cards (+ spotlight position)
function initTilt() {
    if (!window.matchMedia('(hover: hover)').matches || prefersReducedMotion) return;
    document.querySelectorAll('.tilt').forEach(card => {
        const max = parseFloat(card.dataset.tiltMax || 8);
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            card.classList.add('is-tilting');
            card.style.transform =
                'rotateX(' + ((0.5 - py) * max * 2).toFixed(2) + 'deg) ' +
                'rotateY(' + ((px - 0.5) * max * 2).toFixed(2) + 'deg) translateZ(6px)';
            card.style.setProperty('--mx', (px * 100) + '%');
            card.style.setProperty('--my', (py * 100) + '%');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-tilting');
            card.style.transform = '';
        });
    });
}

// Cursor glow
function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || !window.matchMedia('(hover: hover)').matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
        x += (tx - x) * 0.12;
        y += (ty - y) * 0.12;
        glow.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        requestAnimationFrame(loop);
    })();
}

// Three.js background: floating wireframe icosahedron core + particle field
function initScene() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (err) {
        return; // no WebGL: page still works with CSS background
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 9;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    // Core shapes (sit to the right, behind the hero portrait)
    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.2, 1),
        new THREE.MeshBasicMaterial({ color: 0x7c8cff, wireframe: true, transparent: true, opacity: 0.35 })
    );
    const inner = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.5 })
    );
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.4, 0.015, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.45 })
    );
    ring.rotation.x = Math.PI / 2.4;
    group.add(core, inner, ring);

    // Particles
    const COUNT = 900;
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 36;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 36;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({ color: 0xaab4ff, size: 0.05, transparent: true, opacity: 0.7, depthWrite: false })
    );
    scene.add(particles);

    let mx = 0, my = 0, scrollY = 0;
    window.addEventListener('mousemove', e => {
        mx = (e.clientX / innerWidth - 0.5) * 2;
        my = (e.clientY / innerHeight - 0.5) * 2;
    });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    function resize() {
        const w = innerWidth, h = innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        // Move the shape right on wide screens, center and shrink on narrow ones
        const wide = w > 960;
        group.position.x = wide ? 4.2 : 0;
        group.scale.setScalar(wide ? 1 : 0.7);
    }
    resize();
    window.addEventListener('resize', resize);

    let running = true;
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) animate(); });

    const clock = new THREE.Clock();
    function animate() {
        if (!running) return;
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        const speed = prefersReducedMotion ? 0 : 1;

        core.rotation.x = t * 0.15 * speed;
        core.rotation.y = t * 0.2 * speed;
        inner.rotation.x = -t * 0.3 * speed;
        inner.rotation.y = -t * 0.25 * speed;
        ring.rotation.z = t * 0.2 * speed;
        group.position.y = Math.sin(t * 0.8) * 0.25 * speed - scrollY * 0.004;

        particles.rotation.y = t * 0.012 * speed;
        particles.position.y = scrollY * 0.003;

        // Smooth mouse parallax
        camera.position.x += (mx * 0.9 - camera.position.x) * 0.04;
        camera.position.y += (-my * 0.6 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();
}

function init() {
    initNavbar();
    initSmoothScroll();
    initReveal();
    initTyped();
    initTilt();
    initCursorGlow();
    initScene();
}

window.addEventListener('load', init);

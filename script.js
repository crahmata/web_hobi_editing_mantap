/* ============================================
   VIDHOBBY — script.js
   ============================================ */

// ——— Toast Notification ———
function toast(msg) {
    var t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 2500);
}

// ——— Mobile Menu ———
function toggleMob() {
    var m = document.getElementById('mobNav');
    var i = document.getElementById('mobIco');
    m.classList.toggle('open');
    i.setAttribute('icon', m.classList.contains('open') ? 'mdi:close' : 'mdi:menu');
}

function closeMob() {
    document.getElementById('mobNav').classList.remove('open');
    document.getElementById('mobIco').setAttribute('icon', 'mdi:menu');
}

// ——— SPA Page Navigation ———
function nav(page) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }
    document.getElementById('pg-' + page).classList.add('active');

    var navLinks = document.querySelectorAll('.nv');
    for (var j = 0; j < navLinks.length; j++) {
        navLinks[j].classList.remove('text-white', 'bg-white/5');
        navLinks[j].classList.add('text-slate-400');
        if (navLinks[j].dataset.p === page) {
            navLinks[j].classList.add('text-white', 'bg-white/5');
            navLinks[j].classList.remove('text-slate-400');
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initReveal, 80);
}

// ——— Tools Filter ———
function filtT(cat, btn) {
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('on');
        tabs[i].classList.add('text-slate-500');
    }
    btn.classList.add('on');
    btn.classList.remove('text-slate-500');

    var cards = document.querySelectorAll('.tc');
    for (var j = 0; j < cards.length; j++) {
        var tags = cards[j].dataset.t;
        if (cat === 'all' || tags.indexOf(cat) !== -1) {
            cards[j].style.display = '';
            cards[j].style.opacity = '0';
            cards[j].style.transform = 'translateY(15px)';
            (function(card) {
                setTimeout(function() {
                    card.style.transition = 'all 0.35s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 30);
            })(cards[j]);
        } else {
            cards[j].style.display = 'none';
        }
    }
}

// ——— Scroll Reveal ———
function initReveal() {
    var observer = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.add('visible');
            }
        }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    var elements = document.querySelectorAll('.reveal');
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('visible');
        observer.observe(elements[i]);
    }
}

initReveal();

// ——— Counter Animation ———
function countUp(id, target, suffix) {
    suffix = suffix || '%';
    var el = document.getElementById(id);
    var startTime = performance.now();
    var duration = 2000;

    function tick(now) {
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

var counterObserver = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
            countUp('c1', 98);
            countUp('c2', 95);
            countUp('c3', 93);
            counterObserver.disconnect();
        }
    }
}, { threshold: 0.5 });
counterObserver.observe(document.getElementById('c1'));

// ——— Newsletter Subscribe ———
function subEm() {
    var val = document.getElementById('emIn').value.trim();
    if (!val || val.indexOf('@') === -1) {
        toast('Email nggak valid!');
        return;
    }
    toast('Berlangganan berhasil! 🎬');
    document.getElementById('emIn').value = '';
}

// ——— Init Nav Highlight ———
var firstNav = document.querySelector('.nv[data-p="beranda"]');
if (firstNav) {
    firstNav.classList.add('text-white', 'bg-white/5');
    firstNav.classList.remove('text-slate-400');
}
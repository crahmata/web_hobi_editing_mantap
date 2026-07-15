/* ============================================
   CEPEDIT — script.js
   Semua ID & class sudah dicocokkan
   dengan index.html
   ============================================ */

(function() {

    // ———————————————
    // LOADING SCREEN
    // ———————————————
    var loader = document.getElementById('loader');
    var barFill = document.getElementById('lbf');
    var barPercent = document.getElementById('lbp');
    var statusEl = document.getElementById('lst');
    var flash = document.getElementById('loaderFlash');

    var statusMessages = [
        'INITIALIZING SYSTEM...',
        'LOADING CORE MODULES...',
        'SCANNING TIMELINE_DATA...',
        'COMPILING FOOTAGE_INDEX...',
        'SYNCING AUDIO LAYERS...',
        'RENDERING PREVIEW...',
        'CALIBRATING COLOR SPACE...',
        'FINALIZING OUTPUT...',
        'SYSTEM READY.'
    ];

    var progress = 0;
    var statusIndex = 0;
    var done = false;

    function updateBar() {
        progress += (Math.random() * 8 + 2);
        if (progress > 100) progress = 100;

        barFill.style.width = progress + '%';
        barPercent.textContent = Math.floor(progress) + '%';

        if (progress > statusIndex * 14 && statusIndex < statusMessages.length - 1) {
            statusIndex++;
        }

        typeStatus(statusMessages[statusIndex]);

        if (progress < 100) {
            barFill.classList.add('active');
        } else {
            barFill.classList.remove('active');
        }

        if (progress >= 100 && !done) {
            done = true;
            setTimeout(function() {
                typeStatus('SYSTEM READY.');
                setTimeout(finishLoading, 600);
            }, 400);
            return;
        }

        var delay = 80 + Math.random() * 120;
        setTimeout(updateBar, delay);
    }

    function typeStatus(text) {
        statusEl.innerHTML = '';
        var i = 0;
        var interval = setInterval(function() {
            if (i < text.length) {
                statusEl.innerHTML = text.substring(0, i + 1) + '<span class="bk">\u258A</span>';
                i++;
            } else {
                clearInterval(interval);
            }
        }, 30);
    }

    function finishLoading() {
        flash.classList.add('flash');
        setTimeout(function() {
            loader.classList.add('out');
            document.body.style.overflow = '';
            document.getElementById('mainContent').classList.add('vis');
            initFadeUp();
            initReveal();
        }, 500);
    }

    // Lock scroll during loading
    document.body.style.overflow = 'hidden';

    // Start loader
    setTimeout(updateBar, 300);


    // ———————————————
    // TOAST NOTIFICATION
    // ———————————————
    window.toast = function(msg) {
        var t = document.getElementById('toast');
        document.getElementById('tmsg').textContent = msg;
        t.classList.add('on');
        setTimeout(function() { t.classList.remove('on'); }, 2500);
    };


    // ———————————————
    // MOBILE MENU
    // ———————————————
    window.tmob = function() {
        var m = document.getElementById('mnav');
        var ico = document.getElementById('mico');
        m.classList.toggle('op');
        ico.setAttribute('icon', m.classList.contains('op') ? 'mdi:close' : 'mdi:menu');
    };

    window.cmob = function() {
        document.getElementById('mnav').classList.remove('op');
        document.getElementById('mico').setAttribute('icon', 'mdi:menu');
    };


    // ———————————————
    // SPA PAGE NAVIGATION
    // ———————————————
    window.go = function(page) {
        var pages = document.querySelectorAll('.page');
        for (var i = 0; i < pages.length; i++) {
            pages[i].classList.remove('on');
        }
        var target = document.getElementById('pg-' + page);
        if (target) target.classList.add('on');

        var navLinks = document.querySelectorAll('.nv');
        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove('act');
            if (navLinks[j].getAttribute('data-p') === page) {
                navLinks[j].classList.add('act');
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(function() {
            initFadeUp();
            initReveal();
        }, 80);
    };

    // Init first nav highlight
    var firstNav = document.querySelector('.nv[data-p="beranda"]');
    if (firstNav) firstNav.classList.add('act');


    // ———————————————
    // TOOLS FILTER
    // ———————————————
    window.filtT = function(cat, btn) {
        var tabs = document.querySelectorAll('.tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('on');
            tabs[i].classList.add('text-slate-500');
        }
        btn.classList.add('on');
        btn.classList.remove('text-slate-500');

        var cards = document.querySelectorAll('.tc');
        for (var j = 0; j < cards.length; j++) {
            var tags = cards[j].getAttribute('data-t') || '';
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
    };


    // ———————————————
    // FADE UP (hero elements)
    // ———————————————
    function initFadeUp() {
        var els = document.querySelectorAll('.fu');
        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('sh');
        }
        var activePage = document.querySelector('.page.on');
        if (!activePage) return;
        var pageEls = activePage.querySelectorAll('.fu');
        for (var j = 0; j < pageEls.length; j++) {
            pageEls[j].classList.add('sh');
        }
    }


    // ———————————————
    // SCROLL REVEAL (.rv → .sh)
    // ———————————————
    var revealObserver = null;

    function initReveal() {
        if (revealObserver) revealObserver.disconnect();

        revealObserver = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('sh');
                }
            }
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        var els = document.querySelectorAll('.rv');
        for (var i = 0; i < els.length; i++) {
            var rect = els[i].getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) {
                els[i].classList.remove('sh');
            }
            revealObserver.observe(els[i]);
        }
    }


    // ———————————————
    // COUNTER ANIMATION (c1, c2, c3)
    // ———————————————
    function countUp(id, target, suffix) {
        suffix = suffix || '%';
        var el = document.getElementById(id);
        if (!el) return;
        var startTime = performance.now();
        var duration = 2000;

        function tick(now) {
            var p = Math.min((now - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.floor(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    var counterObs = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                countUp('c1', 98);
                countUp('c2', 95);
                countUp('c3', 93);
                counterObs.disconnect();
            }
        }
    }, { threshold: 0.5 });
    var c1el = document.getElementById('c1');
    if (c1el) counterObs.observe(c1el);


    // ———————————————
    // GLITCH COUNTER (c4-c7)
    // ———————————————
    function glitchCount(id, target, suffix) {
        suffix = suffix || '+';
        var el = document.getElementById(id);
        if (!el) return;
        var chars = '0123456789_/#@!?';
        var startTime = performance.now();
        var duration = 2200;

        function tick(now) {
            var p = Math.min((now - startTime) / duration, 1);
            var scramble = 1 - p;

            if (p >= 1) {
                el.textContent = target + suffix;
                el.classList.add('done');
                return;
            }

            if (Math.random() < scramble) {
                var text = String(target);
                var result = '';
                for (var i = 0; i < text.length; i++) {
                    if (Math.random() < scramble * 0.6) {
                        result += chars[Math.floor(Math.random() * chars.length)];
                    } else {
                        result += text[i];
                    }
                }
                el.textContent = result;
            } else {
                el.textContent = Math.floor(target * p);
            }

            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    var glitchObs = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                glitchCount('c4', 247, '+');
                glitchCount('c5', 53, '+');
                glitchCount('c6', 189, '+');
                glitchCount('c7', 412, '+');
                glitchObs.disconnect();
            }
        }
    }, { threshold: 0.5 });
    var c4el = document.getElementById('c4');
    if (c4el) glitchObs.observe(c4el);


    // ———————————————
    // NEWSLETTER SUBSCRIBE
    // ———————————————
    window.subEm = function() {
        var val = document.getElementById('emIn').value.trim();
        if (!val || val.indexOf('@') === -1) {
            toast('Email nggak valid!');
            return;
        }
        toast('Berlangganan berhasil! \uD83C\uDFAC');
        document.getElementById('emIn').value = '';
    };

})();
/* ============================================
   CEPEDIT — script.js (UNCHANGED)
   ============================================ */
console.log('>>> CEPEDIT loaded');

var loader = document.getElementById('loader');
var barFill = document.getElementById('lbf');
var barPercent = document.getElementById('lbp');
var statusEl = document.getElementById('lst');
var flash = document.getElementById('loaderFlash');

var statusMessages = ['INITIALIZING SYSTEM...','LOADING CORE MODULES...','SCANNING TIMELINE_DATA...','COMPILING FOOTAGE_INDEX...','SYNCING AUDIO LAYERS...','RENDERING PREVIEW...','CALIBRATING COLOR SPACE...','FINALIZING OUTPUT...','SYSTEM READY.'];
var progress = 0, statusIndex = 0, done = false, loadingFinished = false;

function updateBar() {
    try {
        progress += (Math.random() * 8 + 2);
        if (progress > 100) progress = 100;
        if (barFill) barFill.style.width = progress + '%';
        if (barPercent) barPercent.textContent = Math.floor(progress) + '%';
        if (progress > statusIndex * 14 && statusIndex < statusMessages.length - 1) statusIndex++;
        typeStatus(statusMessages[statusIndex]);
        if (barFill) { if (progress < 100) barFill.classList.add('active'); else barFill.classList.remove('active'); }
        if (progress >= 100 && !done) {
            done = true;
            setTimeout(function() { typeStatus('SYSTEM READY.'); setTimeout(finishLoading, 600); }, 400);
            return;
        }
        setTimeout(updateBar, 80 + Math.random() * 120);
    } catch (e) { console.error('updateBar:', e); finishLoading(); }
}

function typeStatus(text) {
    if (!statusEl) return;
    try {
        statusEl.innerHTML = '';
        var i = 0;
        var interval = setInterval(function() {
            if (i < text.length) { statusEl.innerHTML = text.substring(0, i + 1) + '<span class="bk">\u258A</span>'; i++; }
            else clearInterval(interval);
        }, 30);
    } catch (e) { statusEl.textContent = text; }
}

function finishLoading() {
    if (loadingFinished) return;
    loadingFinished = true;
    try { if (flash) flash.classList.add('flash'); } catch (e) {}
    setTimeout(function() {
        try {
            if (loader) loader.classList.add('out');
            document.body.style.overflow = '';
            var mc = document.getElementById('mainContent');
            if (mc) mc.classList.add('vis');
            initAllEffects();
        } catch (e) { console.error('finish:', e); forceShow(); }
    }, 500);
}

function forceShow() {
    if (loader) { loader.style.opacity = '0'; loader.style.visibility = 'hidden'; loader.style.pointerEvents = 'none'; }
    document.body.style.overflow = '';
    var mc = document.getElementById('mainContent');
    if (mc) mc.style.opacity = '1';
}

document.body.style.overflow = 'hidden';
setTimeout(updateBar, 300);
setTimeout(function() { if (!loadingFinished) { if (barFill) barFill.style.width = '100%'; if (barPercent) barPercent.textContent = '100%'; finishLoading(); } }, 6000);

function initAllEffects() {
    try { initFadeUp(); } catch (e) {}
    try { initReveal(); } catch (e) {}
    try { initGlitchEffects(); } catch (e) {}
    try { initDataRain(); } catch (e) {}
    try { initCinemaText(); } catch (e) {}
    try { initToolsEffects(); } catch (e) {}
    try { initCounters(); } catch (e) {}
    try { initKaryaCount(); } catch (e) {}
}

function initDataRain() {
    var canvas = document.getElementById('dataRain');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var cols, drops;
    var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; cols = Math.floor(canvas.width / 14); drops = []; for (var i = 0; i < cols; i++) drops[i] = Math.random() * -100; }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
        ctx.fillStyle = 'rgba(5,5,6,0.06)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.font = '10px JetBrains Mono, monospace';
        for (var i = 0; i < cols; i++) {
            if (drops[i] > 0) { ctx.fillStyle = 'rgba(16,185,129,0.12)'; ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, drops[i] * 14); }
            drops[i] += 0.3 + Math.random() * 0.3;
            if (drops[i] * 14 > canvas.height && Math.random() > 0.98) drops[i] = 0;
        }
        requestAnimationFrame(draw);
    }
    draw();
}

function initGlitchEffects() {
    var hs = document.querySelector('.hero-section');
    if (!hs) return;
    var overlay = document.createElement('div'); overlay.className = 'gh-overlay'; hs.appendChild(overlay);
    function fireLines() { var pg = document.getElementById('pg-beranda'); if (!pg || !pg.classList.contains('on')) { setTimeout(fireLines, 4000); return; } var n = 2 + Math.floor(Math.random() * 4); for (var b = 0; b < n; b++) { (function(d) { setTimeout(function() { var l = document.createElement('div'); l.className = 'gh-line'; l.style.top = (5 + Math.random() * 90) + '%'; l.style.height = (1 + Math.random() * 2) + 'px'; hs.appendChild(l); requestAnimationFrame(function() { l.classList.add('fire'); }); setTimeout(function() { if (l.parentNode) l.parentNode.removeChild(l); }, 700); }, d); })(b * 50); } setTimeout(fireLines, 2000 + Math.random() * 5000); }
    setTimeout(fireLines, 3000);
    function fireOverlay() { var pg = document.getElementById('pg-beranda'); if (!pg || !pg.classList.contains('on')) { setTimeout(fireOverlay, 3000); return; } overlay.classList.remove('fire'); void overlay.offsetWidth; overlay.classList.add('fire'); setTimeout(function() { overlay.classList.remove('fire'); }, 500); setTimeout(fireOverlay, 4000 + Math.random() * 8000); }
    setTimeout(fireOverlay, 4000);
    var stEl = document.querySelector('.gh-static');
    function fireStatic() { if (!stEl) return; var pg = document.getElementById('pg-beranda'); if (!pg || !pg.classList.contains('on')) { setTimeout(fireStatic, 6000); return; } stEl.classList.add('fire'); setTimeout(function() { stEl.classList.remove('fire'); }, 200); setTimeout(fireStatic, 8000 + Math.random() * 15000); }
    setTimeout(fireStatic, 10000);
    function fireBorder() { var pg = document.getElementById('pg-beranda'); if (!pg || !pg.classList.contains('on')) { setTimeout(fireBorder, 4000); return; } var tgts = pg.querySelectorAll('.gh-border-flash'); if (!tgts.length) { setTimeout(fireBorder, 4000); return; } var t = tgts[Math.floor(Math.random() * tgts.length)]; t.style.borderColor = 'rgba(16,185,129,0.4)'; setTimeout(function() { t.style.borderColor = 'rgba(6,182,212,0.25)'; }, 80); setTimeout(function() { t.style.borderColor = ''; }, 200); setTimeout(fireBorder, 1500 + Math.random() * 3000); }
    setTimeout(fireBorder, 3000);
    var mqGlitch = document.querySelector('.marquee-glitch-line');
    function fireMarquee() { if (!mqGlitch) return; mqGlitch.classList.add('fire'); setTimeout(function() { mqGlitch.classList.remove('fire'); }, 300); setTimeout(fireMarquee, 6000 + Math.random() * 12000); }
    setTimeout(fireMarquee, 5000);
}

function initCinemaText() {
    var el = document.querySelector('.cinema-text');
    if (!el || el.dataset.ctInit) return;
    el.dataset.ctInit = '1';
    var text = el.getAttribute('data-text') || el.textContent.trim();
    el.innerHTML = '';
    var core = document.createElement('span'); core.style.cssText = 'position:relative;z-index:1'; core.textContent = text;
    var topL = document.createElement('div'); topL.className = 'ct-top'; topL.style.opacity = '0'; topL.innerHTML = '<span>' + text + '</span>';
    var botL = document.createElement('div'); botL.className = 'ct-bot'; botL.style.opacity = '0'; botL.innerHTML = '<span>' + text + '</span>';
    var scan = document.createElement('span'); scan.className = 'ct-scan';
    el.appendChild(core); el.appendChild(topL); el.appendChild(botL); el.appendChild(scan);
    function chroma() { var d = 80 + Math.random() * 150; topL.style.opacity = '1'; botL.style.opacity = '1'; setTimeout(function() { topL.style.opacity = '0'; botL.style.opacity = '0'; }, d); }
    (function sch() { setTimeout(function() { var p = document.getElementById('pg-beranda'); if (p && p.classList.contains('on')) chroma(); sch(); }, 3000 + Math.random() * 5000); })();
}

var toolsInitDone = false;
function initToolsEffects() {
    if (toolsInitDone) return; toolsInitDone = true;
    var tp = document.getElementById('pg-tools'); if (!tp) return;
    var cards = tp.querySelectorAll('.tools-card');
    var tcEl = document.getElementById('toolCount');
    var dt = tp.querySelector('.tools-deco-text');
    function updCount() { if (tcEl) { var v = 0; for (var i = 0; i < cards.length; i++) { if (cards[i].style.display !== 'none') v++; } tcEl.textContent = v + ' TOOLS_LOADED'; } }
    updCount();
    if (dt) { var dts = ['SYS::TOOLS_ARSENAL // SCANNING...','SYS::TOOLS_ARSENAL // ALL_MODULES_LOADED','SYS::TOOLS_ARSENAL // INTEGRITY: 100%','SYS::TOOLS_ARSENAL // SYNC: COMPLETE','SYS::TOOLS_ARSENAL // STATUS: NOMINAL']; (function cyc() { setTimeout(function() { var p = document.getElementById('pg-tools'); if (!p || !p.classList.contains('on')) { setTimeout(cyc, 3000); return; } dt.style.opacity = '0'; setTimeout(function() { dt.textContent = dts[Math.floor(Math.random() * dts.length)]; dt.style.opacity = '1'; }, 200); setTimeout(cyc, 3000 + Math.random() * 4000); }); }); }
    (function fl() { setTimeout(function() { var p = document.getElementById('pg-tools'); if (!p || !p.classList.contains('on')) { setTimeout(fl, 3000); return; } var vis = []; for (var i = 0; i < cards.length; i++) { if (cards[i].style.display !== 'none' && cards[i].offsetParent !== null) vis.push(cards[i]); } if (vis.length) { var t = vis[Math.floor(Math.random() * vis.length)]; t.classList.add('flash-border'); setTimeout(function() { t.classList.remove('flash-border'); }, 300); } setTimeout(fl, 2000 + Math.random() * 3000); }); })();
}

function initCounters() {
    function gc(id, target, suffix) { suffix = suffix || '+'; var el = document.getElementById(id); if (!el) return; var chars = '0123456789_/#@!?'; var st = performance.now(); (function tick(now) { var p = Math.min((now - st) / 2200, 1); if (p >= 1) { el.textContent = target + suffix; el.classList.add('done'); return; } if (Math.random() < 1 - p) { var t = String(target), r = ''; for (var i = 0; i < t.length; i++) r += Math.random() < (1 - p) * 0.6 ? chars[Math.floor(Math.random() * chars.length)] : t[i]; el.textContent = r; } else el.textContent = Math.floor(target * p); requestAnimationFrame(tick); })(performance.now()); }
    var obs = new IntersectionObserver(function(e) { for (var i = 0; i < e.length; i++) { if (e[i].isIntersecting) { gc('c4',247,'+'); gc('c5',53,'+'); gc('c6',189,'+'); gc('c7',412,'+'); obs.disconnect(); } } }, { threshold: 0.5 });
    var c4 = document.getElementById('c4'); if (c4) obs.observe(c4);
}

function initKaryaCount() { var cards = document.querySelectorAll('#karyaGrid .kc'); var el = document.getElementById('karyaCount'); if (el && cards.length) el.textContent = cards.length + ' PROJECTS'; }

function initFadeUp() { var els = document.querySelectorAll('.fu'); for (var i = 0; i < els.length; i++) els[i].classList.remove('sh'); var ap = document.querySelector('.page.on'); if (!ap) return; var pe = ap.querySelectorAll('.fu'); for (var j = 0; j < pe.length; j++) pe[j].classList.add('sh'); }

var revealObs = null;
function initReveal() { if (revealObs) revealObs.disconnect(); revealObs = new IntersectionObserver(function(e) { for (var i = 0; i < e.length; i++) { if (e[i].isIntersecting) e[i].target.classList.add('sh'); } }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }); var els = document.querySelectorAll('.rv'); for (var i = 0; i < els.length; i++) { var r = els[i].getBoundingClientRect(); if (r.top > window.innerHeight || r.bottom < 0) els[i].classList.remove('sh'); revealObs.observe(els[i]); } }

window.toast = function(msg) { var t = document.getElementById('toast'), m = document.getElementById('tmsg'); if (t && m) { m.textContent = msg; t.classList.add('on'); setTimeout(function() { t.classList.remove('on'); }, 2500); } };
window.tmob = function() { var m = document.getElementById('mnav'), i = document.getElementById('mico'); if (m) m.classList.toggle('op'); if (i) i.setAttribute('icon', m && m.classList.contains('op') ? 'mdi:close' : 'mdi:menu'); };
window.cmob = function() { var m = document.getElementById('mnav'), i = document.getElementById('mico'); if (m) m.classList.remove('op'); if (i) i.setAttribute('icon', 'mdi:menu'); };

window.go = function(page) {
    var pages = document.querySelectorAll('.page'); for (var i = 0; i < pages.length; i++) pages[i].classList.remove('on');
    var t = document.getElementById('pg-' + page); if (t) t.classList.add('on');
    var nl = document.querySelectorAll('.nv'); for (var j = 0; j < nl.length; j++) { nl[j].classList.remove('act'); if (nl[j].getAttribute('data-p') === page) nl[j].classList.add('act'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function() { initFadeUp(); initReveal(); }, 80);
    if (page === 'tools') setTimeout(initToolsEffects, 500);
};
var fn = document.querySelector('.nv[data-p="beranda"]'); if (fn) fn.classList.add('act');

window.filtT = function(cat, btn) {
    var tabs = document.querySelectorAll('#pg-tools .tab'); for (var i = 0; i < tabs.length; i++) { tabs[i].classList.remove('on'); tabs[i].classList.add('text-slate-500'); }
    if (btn) { btn.classList.add('on'); btn.classList.remove('text-slate-500'); }
    var cards = document.querySelectorAll('.tc'); var vis = 0;
    for (var j = 0; j < cards.length; j++) { var tags = cards[j].getAttribute('data-t') || ''; if (cat === 'all' || tags.indexOf(cat) !== -1) { cards[j].style.display = ''; cards[j].style.opacity = '0'; cards[j].style.transform = 'translateY(15px)'; vis++; (function(c) { setTimeout(function() { c.style.transition = 'all 0.35s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, 30); })(cards[j]); } else { cards[j].style.display = 'none'; } }
    var tc = document.getElementById('toolCount'); if (tc) tc.textContent = vis + ' TOOLS_LOADED';
};

window.filtK = function(cat, btn) {
    var tabs = btn.parentNode.querySelectorAll('.tab'); for (var i = 0; i < tabs.length; i++) { tabs[i].classList.remove('on'); tabs[i].classList.add('text-slate-500'); }
    btn.classList.add('on'); btn.classList.remove('text-slate-500');
    var cards = document.querySelectorAll('#karyaGrid .kc'); var vis = 0;
    for (var j = 0; j < cards.length; j++) { var tags = cards[j].getAttribute('data-k') || ''; if (cat === 'all' || tags.indexOf(cat) !== -1) { cards[j].style.display = ''; cards[j].style.opacity = '0'; cards[j].style.transform = 'translateY(15px)'; vis++; (function(c) { setTimeout(function() { c.style.transition = 'all 0.35s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, 30); })(cards[j]); } else { cards[j].style.display = 'none'; } }
    var emp = document.getElementById('karyaEmpty'); if (emp) emp.classList.toggle('hidden', vis > 0);
    var kc = document.getElementById('karyaCount'); if (kc) kc.textContent = vis + ' PROJECTS';
};

console.log('>>> CEPEDIT ready');
/* ============================================
   CEPEDIT — script.js (COMPLETE + ENHANCEMENTS)
   ============================================ */
console.log('>>> CEPEDIT loaded');

/* ==========================================
   BAGIAN 1: LOADER
   ========================================== */
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
var loadingFinished = false;

function updateBar() {
    try {
        progress += (Math.random() * 8 + 2);
        if (progress > 100) progress = 100;
        if (barFill) barFill.style.width = progress + '%';
        if (barPercent) barPercent.textContent = Math.floor(progress) + '%';
        if (progress > statusIndex * 14 && statusIndex < statusMessages.length - 1) statusIndex++;
        typeStatus(statusMessages[statusIndex]);
        if (barFill) {
            if (progress < 100) barFill.classList.add('active');
            else barFill.classList.remove('active');
        }
        if (progress >= 100 && !done) {
            done = true;
            setTimeout(function () {
                typeStatus('SYSTEM READY.');
                setTimeout(finishLoading, 600);
            }, 400);
            return;
        }
        setTimeout(updateBar, 80 + Math.random() * 120);
    } catch (e) {
        console.error('updateBar:', e);
        finishLoading();
    }
}

function typeStatus(text) {
    if (!statusEl) return;
    try {
        statusEl.innerHTML = '';
        var i = 0;
        var interval = setInterval(function () {
            if (i < text.length) {
                statusEl.innerHTML = text.substring(0, i + 1) + '<span class="bk">\u258A</span>';
                i++;
            } else {
                clearInterval(interval);
            }
        }, 30);
    } catch (e) {
        statusEl.textContent = text;
    }
}

function finishLoading() {
    if (loadingFinished) return;
    loadingFinished = true;
    try { if (flash) flash.classList.add('flash'); } catch (e) {}
    setTimeout(function () {
        try {
            if (loader) loader.classList.add('out');
            document.body.style.overflow = '';
            var mc = document.getElementById('mainContent');
            if (mc) mc.classList.add('vis');
            initAllEffects();
        } catch (e) {
            console.error('finish:', e);
            forceShow();
        }
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
setTimeout(function () {
    if (!loadingFinished) {
        if (barFill) barFill.style.width = '100%';
        if (barPercent) barPercent.textContent = '100%';
        finishLoading();
    }
}, 6000);

/* ==========================================
   BAGIAN 2: INISIALISASI SEMUA EFEK
   ========================================== */
function initAllEffects() {
    try { initFadeUp(); } catch (e) { console.warn('initFadeUp:', e); }
    try { initReveal(); } catch (e) { console.warn('initReveal:', e); }
    try { initGlitchEffects(); } catch (e) { console.warn('initGlitchEffects:', e); }
    try { initDataRain(); } catch (e) { console.warn('initDataRain:', e); }
    try { initCinemaText(); } catch (e) { console.warn('initCinemaText:', e); }
    try { initToolsEffects(); } catch (e) { console.warn('initToolsEffects:', e); }
    try { initCounters(); } catch (e) { console.warn('initCounters:', e); }
    try { initKaryaCount(); } catch (e) { console.warn('initKaryaCount:', e); }
    try { initToolClicks(); } catch (e) { console.warn('initToolClicks:', e); }
    try { initKaryaClicks(); } catch (e) { console.warn('initKaryaClicks:', e); }
    try { initKaryaVideos(); } catch (e) { console.warn('initKaryaVideos:', e); }
    /* ==== ENHANCEMENT: fitur baru ==== */
    try { initViewfinderCursor(); } catch (e) { console.warn('initViewfinderCursor:', e); }
    try { initScrollTimeline(); } catch (e) { console.warn('initScrollTimeline:', e); }
    try { initHeroTilt(); } catch (e) { console.warn('initHeroTilt:', e); }
    try { initBackToTop(); } catch (e) { console.warn('initBackToTop:', e); }
}

/* ==========================================
   BAGIAN 3: DATA RAIN
   ========================================== */
var _rainRAF = null, _rainActive = false, _rainCanvas = null, _rainCtx = null, _rainCols = 0, _rainDrops = [];
var _rainChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

function _rainResize() {
    if (!_rainCanvas) return;
    _rainCanvas.width = window.innerWidth;
    _rainCanvas.height = window.innerHeight;
    _rainCols = Math.floor(_rainCanvas.width / 14);
    _rainDrops = [];
    for (var i = 0; i < _rainCols; i++) _rainDrops[i] = Math.random() * -100;
}

function _rainDraw() {
    if (!_rainActive || !_rainCtx) { _rainRAF = null; return; }
    _rainCtx.fillStyle = 'rgba(5,5,6,0.06)';
    _rainCtx.fillRect(0, 0, _rainCanvas.width, _rainCanvas.height);
    _rainCtx.font = '10px JetBrains Mono,monospace';
    for (var i = 0; i < _rainCols; i++) {
        if (_rainDrops[i] > 0) {
            _rainCtx.fillStyle = 'rgba(16,185,129,0.12)';
            _rainCtx.fillText(_rainChars[Math.floor(Math.random() * _rainChars.length)], i * 14, _rainDrops[i] * 14);
        }
        _rainDrops[i] += 0.3 + Math.random() * 0.3;
        if (_rainDrops[i] * 14 > _rainCanvas.height && Math.random() > 0.98) _rainDrops[i] = 0;
    }
    _rainRAF = requestAnimationFrame(_rainDraw);
}

function _rainPause() {
    _rainActive = false;
    if (_rainRAF) { cancelAnimationFrame(_rainRAF); _rainRAF = null; }
    if (_rainCtx && _rainCanvas) _rainCtx.clearRect(0, 0, _rainCanvas.width, _rainCanvas.height);
}

function _rainResume() {
    if (_rainActive) return;
    _rainActive = true;
    _rainRAF = requestAnimationFrame(_rainDraw);
}

function initDataRain() {
    _rainCanvas = document.getElementById('dataRain');
    if (!_rainCanvas) return;
    _rainCtx = _rainCanvas.getContext('2d');
    if (!_rainCtx) return;
    _rainResize();
    window.addEventListener('resize', _rainResize);
    _rainResume();
}

/* ==========================================
   BAGIAN 4: GLITCH EFFECTS
   ========================================== */
function initGlitchEffects() {
    var hs = document.querySelector('.hero-section');
    if (!hs) return;
    var overlay = document.createElement('div');
    overlay.className = 'gh-overlay';
    hs.appendChild(overlay);

    function fireLines() {
        var pg = document.getElementById('pg-beranda');
        if (!pg || !pg.classList.contains('on')) { setTimeout(fireLines, 4000); return; }
        var n = 2 + Math.floor(Math.random() * 4);
        for (var b = 0; b < n; b++) {
            (function (delay) {
                setTimeout(function () {
                    var l = document.createElement('div');
                    l.className = 'gh-line';
                    l.style.top = (5 + Math.random() * 90) + '%';
                    l.style.height = (1 + Math.random() * 2) + 'px';
                    hs.appendChild(l);
                    requestAnimationFrame(function () { l.classList.add('fire'); });
                    setTimeout(function () { if (l.parentNode) l.parentNode.removeChild(l); }, 700);
                }, delay);
            })(b * 50);
        }
        setTimeout(fireLines, 2000 + Math.random() * 5000);
    }
    setTimeout(fireLines, 3000);

    function fireOverlay() {
        var pg = document.getElementById('pg-beranda');
        if (!pg || !pg.classList.contains('on')) { setTimeout(fireOverlay, 3000); return; }
        overlay.classList.remove('fire');
        void overlay.offsetWidth;
        overlay.classList.add('fire');
        setTimeout(function () { overlay.classList.remove('fire'); }, 500);
        setTimeout(fireOverlay, 4000 + Math.random() * 8000);
    }
    setTimeout(fireOverlay, 4000);

    var stEl = document.querySelector('.gh-static');
    function fireStatic() {
        if (!stEl) return;
        var pg = document.getElementById('pg-beranda');
        if (!pg || !pg.classList.contains('on')) { setTimeout(fireStatic, 6000); return; }
        stEl.classList.add('fire');
        setTimeout(function () { stEl.classList.remove('fire'); }, 200);
        setTimeout(fireStatic, 8000 + Math.random() * 15000);
    }
    setTimeout(fireStatic, 10000);

    function fireBorder() {
        var pg = document.getElementById('pg-beranda');
        if (!pg || !pg.classList.contains('on')) { setTimeout(fireBorder, 4000); return; }
        var tgts = pg.querySelectorAll('.gh-border-flash');
        if (!tgts.length) { setTimeout(fireBorder, 4000); return; }
        var t = tgts[Math.floor(Math.random() * tgts.length)];
        t.style.borderColor = 'rgba(16,185,129,0.4)';
        setTimeout(function () { t.style.borderColor = 'rgba(6,182,212,0.25)'; }, 80);
        setTimeout(function () { t.style.borderColor = ''; }, 200);
        setTimeout(fireBorder, 1500 + Math.random() * 3000);
    }
    setTimeout(fireBorder, 3000);

    var mqGlitch = document.querySelector('.marquee-glitch-line');
    function fireMarquee() {
        if (!mqGlitch) return;
        mqGlitch.classList.add('fire');
        setTimeout(function () { mqGlitch.classList.remove('fire'); }, 300);
        setTimeout(fireMarquee, 6000 + Math.random() * 12000);
    }
    setTimeout(fireMarquee, 5000);
}

/* ==========================================
   BAGIAN 5: CINEMA TEXT
   ========================================== */
function initCinemaText() {
    var el = document.querySelector('.cinema-text');
    if (!el || el.dataset.ctInit) return;
    el.dataset.ctInit = '1';
    var text = el.getAttribute('data-text') || el.textContent.trim();
    el.innerHTML = '';
    var core = document.createElement('span');
    core.style.cssText = 'position:relative;z-index:1';
    core.textContent = text;
    var topL = document.createElement('div');
    topL.className = 'ct-top';
    topL.style.opacity = '0';
    topL.innerHTML = '<span>' + text + '</span>';
    var botL = document.createElement('div');
    botL.className = 'ct-bot';
    botL.style.opacity = '0';
    botL.innerHTML = '<span>' + text + '</span>';
    var scan = document.createElement('span');
    scan.className = 'ct-scan';
    el.appendChild(core);
    el.appendChild(topL);
    el.appendChild(botL);
    el.appendChild(scan);

    function chroma() {
        var d = 80 + Math.random() * 150;
        topL.style.opacity = '1';
        botL.style.opacity = '1';
        setTimeout(function () { topL.style.opacity = '0'; botL.style.opacity = '0'; }, d);
    }
    (function sch() {
        setTimeout(function () {
            var pg = document.getElementById('pg-beranda');
            if (pg && pg.classList.contains('on')) chroma();
            sch();
        }, 3000 + Math.random() * 5000);
    })();
}

/* ==========================================
   BAGIAN 6: TOOLS EFFECTS
   ========================================== */
var toolsInitDone = false;
function initToolsEffects() {
    if (toolsInitDone) return;
    toolsInitDone = true;
    var tp = document.getElementById('pg-tools');
    if (!tp) return;
    var dt = tp.querySelector('.tools-deco-text');
    if (dt) {
        var dts = ['SYS::TOOLS_ARSENAL // SCANNING...','SYS::TOOLS_ARSENAL // ALL_MODULES_LOADED','SYS::TOOLS_ARSENAL // INTEGRITY: 100%','SYS::TOOLS_ARSENAL // SYNC: COMPLETE','SYS::TOOLS_ARSENAL // STATUS: NOMINAL'];
        (function cyc() {
            setTimeout(function () {
                var p = document.getElementById('pg-tools');
                if (!p || !p.classList.contains('on')) { setTimeout(cyc, 3000); return; }
                dt.style.opacity = '0';
                setTimeout(function () { dt.textContent = dts[Math.floor(Math.random() * dts.length)]; dt.style.opacity = '1'; }, 200);
                setTimeout(cyc, 3000 + Math.random() * 4000);
            })();
        })();
    }
}

/* ==========================================
   BAGIAN 7: COUNTER ANIMASI
   ========================================== */
function initCounters() {
    function gc(id, target, suffix) {
        suffix = suffix || '+';
        var el = document.getElementById(id);
        if (!el) return;
        var chars = '0123456789_/#@!?';
        var st = performance.now();
        (function tick(now) {
            var p = Math.min((now - st) / 2200, 1);
            if (p >= 1) { el.textContent = target + suffix; el.classList.add('done'); return; }
            if (Math.random() < 1 - p) {
                var t = String(target), r = '';
                for (var i = 0; i < t.length; i++) r += Math.random() < (1 - p) * 0.6 ? chars[Math.floor(Math.random() * chars.length)] : t[i];
                el.textContent = r;
            } else { el.textContent = Math.floor(target * p); }
            requestAnimationFrame(tick);
        })(performance.now());
    }
    var obs = new IntersectionObserver(function (e) {
        for (var i = 0; i < e.length; i++) {
            if (e[i].isIntersecting) { gc('c4',247,'+'); gc('c5',53,'+'); gc('c6',189,'+'); gc('c7',412,'+'); obs.disconnect(); }
        }
    }, { threshold: 0.5 });
    var c4 = document.getElementById('c4');
    if (c4) obs.observe(c4);
}

/* ==========================================
   BAGIAN 8: FADE UP & REVEAL
   ========================================== */
function initKaryaCount() {
    var cards = document.querySelectorAll('#karyaGrid .kc');
    var el = document.getElementById('karyaCount');
    if (el && cards.length) el.textContent = cards.length + ' PROJECTS';
}

function initFadeUp() {
    var allFu = document.querySelectorAll('.fu');
    for (var i = 0; i < allFu.length; i++) allFu[i].classList.remove('sh');
    var ap = document.querySelector('.page.on');
    if (!ap) return;
    var pe = ap.querySelectorAll('.fu');
    for (var j = 0; j < pe.length; j++) pe[j].classList.add('sh');
}

var revealObs = null;
function initReveal() {
    if (revealObs) revealObs.disconnect();
    revealObs = new IntersectionObserver(function (e) {
        for (var i = 0; i < e.length; i++) { if (e[i].isIntersecting) e[i].target.classList.add('sh'); }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    var els = document.querySelectorAll('.rv');
    for (var i = 0; i < els.length; i++) {
        var r = els[i].getBoundingClientRect();
        if (r.top > window.innerHeight || r.bottom < 0) els[i].classList.remove('sh');
        revealObs.observe(els[i]);
    }
}

/* ==========================================
   BAGIAN 9: NAVIGASI & TOAST
   ========================================== */
window.toast = function (msg) {
    var t = document.getElementById('toast'), m = document.getElementById('tmsg');
    if (t && m) { m.textContent = msg; t.classList.add('on'); setTimeout(function () { t.classList.remove('on'); }, 2500); }
};

window.tmob = function () {
    var m = document.getElementById('mnav'), i = document.getElementById('mico');
    if (m) m.classList.toggle('op');
    if (i) i.setAttribute('icon', m && m.classList.contains('op') ? 'mdi:close' : 'mdi:menu');
};

window.cmob = function () {
    var m = document.getElementById('mnav'), i = document.getElementById('mico');
    if (m) m.classList.remove('op');
    if (i) i.setAttribute('icon', 'mdi:menu');
};

window.go = function (page) {
    /* ==== ENHANCEMENT: glitch flash tiap pindah halaman ==== */
    fireGlitchTransition();

    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) pages[i].classList.remove('on');
    var target = document.getElementById('pg-' + page);
    if (target) target.classList.add('on');
    var navBtns = document.querySelectorAll('.nv');
    for (var j = 0; j < navBtns.length; j++) {
        navBtns[j].classList.remove('act');
        if (navBtns[j].getAttribute('data-p') === page) navBtns[j].classList.add('act');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function () { initFadeUp(); initReveal(); }, 80);
    if (page === 'tools') setTimeout(function () { initToolsEffects(); }, 500);
    if (page === 'karya') setTimeout(function () { initKaryaVideos(); }, 500);
    if (page === 'beranda') _rainResume(); else _rainPause();
};

var firstNav = document.querySelector('.nv[data-p="beranda"]');
if (firstNav) firstNav.classList.add('act');

/* ==========================================
   BAGIAN 10: FILTER KARYA
   ========================================== */
window.filtK = function (cat, btn) {
    var tabs = btn.parentNode.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) { tabs[i].classList.remove('on'); tabs[i].classList.add('text-slate-500'); }
    btn.classList.add('on');
    btn.classList.remove('text-slate-500');
    var cards = document.querySelectorAll('#karyaGrid .kc');
    var vis = 0;
    for (var j = 0; j < cards.length; j++) {
        var tags = cards[j].getAttribute('data-k') || '';
        if (cat === 'all' || tags.indexOf(cat) !== -1) {
            cards[j].style.display = '';
            cards[j].style.opacity = '0';
            cards[j].style.transform = 'translateY(15px)';
            vis++;
            (function (card) { setTimeout(function () { card.style.transition = 'all 0.35s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 30); })(cards[j]);
        } else { cards[j].style.display = 'none'; }
    }
    var emp = document.getElementById('karyaEmpty');
    if (emp) emp.classList.toggle('hidden', vis > 0);
    var kc = document.getElementById('karyaCount');
    if (kc) kc.textContent = vis + ' PROJECTS';
    setTimeout(function () { initKaryaVideos(); }, 100);
};

/* ==========================================
   BAGIAN 11: DETAIL OVERLAY TOOLS
   ========================================== */
window.openDetail = function (app) {
    var el = null;
    if (app === 'capcut') el = document.getElementById('detailCapCut');
    else if (app === 'alight') el = document.getElementById('detailAlight');
    if (!el) return;
    document.body.style.overflow = 'hidden';
    el.classList.add('open');
    var sa = el.querySelector('.detail-scroll');
    if (sa) sa.scrollTop = 0;
    var fus = el.querySelectorAll('.fu');
    for (var i = 0; i < fus.length; i++) fus[i].classList.remove('sh');
    setTimeout(function () { for (var j = 0; j < fus.length; j++) fus[j].classList.add('sh'); }, 100);
    var rvs = el.querySelectorAll('.rv');
    for (var k = 0; k < rvs.length; k++) rvs[k].classList.remove('sh');
    if (el._obs) { el._obs.disconnect(); el._obs = null; }
    var obs = new IntersectionObserver(function (en) { for (var x = 0; x < en.length; x++) { if (en[x].isIntersecting) en[x].target.classList.add('sh'); } }, { threshold: 0.1, root: sa, rootMargin: '0px 0px -5% 0px' });
    for (var m = 0; m < rvs.length; m++) obs.observe(rvs[m]);
    el._obs = obs;
};

window.closeDetail = function () {
    var ovs = document.querySelectorAll('.detail-overlay.open');
    for (var i = 0; i < ovs.length; i++) {
        if (ovs[i].id === 'detailKarya') continue;
        ovs[i].classList.remove('open');
        if (ovs[i]._obs) { ovs[i]._obs.disconnect(); ovs[i]._obs = null; }
    }
    document.body.style.overflow = '';
};

/* ==========================================
   BAGIAN 12: TOOL CARD CLICKS (DELEGATION)
   ========================================== */
function initToolClicks() {
    var grid = document.querySelector('.tool-grid');
    if (!grid || grid._toolDelegated) return;
    grid._toolDelegated = true;
    grid.addEventListener('click', function (e) {
        var card = e.target.closest('.tool-card[data-tool]');
        if (card) { e.stopPropagation(); var tool = card.getAttribute('data-tool'); if (tool) openDetail(tool); }
    });
}

/* ==========================================
   BAGIAN 13: DATA KARYA
   ========================================== */
var karyaData = {
    karya1: { title:'Urban Nightscapes', cat:'CINEMATIC', year:'2024', img:'https://picsum.photos/seed/karya1a/1920/1080.jpg', vid:'WhatsApp Video 2026-08-03 at 07.49.49.mp4', dur:'1:32', res:'4K', fps:'24fps', asp:'2.35:1', grade:'Teal & Orange', tools:[{n:'CapCut',i:'simple-icons:capcut',c:'emerald'},{n:'Alight Motion',i:'mdi:vector-combine',c:'cyan'}], desc:'Sebuah cinematic reel yang menangkap suasana kota malam dari berbagai sudut. Setiap frame dirancang untuk membangun atmosfer — dari cahaya neon yang memantul di aspal basah sampai bayangan yang bermain di antara gedung-gedung tinggi.', desc2:'Project ini jadi salah satu yang paling satisfying dikerjakan karena proses color grading-nya yang intensive. Setiap scene punya mood berbeda tapi tetap konsisten secara keseluruhan.', process:'Footage diambil dalam beberapa malam berbeda. Di CapCut, semua klip di-rough cut dulu berdasarkan lokasi. Lalu audio lo-fi ambient dimasukin dan di-sync beat. Color grading pakai adjustment layer dengan LUT custom teal-orange. Motion graphics intro dibuat di Alight Motion — text reveal dengan glow effect, lalu di-export alpha dan di-layer di CapCut.', challenges:'Tantangan terbesar adalah konsistensi color grade antar scene yang di-shoot di waktu dan lokasi berbeda. Solusinya: bikin satu base grade yang dipakai di semua klip, lalu adjust per-scene di atasnya.', tags:['CINEMATIC','NIGHT','COLOR_GRADE','AMBIENT'] },
    karya2: { title:'Beat Sync Edit', cat:'MUSIC VIDEO', year:'2024', img:'https://picsum.photos/seed/karya2b/1920/1080.jpg', vid:'WhatsApp Video 2026-08-03 at 07.49.54.mp4', dur:'0:48', res:'1080p', fps:'60fps', asp:'16:9', grade:'High Contrast', tools:[{n:'CapCut',i:'simple-icons:capcut',c:'emerald'}], desc:'Edit yang sepenuhnya digerakkan oleh beat musik. Setiap cut, setiap transisi, setiap zoom — semuanya terjadi tepat di ketukan drum. Ini jenis edit yang butuh patience tinggi karena satu frame salah bisa menghancurkan rhythm.', desc2:'Musiknya punya BPM sekitar 140, artinya ada sekitar 672 beat dalam 48 detik. Setiap beat adalah kesempatan untuk cut — dan nggak semua beat harus dipakai. Yang bikin bagus adalah ketika kamu tahu kapan harus cut dan kapan harus hold.', process:'Pertama musik dimasukin ke timeline dan di-zoom sampai level frame. Setiap beat ditandai dengan marker. Lalu footage di-import dan di-pilih mana yang cocok untuk setiap segmen. Cutting dilakukan frame-by-frame. Speed ramp di bagian chorus untuk nambah energi.', challenges:'Mempertahankan energy sepanjang 48 detik tanpa bikin penonton bosan. Solusinya: variation — ada bagian fast-cut, ada yang hold lebih lama, ada slow-mo di bridge.', tags:['BEAT_SYNC','HIGH_ENERGY','FAST_CUT','60FPS'] },
    karya3: { title:'Transition Pack Demo', cat:'SHORT FORM', year:'2024', img:'https://picsum.photos/seed/karya3c/1920/1080.jpg', vid:'WhatsApp Video 2026-08-03 at 07.50.19 (1).mp4', dur:'0:35', res:'1080p', fps:'30fps', asp:'9:16', grade:'Clean & Vibrant', tools:[{n:'CapCut',i:'simple-icons:capcut',c:'emerald'},{n:'Alight Motion',i:'mdi:vector-combine',c:'cyan'}], desc:'Kumpulan custom transition yang dibuat dari nol. Setiap transition punya konsep berbeda — ada yang pakai mask, ada yang pakai 3D perspective, ada yang pakai shape morphing. Semua dirancang buat dipakai ulang di project lain.', desc2:'Tujuannya bikin "library" transition personal yang nggak bakal kelihatan sama seperti template yang udah ada di mana-mana. Setiap transition harus punya signature visual yang unik.', process:'Konsep setiap transition di-sketch dulu. Lalu di Alight Motion, shape dan mask di-animate dengan keyframe + easing custom. Export sebagai video transparan (alpha channel). Di CapCut, footage dipotong dan transition di-layer di antara klip.', challenges:'Membuat transition yang smooth tapi tetap terlihat "berbeda" dari yang sudah ada. Solusinya: combine beberapa teknik sekaligus — misalnya mask + scale + rotation dalam satu transisi.', tags:['TRANSITIONS','ALPHA_EXPORT','REUSABLE','9:16'] },
    karya4: { title:'Product Showcase', cat:'CLIENT', year:'2024', img:'https://picsum.photos/seed/karya4d/1920/1080.jpg', vid:'WhatsApp Video 2026-08-03 at 07.50.19.mp4', dur:'0:58', res:'4K', fps:'24fps', asp:'16:9', grade:'Warm Commercial', tools:[{n:'CapCut',i:'simple-icons:capcut',c:'emerald'}], desc:'Video showcase produk untuk klien. Target-nya jelas: bikin produk terlihat premium dan desirable. Setiap shot harus menunjukkan detail dan fitur produk dari angle terbaik, dengan lighting dan grading yang memperkuat kesan mewah.', desc2:'Yang menarik dari project ini adalah brief-nya sangat spesifik: "buat orang pengen beli setelah nonton ini." Jadi setiap keputusan editing — dari pacing sampai color — diarahkan ke satu tujuan itu.', process:'Rough cut berdasarkan storyboard dari klien. Shot yang kurang bagus di-exclude. Audio dipilih yang upbeat tapi nggak terlalu agresif. Color grade dengan tone warm untuk kesan premium. Text overlay dan logo placement disesuaikan dengan brand guideline klien.', challenges:'Deadline ketat dan revisi yang banyak. Solusinya: komunikasi yang jelas dari awal soal ekspektasi, dan bikin versi "safe" yang sudah approve-able lalu baru tambahkan creative touches.', tags:['CLIENT_WORK','COMMERCIAL','4K','BRAND'] },
    karya5: { title:'Golden Hour Reel', cat:'CINEMATIC', year:'2024', img:'https://picsum.photos/seed/karya5e/1920/1080.jpg', vid:'WhatsApp Video 2026-08-03 at 11.47.43.mp4', dur:'2:15', res:'4K', fps:'24fps', asp:'16:9', grade:'Warm Golden', tools:[{n:'CapCut',i:'simple-icons:capcut',c:'emerald'}], desc:'Reel yang sepenuhnya di-shoot saat golden hour — jam-jam ketika cahaya matahari menciptakan tone hangat dan emas yang magical. Ini pure visual storytelling tanpa narasi, cuma gambar dan musik yang berbicara.', desc2:'Yang bikin project ini spesial adalah kesabaran yang dibutuhkan. Golden hour itu cuma berlangsung sekitar 30-45 menit per hari. Jadi setiap shooting session itu precious — nggak ada room untuk error.', process:'Footage dari beberapa hari shooting di-select hanya yang terbaik. Di CapCut, klip di-arrange berdasarkan flow emosional: dari tenang ke intens ke lega. Color grade memaksimalkan tone golden yang sudah ada di footage — push warm tones, tambah sedikit amber di highlights, dan soft vignette.', challenges:'Mendapatkan variasi shot yang cukup dari waktu yang terbatas. Solusinya: shooting di 5 hari berbeda, setiap hari fokus ke lokasi dan subjek yang berbeda.', tags:['GOLDEN_HOUR','NATURE','VISUAL_STORY','WARM_TONE'] },
    karya6: { title:'Lyric Visualizer', cat:'MUSIC VIDEO', year:'2024', img:'https://picsum.photos/seed/karya6f/1920/1080.jpg', vid:'WhatsApp Video 2026-08-03 at 11.48.02.mp4', dur:'3:22', res:'1080p', fps:'30fps', asp:'16:9', grade:'Moody Blue', tools:[{n:'Alight Motion',i:'mdi:vector-combine',c:'cyan'},{n:'CapCut',i:'simple-icons:capcut',c:'emerald'}], desc:'Visualizer untuk lagu yang menampilkan lirik secara visual. Setiap bar lirik muncul dengan animasi yang berbeda — ada yang fade, ada yang slide, ada yang glitch. Semua disync ke audio dengan presisi tinggi.', desc2:'Ini project paling "Alight Motion-heavy" yang pernah dikerjakan. Hampir semua visual element dibuat di AM — text animation, particle effect, background gradient yang berubah sesuai mood lagu. CapCut dipakai untuk final assembly dan audio sync.', process:'Di Alight Motion: setiap lirik line dibuat sebagai layer text terpisah. Masing-masing di-animate dengan keyframe (position, opacity, scale, rotation) dan diberi easing yang sesuai dengan feel lirik. Background menggunakan gradient yang berubah warna per section. Particle effect ditambah untuk nambah depth. Export per-section sebagai alpha video.', challenges:'Mensync 3+ menit animasi teks ke audio dengan presisi. Solusinya: audio dipotong jadi sections dulu, lalu tiap section dikerjakan terpisah. Per-section di-export, lalu di-assemble di CapCut untuk fine-tuning timing.', tags:['LYRIC_VIDEO','TEXT_ANIMATION','PARTICLES','MOODY'] }
};

/* ==========================================
   BAGIAN 14: BUKA DETAIL KARYA
   ========================================== */
window.openKaryaDetail = function (id) {
    var d = karyaData[id];
    if (!d) return;
    var el = document.getElementById('detailKarya');
    if (!el) return;

    var bgImg = d.vid || d.img;
    var bgEl = document.getElementById('karyaBgImg');
    if (bgEl) bgEl.src = bgImg;

    var toolBadges = '';
    for (var t = 0; t < d.tools.length; t++) {
        var tb = d.tools[t];
        var bc = tb.c === 'emerald' ? 'rgba(16,185,129,' : 'rgba(6,182,212,';
        toolBadges += '<span class="karya-tool-badge" style="background:' + bc + '.08);border:1px solid ' + bc + '.15);color:' + bc + '.7"><iconify-icon icon="' + tb.i + '" style="font-size:12px"></iconify-icon>' + tb.n + '</span>';
    }

    var tagHtml = '';
    for (var g = 0; g < d.tags.length; g++) {
        tagHtml += '<span class="text-emerald-500/40 bg-emerald-500/5 border border-emerald-500/10">' + d.tags[g] + '</span>';
    }

    var playerInner = '';
    if (d.vid) {
        playerInner = '<video class="karya-detail-vid" id="karyaDetailVid" src="' + d.vid + '" loop muted playsinline preload="auto"></video>';
        playerInner += '<div class="karya-detail-vid-toggle" id="karyaPlayBtn"><iconify-icon icon="mdi:play" class="text-emerald-400 text-2xl ml-0.5"></iconify-icon></div>';
        playerInner += '<div class="karya-detail-sound" id="karyaSoundBtn" title="Nyalakan Suara"><iconify-icon icon="mdi:volume-off" class="text-base"></iconify-icon></div>';
    } else {
        playerInner = '<img src="' + d.img + '" alt="' + d.title + '">';
    }

    var c = document.getElementById('karyaDetailContent');
    c.innerHTML = '<div class="detail-badge fu d1"><iconify-icon icon="mdi:play-circle-outline" class="text-emerald-400 text-sm"></iconify-icon><span>PROJECT_FILE</span></div>'
        + '<h1 class="detail-title fu d2 font-space text-[clamp(1.6rem,6vw,3.5rem)] font-light tracking-tight leading-[1.02] mb-2">' + d.title + '</h1>'
        + '<p class="detail-subtitle fu d3">' + d.cat + ' // ' + d.year + '</p>'
        + '<div class="detail-divider"></div>'
        + '<div class="karya-player rv" id="karyaPlayerBox">' + playerInner
        + '<div class="karya-player-hud"><span>REC ●</span><span>' + d.res + ' // ' + d.fps + '</span></div>'
        + '<div class="karya-player-corner kp-tl"></div><div class="karya-player-corner kp-tr"></div><div class="karya-player-corner kp-bl"></div><div class="karya-player-corner kp-br"></div>'
        + '<div class="karya-player-bar"><div class="karya-player-bar-track" id="kpbTrack"><div class="karya-player-bar-fill" id="kpbFill"><div class="karya-player-bar-thumb"></div></div></div><div class="karya-player-bar-times"><span id="kpbCur">00:00</span><span id="kpbDur">' + d.dur + '</span></div></div></div>'
        + '<div class="karya-specs rv"><div class="karya-spec-item"><div class="ks-label">DURATION</div><div class="ks-value">' + d.dur + '</div></div><div class="karya-spec-item"><div class="ks-label">RESOLUTION</div><div class="ks-value">' + d.res + '</div></div><div class="karya-spec-item"><div class="ks-label">FRAME RATE</div><div class="ks-value">' + d.fps + '</div></div><div class="karya-spec-item"><div class="ks-label">ASPECT</div><div class="ks-value">' + d.asp + '</div></div></div>'
        + '<div class="rv mb-6"><div class="font-mono text-[8px] text-emerald-500/30 uppercase tracking-[.12em] mb-2">COLOR GRADE</div><div class="text-sm font-medium text-slate-300">' + d.grade + '</div></div>'
        + '<div class="rv mb-6"><div class="font-mono text-[8px] text-emerald-500/30 uppercase tracking-[.12em] mb-3">TOOLS USED</div><div class="karya-tools-used">' + toolBadges + '</div></div>'
        + '<div class="detail-section rv"><div class="detail-section-head"><span class="detail-section-num">01</span><span class="detail-section-line"></span><span class="detail-section-label">OVERVIEW</span></div><h2>Tentang Project Ini</h2><p class="detail-text">' + d.desc + '</p><p class="detail-text">' + d.desc2 + '</p></div>'
        + '<div class="detail-section rv"><div class="detail-section-head"><span class="detail-section-num">02</span><span class="detail-section-line"></span><span class="detail-section-label">PROCESS</span></div><h2>Bagaimana Dibuat</h2><p class="detail-text">' + d.process + '</p></div>'
        + '<div class="detail-section rv"><div class="detail-section-head"><span class="detail-section-num">03</span><span class="detail-section-line"></span><span class="detail-section-label">CHALLENGE</span></div><h2>Tantangan & Solusi</h2><p class="detail-text">' + d.challenges + '</p></div>'
        + '<div class="detail-section rv detail-section-final"><div class="detail-section-head"><span class="detail-section-num">04</span><span class="detail-section-line"></span><span class="detail-section-label">META</span></div><div class="detail-tags">' + tagHtml + '</div></div>'
        + '<div class="detail-back-area rv"><button onclick="closeKaryaDetail()" class="gbtn gbtn-glitch text-[13px] font-medium text-emerald-400 px-6 py-2.5"><iconify-icon icon="mdi:arrow-left" class="mr-1 align-middle"></iconify-icon> Kembali ke Karya</button></div>';

    var playBtn = document.getElementById('karyaPlayBtn');
    var soundBtn = document.getElementById('karyaSoundBtn');
    var seekTrack = document.getElementById('kpbTrack');
    if (playBtn) playBtn.addEventListener('click', handlePlayClick);
    if (soundBtn) soundBtn.addEventListener('click', handleSoundClick);
    if (seekTrack) { seekTrack.addEventListener('mousedown', startSeek); seekTrack.addEventListener('touchstart', startSeek, { passive: false }); }

    var vid = document.getElementById('karyaDetailVid');
    if (vid) {
        vid.addEventListener('error', function () {
            console.warn('Video error:', d.vid);
            var pb = document.getElementById('karyaPlayerBox');
            if (pb) pb.innerHTML = '<img src="' + d.img + '" alt="' + d.title + '" style="width:100%;height:100%;object-fit:cover;filter:brightness(.4)"><div class="karya-player-hud"><span>REC ●</span><span>' + d.res + ' // ' + d.fps + '</span></div><div class="karya-player-corner kp-tl"></div><div class="karya-player-corner kp-tr"></div><div class="karya-player-corner kp-bl"></div><div class="karya-player-corner kp-br"></div>';
        }, { once: true });
    }

    document.body.style.overflow = 'hidden';
    el.classList.add('open');
    var sa = el.querySelector('.detail-scroll');
    if (sa) sa.scrollTop = 0;
    var fus = c.querySelectorAll('.fu');
    for (var i = 0; i < fus.length; i++) fus[i].classList.remove('sh');
    setTimeout(function () { for (var j = 0; j < fus.length; j++) fus[j].classList.add('sh'); }, 100);
    var rvs = c.querySelectorAll('.rv');
    for (var k = 0; k < rvs.length; k++) rvs[k].classList.remove('sh');
    if (el._obs) { el._obs.disconnect(); el._obs = null; }
    var obs = new IntersectionObserver(function (en) { for (var x = 0; x < en.length; x++) { if (en[x].isIntersecting) en[x].target.classList.add('sh'); } }, { threshold: 0.1, root: sa, rootMargin: '0px 0px -5% 0px' });
    for (var m = 0; m < rvs.length; m++) obs.observe(rvs[m]);
    el._obs = obs;
    if (d.vid) setTimeout(startPlayerTracker, 300);
};

/* ==========================================
   BAGIAN 15: PLAY CLICK
   ========================================== */
function handlePlayClick(e) {
    e.stopPropagation();
    var vid = document.getElementById('karyaDetailVid');
    var btn = document.getElementById('karyaPlayBtn');
    if (!vid || !btn) return;
    if (vid.paused) {
        vid.muted = false; vid.volume = 1;
        var p = vid.play();
        if (p && typeof p.then === 'function') {
            p.then(function () {
                btn.innerHTML = '<iconify-icon icon="mdi:pause" class="text-emerald-400 text-2xl"></iconify-icon>';
                btn.style.borderColor = 'rgba(16,185,129,.5)';
                var sb = document.getElementById('karyaSoundBtn');
                if (sb) { sb.innerHTML = '<iconify-icon icon="mdi:volume-high" class="text-base"></iconify-icon>'; sb.classList.add('sound-on'); sb.title = 'Matikan Suara'; }
            }).catch(function () {
                vid.muted = true; vid.play().catch(function () {});
                btn.innerHTML = '<iconify-icon icon="mdi:pause" class="text-emerald-400 text-2xl"></iconify-icon>';
                btn.style.borderColor = 'rgba(16,185,129,.5)';
            });
        } else {
            btn.innerHTML = '<iconify-icon icon="mdi:pause" class="text-emerald-400 text-2xl"></iconify-icon>';
            btn.style.borderColor = 'rgba(16,185,129,.5)';
        }
    } else {
        vid.pause();
        btn.innerHTML = '<iconify-icon icon="mdi:play" class="text-emerald-400 text-2xl ml-0.5"></iconify-icon>';
        btn.style.borderColor = 'rgba(16,185,129,.3)';
    }
}

/* ==========================================
   BAGIAN 16: SOUND CLICK
   ========================================== */
function handleSoundClick(e) {
    e.stopPropagation();
    var vid = document.getElementById('karyaDetailVid');
    var btn = document.getElementById('karyaSoundBtn');
    if (!vid || !btn) return;
    if (vid.muted) {
        vid.muted = false; vid.volume = 1;
        setTimeout(function () {
            if (vid.muted) { toast('Browser memblokir suara. Coba klik tombol play.'); return; }
            btn.innerHTML = '<iconify-icon icon="mdi:volume-high" class="text-base"></iconify-icon>';
            btn.classList.add('sound-on'); btn.title = 'Matikan Suara';
        }, 80);
    } else {
        vid.muted = true;
        btn.innerHTML = '<iconify-icon icon="mdi:volume-off" class="text-base"></iconify-icon>';
        btn.classList.remove('sound-on'); btn.title = 'Nyalakan Suara';
    }
}

window.toggleDetailVid = function () {};
window.toggleDetailMute = function () {};

/* ==========================================
   BAGIAN 17: TUTUP DETAIL KARYA
   ========================================== */
window.closeKaryaDetail = function () {
    var el = document.getElementById('detailKarya');
    if (!el) return;
    var vid = document.getElementById('karyaDetailVid');
    if (vid) { vid.pause(); vid.muted = true; vid.removeAttribute('src'); vid.load(); }
    if (_playerRAF) { cancelAnimationFrame(_playerRAF); _playerRAF = null; }
    _seeking = false;
    el.classList.remove('open');
    if (el._obs) { el._obs.disconnect(); el._obs = null; }
    document.body.style.overflow = '';
};

/* ==========================================
   BAGIAN 18: KARYA CARD CLICKS (DELEGATION)
   ========================================== */
function initKaryaClicks() {
    var grid = document.getElementById('karyaGrid');
    if (!grid || grid._karyaDelegated) return;
    grid._karyaDelegated = true;
    grid.addEventListener('click', function (e) {
        var card = e.target.closest('.karya-clickable[data-kid]');
        if (card) { e.stopPropagation(); var kid = card.getAttribute('data-kid'); if (kid) openKaryaDetail(kid); }
    });
}

/* ==========================================
   BAGIAN 19: VIDEO HOVER (DELEGATION)
   ========================================== */
function initKaryaVideos() {
    var grid = document.getElementById('karyaGrid');
    if (!grid) return;
    if (grid._hoverHandler) { grid.removeEventListener('mouseenter', grid._hoverHandler, true); grid.removeEventListener('mouseleave', grid._leaveHandler, true); }
    grid._hoverHandler = function (e) {
        var card = e.target.closest('.kc');
        if (!card) return;
        var vid = card.querySelector('.karya-vid');
        var pi = card.querySelector('.karya-vid-play');
        if (!vid) return;
        vid.currentTime = 0; vid.play().catch(function () {});
        vid.classList.add('kv-playing');
        if (pi) pi.classList.add('kv-hidden');
    };
    grid._leaveHandler = function (e) {
        var card = e.target.closest('.kc');
        if (!card) return;
        var vid = card.querySelector('.karya-vid');
        var pi = card.querySelector('.karya-vid-play');
        if (!vid) return;
        vid.pause(); vid.classList.remove('kv-playing');
        if (pi) pi.classList.remove('kv-hidden');
    };
    grid.addEventListener('mouseenter', grid._hoverHandler, true);
    grid.addEventListener('mouseleave', grid._leaveHandler, true);
}

/* ==========================================
   BAGIAN 20: PLAYER TRACKER
   ========================================== */
var _playerRAF = null;
var _seeking = false;

function fmtTime(s) {
    if (isNaN(s) || !isFinite(s)) return '00:00';
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

function updatePlayerUI() {
    var vid = document.getElementById('karyaDetailVid');
    var fill = document.getElementById('kpbFill');
    var cur = document.getElementById('kpbCur');
    if (!vid || !fill || !cur) { _playerRAF = null; return; }
    if (vid.duration && isFinite(vid.duration) && !_seeking) {
        var pct = (vid.currentTime / vid.duration) * 100;
        fill.style.width = pct + '%';
        cur.textContent = fmtTime(vid.currentTime);
    }
    _playerRAF = requestAnimationFrame(updatePlayerUI);
}

function startPlayerTracker() {
    var vid = document.getElementById('karyaDetailVid');
    if (!vid) return;
    if (_playerRAF) { cancelAnimationFrame(_playerRAF); _playerRAF = null; }
    function updateDuration() {
        var durEl = document.getElementById('kpbDur');
        if (durEl && vid.duration && isFinite(vid.duration) && vid.duration > 0) durEl.textContent = fmtTime(vid.duration);
    }
    if (vid.readyState >= 1) updateDuration();
    vid.addEventListener('loadedmetadata', updateDuration, { once: true });
    var durCheck = setInterval(function () {
        if (vid.duration && isFinite(vid.duration) && vid.duration > 0) { updateDuration(); clearInterval(durCheck); }
    }, 200);
    setTimeout(function () { clearInterval(durCheck); }, 5000);
    _playerRAF = requestAnimationFrame(updatePlayerUI);
}

/* ==========================================
   BAGIAN 21: SEEK
   ========================================== */
function seekTo(e) {
    var track = document.getElementById('kpbTrack');
    var vid = document.getElementById('karyaDetailVid');
    if (!track || !vid || !vid.duration || !isFinite(vid.duration)) return;
    var rect = track.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    vid.currentTime = pct * vid.duration;
    var fill = document.getElementById('kpbFill');
    var cur = document.getElementById('kpbCur');
    if (fill) fill.style.width = (pct * 100) + '%';
    if (cur) cur.textContent = fmtTime(vid.currentTime);
}

window.startSeek = function (e) {
    _seeking = true; seekTo(e);
    function onMove(ev) { ev.preventDefault(); seekTo(ev); }
    function onUp() { _seeking = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp); }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
};

/* ==========================================
   BAGIAN 22: KEYBOARD
   ========================================== */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeKaryaDetail(); closeDetail(); }
});

/* ==========================================
   BAGIAN 23: CLEANUP
   ========================================== */
window.addEventListener('beforeunload', function () {
    if (_playerRAF) { cancelAnimationFrame(_playerRAF); _playerRAF = null; }
    if (_rainRAF) { cancelAnimationFrame(_rainRAF); _rainRAF = null; }
    if (revealObs) { revealObs.disconnect(); revealObs = null; }
    var overlays = document.querySelectorAll('.detail-overlay');
    for (var i = 0; i < overlays.length; i++) { if (overlays[i]._obs) { overlays[i]._obs.disconnect(); overlays[i]._obs = null; } }
    var videos = document.querySelectorAll('video');
    for (var j = 0; j < videos.length; j++) { videos[j].pause(); videos[j].removeAttribute('src'); }
});

/* ============================================================
   ==========  BAGIAN 24: ENHANCEMENT PASS (BARU)  =============
   ============================================================ */

/* ---------- 24a. Custom viewfinder cursor ---------- */
function initViewfinderCursor() {
    var isFinePointer = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (!isFinePointer) return; // jangan aktif di HP/tablet

    var cursor = document.getElementById('vfCursor');
    var labelEl = document.getElementById('vfLabel');
    if (!cursor) return;

    var mx = 0, my = 0, cx = 0, cy = 0;
    var active = false;

    function onMove(e) {
        mx = e.clientX; my = e.clientY;
        if (!active) {
            active = true;
            cursor.classList.add('active');
            document.body.classList.add('vf-active');
        }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', function () {
        active = false;
        cursor.classList.remove('active');
        document.body.classList.remove('vf-active');
    });
    document.addEventListener('mousedown', function () { cursor.classList.add('clicking'); });
    document.addEventListener('mouseup', function () { cursor.classList.remove('clicking'); });

    function raf() {
        // smooth follow (lerp)
        cx += (mx - cx) * 0.22;
        cy += (my - cy) * 0.22;
        cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Hover state pada elemen interaktif
    document.addEventListener('mouseover', function (e) {
        var t = e.target.closest('a, button, .karya-clickable, .tool-card, [data-cursor]');
        if (t) {
            cursor.classList.add('hovering');
            var lbl = t.getAttribute('data-cursor');
            if (labelEl) labelEl.textContent = lbl || 'Klik';
        }
    });
    document.addEventListener('mouseout', function (e) {
        var t = e.target.closest('a, button, .karya-clickable, .tool-card, [data-cursor]');
        if (t) {
            cursor.classList.remove('hovering');
        }
    });
}

/* ---------- 24b. Scroll timeline (progress bar) ---------- */
function initScrollTimeline() {
    var fill = document.getElementById('scrollTimelineFill');
    if (!fill) return;
    function update() {
        var page = document.querySelector('.page.on');
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var scrolled = window.scrollY || document.documentElement.scrollTop;
        var pct = h > 0 ? Math.min(100, Math.max(0, (scrolled / h) * 100)) : 0;
        fill.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

/* ---------- 24c. Page transition glitch flash ---------- */
function fireGlitchTransition() {
    var g = document.getElementById('pageGlitch');
    if (!g) return;
    g.classList.remove('fire');
    void g.offsetWidth;
    g.classList.add('fire');
    setTimeout(function () { g.classList.remove('fire'); }, 450);
}

/* ---------- 24d. Hero tilt (parallax mouse-move) ---------- */
function initHeroTilt() {
    var isFinePointer = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (!isFinePointer) return;
    var el = document.getElementById('heroTilt');
    if (!el || el._tiltInit) return;
    el._tiltInit = true;

    var section = document.querySelector('.hero-section');
    if (!section) return;

    section.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        var rx = Math.max(-1, Math.min(1, -dy)) * 6;
        var ry = Math.max(-1, Math.min(1, dx)) * 8;
        el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(0)';
    });
    section.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
}

/* ---------- 24e. Back to top ---------- */
function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    function update() {
        if ((window.scrollY || document.documentElement.scrollTop) > 500) btn.classList.add('show');
        else btn.classList.remove('show');
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
}

window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

console.log('>>> CEPEDIT ready (enhanced)');
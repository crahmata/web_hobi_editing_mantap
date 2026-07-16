/* ============================================
   CEPEDIT — script.js (MAXIMUM GLITCH EDITION)
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
        if (progress > statusIndex * 14 && statusIndex < statusMessages.length - 1) statusIndex++;
        typeStatus(statusMessages[statusIndex]);
        if (progress < 100) barFill.classList.add('active');
        else barFill.classList.remove('active');
        if (progress >= 100 && !done) {
            done = true;
            setTimeout(function() {
                typeStatus('SYSTEM READY.');
                setTimeout(finishLoading, 600);
            }, 400);
            return;
        }
        setTimeout(updateBar, 80 + Math.random() * 120);
    }

    function typeStatus(text) {
        statusEl.innerHTML = '';
        var i = 0;
        var interval = setInterval(function() {
            if (i < text.length) {
                statusEl.innerHTML = text.substring(0, i + 1) + '<span class="bk">\u258A</span>';
                i++;
            } else clearInterval(interval);
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
            initGlitchEffects();
            initDataRain();
        }, 500);
    }

    document.body.style.overflow = 'hidden';
    setTimeout(updateBar, 300);


    // ———————————————
    // DATA RAIN (Matrix-style falling chars)
    // ———————————————
    function initDataRain() {
        var canvas = document.getElementById('dataRain');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var cols, drops;
        var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cols = Math.floor(canvas.width / 14);
            drops = [];
            for (var i = 0; i < cols; i++) {
                drops[i] = Math.random() * -100;
            }
        }
        resize();
        window.addEventListener('resize', resize);

        function draw() {
            ctx.fillStyle = 'rgba(5, 5, 6, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '10px JetBrains Mono, monospace';

            for (var i = 0; i < cols; i++) {
                if (drops[i] > 0) {
                    var char = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
                    ctx.fillText(char, i * 14, drops[i] * 14);
                    if (drops[i] > 1) {
                        ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
                        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, (drops[i] - 1) * 14);
                    }
                }
                drops[i] += 0.3 + Math.random() * 0.3;
                if (drops[i] * 14 > canvas.height && Math.random() > 0.98) {
                    drops[i] = 0;
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }


    // ———————————————
    // GLITCH EFFECTS — MAXIMUM CHAOS
    // ———————————————

    // Variabel ini di luar biar bisa diakses combo glitch
    var glitchTextEl = null;
    var glitchRunning = false;
    var originalText = '';

    function initGlitchEffects() {
        var heroSection = document.querySelector('.hero-section');
        var marqueeSection = document.querySelector('.marquee-section');
        if (!heroSection) return;

        // A) TEXT GLOW PULSE on hover + scramble
        glitchTextEl = document.querySelector('.gh');
        if (glitchTextEl) {
            originalText = glitchTextEl.getAttribute('data-text') || glitchTextEl.textContent;
            var glitchChars = '0123456789!@#$%^&*';

            function scrambleText() {
                if (glitchRunning) return;
                glitchRunning = true;
                var iterations = 0;
                var maxIterations = originalText.length;
                var interval = setInterval(function() {
                    var result = '';
                    for (var i = 0; i < originalText.length; i++) {
                        if (originalText[i] === ' ') result += ' ';
                        else if (i < iterations) result += originalText[i];
                        else result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    }
                    glitchTextEl.childNodes[0].textContent = result;
                    iterations += 1 / 1.5;
                    if (iterations >= maxIterations) {
                        clearInterval(interval);
                        glitchTextEl.childNodes[0].textContent = originalText;
                        glitchRunning = false;
                    }
                }, 25);
            }

            glitchTextEl.addEventListener('mouseenter', scrambleText);

            // Auto scramble every 4-9 seconds
            function autoGlitch() {
                setTimeout(function() {
                    var beranda = document.getElementById('pg-beranda');
                    if (beranda && beranda.classList.contains('on')) scrambleText();
                    autoGlitch();
                }, 4000 + Math.random() * 5000);
            }
            autoGlitch();
        }


        // B) BURST glitch lines (2-5 at once!)
        function fireGlitchLineBurst() {
            var beranda = document.getElementById('pg-beranda');
            if (!beranda || !beranda.classList.contains('on')) {
                setTimeout(fireGlitchLineBurst, 4000);
                return;
            }

            var count = 2 + Math.floor(Math.random() * 4);
            for (var b = 0; b < count; b++) {
                (function(delay) {
                    setTimeout(function() {
                        var line = document.createElement('div');
                        line.className = 'gh-line';
                        line.style.top = (5 + Math.random() * 90) + '%';
                        line.style.height = (1 + Math.random() * 2) + 'px';
                        heroSection.appendChild(line);
                        requestAnimationFrame(function() { line.classList.add('fire'); });
                        setTimeout(function() { if (line.parentNode) line.parentNode.removeChild(line); }, 700);
                    }, delay);
                })(b * 50);
            }

            setTimeout(fireGlitchLineBurst, 2000 + Math.random() * 5000);
        }
        setTimeout(fireGlitchLineBurst, 3000);


        // C) Glitch overlay — more frequent
        var overlay = null;
        if (heroSection) {
            overlay = document.createElement('div');
            overlay.className = 'gh-overlay';
            heroSection.appendChild(overlay);

            function fireGlitchOverlay() {
                var beranda = document.getElementById('pg-beranda');
                if (!beranda || !beranda.classList.contains('on')) {
                    setTimeout(fireGlitchOverlay, 3000);
                    return;
                }
                overlay.classList.remove('fire');
                void overlay.offsetWidth;
                overlay.classList.add('fire');
                setTimeout(function() { overlay.classList.remove('fire'); }, 500);
                setTimeout(fireGlitchOverlay, 4000 + Math.random() * 8000);
            }
            setTimeout(fireGlitchOverlay, 4000);
        }


        // D) BLOCK CORRUPTION — random rectangles
        function fireBlockCorruption() {
            var beranda = document.getElementById('pg-beranda');
            if (!beranda || !beranda.classList.contains('on')) {
                setTimeout(fireBlockCorruption, 5000);
                return;
            }

            var count = 1 + Math.floor(Math.random() * 3);
            for (var b = 0; b < count; b++) {
                (function(delay) {
                    setTimeout(function() {
                        var block = document.createElement('div');
                        block.className = 'gh-block';
                        block.style.top = (Math.random() * 100) + '%';
                        block.style.left = (Math.random() * 30) + '%';
                        block.style.width = (20 + Math.random() * 60) + '%';
                        heroSection.appendChild(block);
                        requestAnimationFrame(function() { block.classList.add('fire'); });
                        setTimeout(function() { if (block.parentNode) block.parentNode.removeChild(block); }, 600);
                    }, delay);
                })(b * 30);
            }

            setTimeout(fireBlockCorruption, 5000 + Math.random() * 10000);
        }
        setTimeout(fireBlockCorruption, 5000);


        // E) SCREEN TEAR effect
        function fireScreenTear() {
            var beranda = document.getElementById('pg-beranda');
            if (!beranda || !beranda.classList.contains('on')) {
                setTimeout(fireScreenTear, 6000);
                return;
            }

            var tear = document.createElement('div');
            tear.className = 'gh-screen-tear';
            tear.style.background = 'linear-gradient(180deg,transparent 49%,rgba(16,185,129,.03) 49.5%,rgba(16,185,129,.03) 50.5%,transparent 51%)';
            heroSection.appendChild(tear);
            requestAnimationFrame(function() { tear.classList.add('fire'); });
            setTimeout(function() {
                tear.classList.remove('fire');
                if (tear.parentNode) tear.parentNode.removeChild(tear);
            }, 400);

            setTimeout(fireScreenTear, 7000 + Math.random() * 15000);
        }
        setTimeout(fireScreenTear, 8000);


        // F) ELECTRICAL ARC effect
        function fireElectrical() {
            var beranda = document.getElementById('pg-beranda');
            if (!beranda || !beranda.classList.contains('on')) {
                setTimeout(fireElectrical, 8000);
                return;
            }

            var arc = document.createElement('div');
            arc.className = 'gh-electrical';
            arc.style.top = (Math.random() * 80) + '%';
            heroSection.appendChild(arc);
            requestAnimationFrame(function() { arc.classList.add('fire'); });
            setTimeout(function() {
                arc.classList.remove('fire');
                if (arc.parentNode) arc.parentNode.removeChild(arc);
            }, 500);

            setTimeout(fireElectrical, 10000 + Math.random() * 20000);
        }
        setTimeout(fireElectrical, 12000);


        // G) STATIC NOISE BURST
        var staticEl = document.querySelector('.gh-static');
        function fireStaticBurst() {
            if (!staticEl) return;
            var beranda = document.getElementById('pg-beranda');
            if (!beranda || !beranda.classList.contains('on')) {
                setTimeout(fireStaticBurst, 6000);
                return;
            }
            staticEl.classList.add('fire');
            setTimeout(function() { staticEl.classList.remove('fire'); }, 200);
            setTimeout(fireStaticBurst, 8000 + Math.random() * 15000);
        }
        setTimeout(fireStaticBurst, 10000);


        // H) BORDER FLASH on random elements
        function fireBorderFlash() {
            var beranda = document.getElementById('pg-beranda');
            if (!beranda || !beranda.classList.contains('on')) {
                setTimeout(fireBorderFlash, 4000);
                return;
            }

            var targets = beranda.querySelectorAll('.gh-border-flash');
            if (targets.length === 0) {
                setTimeout(fireBorderFlash, 4000);
                return;
            }

            var target = targets[Math.floor(Math.random() * targets.length)];
            target.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            setTimeout(function() {
                target.style.borderColor = 'rgba(6, 182, 212, 0.25)';
            }, 80);
            setTimeout(function() {
                target.style.borderColor = '';
            }, 200);

            setTimeout(fireBorderFlash, 1500 + Math.random() * 3000);
        }
        setTimeout(fireBorderFlash, 3000);


        // I) MARQUEE GLITCH
        if (marqueeSection) {
            var marqueeGlitch = marqueeSection.querySelector('.marquee-glitch-line');
            function fireMarqueeGlitch() {
                if (!marqueeGlitch) return;
                marqueeGlitch.classList.add('fire');
                setTimeout(function() { marqueeGlitch.classList.remove('fire'); }, 300);
                setTimeout(fireMarqueeGlitch, 6000 + Math.random() * 12000);
            }
            setTimeout(fireMarqueeGlitch, 5000);
        }


        // J) COMBO GLITCH — everything at once!
        function fireComboGlitch() {
            var beranda = document.getElementById('pg-beranda');
            if (!beranda || !beranda.classList.contains('on')) {
                setTimeout(fireComboGlitch, 15000);
                return;
            }

            fireGlitchLineBurst();
            if (overlay) {
                overlay.classList.remove('fire');
                void overlay.offsetWidth;
                overlay.classList.add('fire');
                setTimeout(function() { overlay.classList.remove('fire'); }, 500);
            }
            fireBlockCorruption();
            if (staticEl) {
                staticEl.classList.add('fire');
                setTimeout(function() { staticEl.classList.remove('fire'); }, 250);
            }
            if (glitchTextEl && !glitchRunning) scrambleText();

            setTimeout(fireComboGlitch, 15000 + Math.random() * 20000);
        }
        setTimeout(fireComboGlitch, 15000);
    }


    // ———————————————
    // HOBI PAGE — GLITCH DEEP DIVE EFFECTS
    // ———————————————
    function initHobiEffects() {
        var hobiCards = document.querySelectorAll('.hobi-card');
        var corruptedDeco = document.querySelector('.hobi-corrupted-deco span');
        var corruptTicker = document.querySelector('.hobi-corrupt-ticker');

        // A) Corrupted ticker — randomize text periodically
        if (corruptTicker) {
            var corruptTexts = [
                'DEEP_DIVE_COMPLETE // DATA_INTEGRITY: 97.3% // SIGNAL_LOSS: MINIMAL',
                '0x4F2A // FRAME_BUFFER_OVERFLOW // RECOVERING...',
                'SYNC_RATE: 99.7% // PACKET_LOSS: 0.3% // NOMINAL',
                'LAYER_04:DECODED // NARRATIVE_COHERENCE: HIGH',
                'TEMPORAL_DRIFT: 0.002ms // CHRONO_SYNC: LOCKED',
                'MEMORY_LEAK_DETECTED // GARBAGE_COLLECT: RUNNING...',
                'NEURAL_PATHWAY: STABLE // CREATIVITY_INDEX: 98.7%',
                'DATA_STREAM::ACTIVE // INTEGRITY::VERIFIED'
            ];

            function tickCorruptText() {
                var hobi = document.getElementById('pg-hobi');
                if (!hobi || !hobi.classList.contains('on')) {
                    setTimeout(tickCorruptText, 3000);
                    return;
                }
                var newText = corruptTexts[Math.floor(Math.random() * corruptTexts.length)];
                corruptTicker.style.opacity = '0';
                setTimeout(function() {
                    corruptTicker.textContent = newText;
                    corruptTicker.style.opacity = '1';
                }, 150);
                setTimeout(tickCorruptText, 3000 + Math.random() * 4000);
            }
            setTimeout(tickCorruptText, 2000);
        }

        // B) Corrupted decoration — random text flash
        if (corruptedDeco) {
            var decoTexts = [
                'SYS::DEEP_DIVE // LAYER_01 // ACTIVE',
                'SYS::DEEP_DIVE // LAYER_02 // PARSING',
                'SYS::DEEP_DIVE // LAYER_01 // COMPLETE',
                'ERR::0x004F // BUFFER_OVERFLOW',
                'SYS::DEEP_DIVE // INTEGRITY: 99.1%',
                'WARN::SIGNAL_DEGRADATION // 0.02dB'
            ];

            function flashDecoText() {
                var hobi = document.getElementById('pg-hobi');
                if (!hobi || !hobi.classList.contains('on')) {
                    setTimeout(flashDecoText, 4000);
                    return;
                }
                corruptedDeco.style.color = 'rgba(239, 68, 68, 0.3)';
                corruptedDeco.textContent = decoTexts[Math.floor(Math.random() * decoTexts.length)];
                setTimeout(function() {
                    corruptedDeco.style.color = 'rgba(16, 185, 129, 0.15)';
                }, 200);
                setTimeout(flashDecoText, 5000 + Math.random() * 8000);
            }
            setTimeout(flashDecoText, 5000);
        }

        // C) Image glitch on scroll — random chromatic shift
        var hobiImgObserver = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var card = entries[i].target;
                    var img = card.querySelector('.hobi-img-glitch img');
                    if (img && Math.random() < 0.3) {
                        img.style.filter = 'hue-rotate(' + (Math.random() * 30 - 15) + 'deg) saturate(1.3)';
                        setTimeout(function() { img.style.filter = ''; }, 300);
                    }
                }
            }
        }, { threshold: 0.5 });

        for (var i = 0; i < hobiCards.length; i++) {
            hobiImgObserver.observe(hobiCards[i]);
        }

        // D) Occasional screen-wide glitch on hobi page
        function fireHobiGlitchBurst() {
            var hobi = document.getElementById('pg-hobi');
            if (!hobi || !hobi.classList.contains('on')) {
                setTimeout(fireHobiGlitchBurst, 8000);
                return;
            }

            var line = document.createElement('div');
            line.style.cssText = 'position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(16,185,129,.2),rgba(6,182,212,.1),transparent);pointer-events:none;z-index:5;opacity:0;';
            line.style.top = (10 + Math.random() * 80) + '%';
            hobi.appendChild(line);
            requestAnimationFrame(function() {
                line.style.opacity = '1';
                line.style.transition = 'opacity .3s';
            });
            setTimeout(function() {
                line.style.opacity = '0';
                setTimeout(function() { if (line.parentNode) line.parentNode.removeChild(line); }, 400);
            }, 200);

            if (Math.random() > 0.5) {
                setTimeout(function() {
                    var line2 = document.createElement('div');
                    line2.style.cssText = 'position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(239,68,68,.1),transparent);pointer-events:none;z-index:5;opacity:0;';
                    line2.style.top = (parseFloat(line.style.top) + 2 + Math.random() * 3) + '%';
                    hobi.appendChild(line2);
                    requestAnimationFrame(function() {
                        line2.style.opacity = '1';
                        line2.style.transition = 'opacity .2s';
                    });
                    setTimeout(function() {
                        line2.style.opacity = '0';
                        setTimeout(function() { if (line2.parentNode) line2.parentNode.removeChild(line2); }, 300);
                    }, 150);
                }, 100);
            }

            setTimeout(fireHobiGlitchBurst, 6000 + Math.random() * 12000);
        }
        setTimeout(fireHobiGlitchBurst, 8000);

        // E) Trigger hobi effects when page becomes active
        var origGo = window.go;
        window.go = function(page) {
            origGo(page);
            if (page === 'hobi') {
                setTimeout(function() {
                    initHobiEffects();
                }, 500);
            }
        };
    }

    // Call hobi init after page load too
    setTimeout(function() {
        initHobiEffects();
    }, 2000);


    // ———————————————
    // TOAST
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
    // SPA NAVIGATION
    // ———————————————
    window.go = function(page) {
        var pages = document.querySelectorAll('.page');
        for (var i = 0; i < pages.length; i++) pages[i].classList.remove('on');
        var target = document.getElementById('pg-' + page);
        if (target) target.classList.add('on');
        var navLinks = document.querySelectorAll('.nv');
        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove('act');
            if (navLinks[j].getAttribute('data-p') === page) navLinks[j].classList.add('act');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(function() { initFadeUp(); initReveal(); }, 80);
    };
    var firstNav = document.querySelector('.nv[data-p="beranda"]');
    if (firstNav) firstNav.classList.add('act');


    // ———————————————
    // TOOLS FILTER
    // ———————————————
    window.filtT = function(cat, btn) {
        var tabs = document.querySelectorAll('.tab');
        for (var i = 0; i < tabs.length; i++) { tabs[i].classList.remove('on'); tabs[i].classList.add('text-slate-500'); }
        btn.classList.add('on'); btn.classList.remove('text-slate-500');
        var cards = document.querySelectorAll('.tc');
        for (var j = 0; j < cards.length; j++) {
            var tags = cards[j].getAttribute('data-t') || '';
            if (cat === 'all' || tags.indexOf(cat) !== -1) {
                cards[j].style.display = '';
                cards[j].style.opacity = '0';
                cards[j].style.transform = 'translateY(15px)';
                (function(card) {
                    setTimeout(function() { card.style.transition = 'all 0.35s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 30);
                })(cards[j]);
            } else { cards[j].style.display = 'none'; }
        }
    };


    // ———————————————
    // FADE UP
    // ———————————————
    function initFadeUp() {
        var els = document.querySelectorAll('.fu');
        for (var i = 0; i < els.length; i++) els[i].classList.remove('sh');
        var activePage = document.querySelector('.page.on');
        if (!activePage) return;
        var pageEls = activePage.querySelectorAll('.fu');
        for (var j = 0; j < pageEls.length; j++) pageEls[j].classList.add('sh');
    }


    // ———————————————
    // SCROLL REVEAL
    // ———————————————
    var revealObserver = null;
    function initReveal() {
        if (revealObserver) revealObserver.disconnect();
        revealObserver = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) entries[i].target.classList.add('sh');
            }
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        var els = document.querySelectorAll('.rv');
        for (var i = 0; i < els.length; i++) {
            var rect = els[i].getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) els[i].classList.remove('sh');
            revealObserver.observe(els[i]);
        }
    }


    // ———————————————
    // COUNTER (c1-c3)
    // ———————————————
    function countUp(id, target, suffix) {
        suffix = suffix || '%';
        var el = document.getElementById(id);
        if (!el) return;
        var startTime = performance.now();
        function tick(now) {
            var p = Math.min((now - startTime) / 2000, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 4)) * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    var counterObs = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) { countUp('c1', 98); countUp('c2', 95); countUp('c3', 93); counterObs.disconnect(); }
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
        function tick(now) {
            var p = Math.min((now - startTime) / 2200, 1);
            if (p >= 1) { el.textContent = target + suffix; el.classList.add('done'); return; }
            if (Math.random() < 1 - p) {
                var text = String(target), result = '';
                for (var i = 0; i < text.length; i++) result += Math.random() < (1 - p) * 0.6 ? chars[Math.floor(Math.random() * chars.length)] : text[i];
                el.textContent = result;
            } else el.textContent = Math.floor(target * p);
            requestAnimationFrame(ttick);
        }
        requestAnimationFrame(tick);
    }
    var glitchObs = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) { glitchCount('c4', 247, '+'); glitchCount('c5', 53, '+'); glitchCount('c6', 189, '+'); glitchCount('c7', 412, '+'); glitchObs.disconnect(); }
        }
    }, { threshold: 0.5 });
    var c4el = document.getElementById('c4');
    if (c4el) glitchObs.observe(c4el);


    // ———————————————
    // NEWSLETTER
    // ———————————————
    window.subEm = function() {
        var val = document.getElementById('emIn').value.trim();
        if (!val || val.indexOf('@') === -1) { toast('Email nggak valid!'); return; }
        toast('Berlangganan berhasil! \uD83C\uDFAC');
        document.getElementById('emIn').value = '';
    };

})();
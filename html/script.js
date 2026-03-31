(function () {
    "use strict";

    let audio = null;
    let isPlaying = false;
    let isMuted = false;
    let currentTrack = 0;
    let currentSlide = 0;
    let slideshowTimer = null;

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const elSlideshow     = $("#slideshow");
    const elOverlay       = $(".overlay");
    const elLogo          = $("#logo");
    const elServerName    = $("#serverName");
    const elServerTagline = $("#serverTagline");
    const elWelcomeText   = $("#welcomeText");
    const elSocials       = $("#socials");
    const elLoadingArea   = $("#loadingArea");
    const elLoadingBar    = $("#loadingProgress");
    const elLoadingText   = $("#loadingText");
    const elMusicTitle    = $("#musicTitle");
    const elMusicHub      = $("#musicHub");
    const elMusicEq       = $("#musicEq");
    const btnPlayPause    = $("#btnPlayPause");
    const btnPrev         = $("#btnPrev");
    const btnNext         = $("#btnNext");
    const btnVolume       = $("#btnVolume");
    const iconPlay        = $("#iconPlay");
    const iconPause       = $("#iconPause");
    const iconVolOn       = $("#iconVolumeOn");
    const iconVolOff      = $("#iconVolumeOff");

    function init() {
        applyTheme();
        populateServerInfo();
        populateSocials();
        setupSlideshow();
        setupLoadingBar();
        setupMusicControls();
        initAudio();
    }

    function applyTheme() {
        const root = document.documentElement;
        const c = CONFIG;

        root.style.setProperty("--accent-h", c.accentHue);
        root.style.setProperty("--accent-s", c.accentSaturation + "%");
        root.style.setProperty("--accent-l", c.accentLightness + "%");

        if (c.headingFont) root.style.setProperty("--ff-heading", c.headingFont);
        if (c.bodyFont) root.style.setProperty("--ff-body", c.bodyFont);
        if (c.screenPadding) root.style.setProperty("--pad-screen", c.screenPadding);

        if (c.overlayOpacity !== undefined || c.overlayColor) {
            const color = c.overlayColor || "10, 10, 12";
            const op = c.overlayOpacity !== undefined ? c.overlayOpacity : 0.7;
            elOverlay.style.background = `
                linear-gradient(
                    to top,
                    rgba(${color} / ${Math.min(op + 0.22, 1)}) 0%,
                    rgba(${color} / ${Math.max(op - 0.10, 0)}) 30%,
                    rgba(${color} / ${Math.max(op - 0.40, 0)}) 55%,
                    rgba(${color} / ${Math.max(op - 0.25, 0)}) 80%,
                    rgba(${color} / ${op}) 100%
                ),
                radial-gradient(
                    ellipse at center,
                    transparent 50%,
                    rgba(${color} / ${Math.max(op - 0.15, 0)}) 100%
                )
            `;
        }

        if (!c.enableAnimations) {
            root.style.setProperty("--anim-dur", "0s");
            root.style.setProperty("--anim-delay", "0s");
            $$("[style*='animation'], .top-bar, .center-content, .bottom-bar, .loading-area, .music-hub").forEach(el => {
                el.style.animation = "none";
            });
        } else {
            const dur = c.fadeInDuration !== undefined ? c.fadeInDuration : 0.9;
            const delay = c.fadeInDelay !== undefined ? c.fadeInDelay : 0.3;
            $(".top-bar").style.animationDuration = dur + "s";
            $(".top-bar").style.animationDelay = delay + "s";
            $(".center-content").style.animationDuration = (dur + 0.5) + "s";
            $(".center-content").style.animationDelay = (delay + 0.3) + "s";
            $(".bottom-bar").style.animationDuration = dur + "s";
            $(".bottom-bar").style.animationDelay = (delay + 0.2) + "s";
            elLoadingArea.style.animationDuration = dur + "s";
            elLoadingArea.style.animationDelay = (delay + 0.2) + "s";
            elMusicHub.style.animationDuration = dur + "s";
            elMusicHub.style.animationDelay = (delay + 0.2) + "s";
        }

        if (!c.kenBurnsEffect) {
            root.style.setProperty("--kb-none", "1");
        }
    }

    function populateServerInfo() {
        const c = CONFIG;

        if (c.showServerName === false) {
            elServerName.style.display = "none";
        } else {
            elServerName.textContent = c.serverName || "";
            if (c.serverNameSize) elServerName.style.fontSize = c.serverNameSize;
        }

        if (c.showTagline === false) {
            elServerTagline.style.display = "none";
        } else {
            elServerTagline.textContent = c.serverTagline || "";
            if (c.taglineSize) elServerTagline.style.fontSize = c.taglineSize;
        }

        if (c.showWelcomeText === false) {
            elWelcomeText.style.display = "none";
        } else {
            elWelcomeText.textContent = c.welcomeText || "";
            if (c.welcomeTextSize) elWelcomeText.style.fontSize = c.welcomeTextSize;
            if (c.welcomeTextMaxWidth) elWelcomeText.style.maxWidth = c.welcomeTextMaxWidth + "px";
        }

        if (c.logo) {
            elLogo.src = c.logo;
            if (c.logoSize) {
                elLogo.style.width = c.logoSize + "px";
                elLogo.style.height = c.logoSize + "px";
            }
            elLogo.onerror = () => { elLogo.style.display = "none"; };
        } else {
            elLogo.style.display = "none";
        }
    }

    function populateSocials() {
        if (CONFIG.showSocials === false || !CONFIG.socials) {
            elSocials.style.display = "none";
            return;
        }

        const icons = {
            discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>`,
            store: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
            website: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
            twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
            tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0115.54 3h-3.09v12.4a2.592 2.592 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.3 1.38V7.3s-1.88.09-3.24-1.48z"/></svg>`,
            youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#0a0a0c" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
            instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
        };

        const labelMap = {
            discord: "Discord",
            store: "Store",
            website: "Web",
            twitter: "Twitter",
            tiktok: "TikTok",
            youtube: "YouTube",
            instagram: "Instagram",
        };

        Object.entries(CONFIG.socials).forEach(([key, url]) => {
            if (!url) return;
            const a = document.createElement("a");
            a.className = "social-link";
            a.href = "#";
            const label = CONFIG.showSocialLabels !== false ? `<span>${labelMap[key] || key}</span>` : "";
            a.innerHTML = (icons[key] || "") + label;
            a.addEventListener("click", (e) => {
                e.preventDefault();
                if (window.invokeNative) {
                    window.invokeNative("openUrl", url);
                } else {
                    window.open(url, "_blank");
                }
            });
            elSocials.appendChild(a);
        });
    }

    function setupSlideshow() {
        const bgs = CONFIG.backgrounds || [];
        if (!bgs.length) return;

        bgs.forEach((src, i) => {
            const img = document.createElement("img");
            img.className = "slideshow__img";
            img.src = src;
            img.alt = "";
            img.draggable = false;
            if (CONFIG.kenBurnsEffect !== false) {
                img.dataset.kb = ((i % 4) + 1).toString();
            }
            if (i === 0) img.classList.add("active");
            elSlideshow.appendChild(img);
        });

        if (bgs.length < 2) return;

        const imgs = $$(".slideshow__img");
        const transition = CONFIG.slideshowTransition || 1800;

        imgs.forEach((img) => {
            img.style.transitionDuration = transition + "ms";
        });

        slideshowTimer = setInterval(() => {
            const prev = imgs[currentSlide];
            currentSlide = (currentSlide + 1) % imgs.length;
            const next = imgs[currentSlide];

            if (CONFIG.kenBurnsEffect !== false) {
                next.style.animation = "none";
                void next.offsetHeight;
                next.style.animation = "";
                next.dataset.kb = (((currentSlide % 4) + 1)).toString();
            }

            prev.classList.remove("active");
            next.classList.add("active");
        }, CONFIG.slideshowInterval || 8000);
    }

    function setupLoadingBar() {
        if (!CONFIG.showLoadingBar) {
            elLoadingArea.style.display = "none";
            return;
        }

        elLoadingText.textContent = CONFIG.loadingText || "Loading…";

        if (CONFIG.loadingBarWidth) {
            elLoadingArea.style.width = CONFIG.loadingBarWidth + "px";
        }
        if (CONFIG.loadingBarHeight) {
            $(".loading-bar").style.height = CONFIG.loadingBarHeight + "px";
        }

        let targetProgress = 0;
        let displayProgress = 0;
        let animating = false;
        const smoothing = CONFIG.loadingBarSmoothing || 0.08;
        const completeText = CONFIG.loadingCompleteText || "Ready";

        function animateBar() {
            if (!animating) return;

            const diff = targetProgress - displayProgress;
            if (diff > 0.1) {
                displayProgress += diff * smoothing;
            } else {
                displayProgress = targetProgress;
            }

            elLoadingBar.style.width = displayProgress + "%";

            if (displayProgress >= 99.9) {
                displayProgress = 100;
                elLoadingBar.style.width = "100%";
                elLoadingText.textContent = completeText;
                animating = false;
                return;
            }

            requestAnimationFrame(animateBar);
        }

        function setTarget(pct) {
            if (pct <= targetProgress) return;
            targetProgress = pct;

            if (!animating) {
                animating = true;
                requestAnimationFrame(animateBar);
            }
        }

        window.addEventListener("message", (e) => {
            if (!e.data) return;

            if (e.data.eventName === "loadProgress" && typeof e.data.loadFraction === "number") {
                setTarget(e.data.loadFraction * 100);
                return;
            }

            const milestones = {
                INIT_CORE_STARTED:       5,
                INIT_BEFORE_MAP_LOADED:  20,
                MAP_LOADED:              40,
                INIT_AFTER_MAP_LOADED:   60,
                INIT_SESSION:            80,
                LOADING_SCREEN:          90,
                LOADING_SCREEN_COMPLETE: 100,
            };

            if (e.data.eventName && milestones[e.data.eventName] !== undefined) {
                setTarget(milestones[e.data.eventName]);
            }
        });
    }

    function initAudio() {
        if (CONFIG.showMusicPlayer === false) {
            elMusicHub.style.display = "none";
            return;
        }

        const playlist = CONFIG.musicPlaylist;
        if (!playlist || !playlist.length) {
            elMusicHub.style.display = "none";
            return;
        }

        if (CONFIG.musicShuffle) shufflePlaylist();
        audio = new Audio();
        audio.preload = "auto";
        audio.volume = (CONFIG.musicVolume || 30) / 100;

        audio.addEventListener("ended", () => nextTrack());
        audio.addEventListener("playing", () => setPlayingState(true));
        audio.addEventListener("pause", () => setPlayingState(false));

        audio.addEventListener("error", () => {
            errorCount++;
            if (errorCount >= playlist.length) {
                elMusicTitle.textContent = "Unavailable";
                setPlayingState(false);
                return;
            }
            setTimeout(() => nextTrack(), 2000);
        });

        if (CONFIG.musicAutoPlay) {
            loadAndPlay(currentTrack);
        } else {
            updateTitle();
        }
    }

    let errorCount = 0;

    function loadAndPlay(index) {
        const track = CONFIG.musicPlaylist[index];
        if (!track || !track.src) return;

        currentTrack = index;
        updateTitle();

        audio.src = track.src;
        audio.volume = isMuted ? 0 : (CONFIG.musicVolume || 30) / 100;

        const p = audio.play();
        if (p && p.catch) {
            p.catch(() => {
                const retry = () => {
                    audio.play().catch(() => {});
                    document.removeEventListener("click", retry);
                };
                document.addEventListener("click", retry, { once: true });
            });
        }
    }

    function updateTitle() {
        const track = CONFIG.musicPlaylist[currentTrack];
        elMusicTitle.textContent = track ? track.title : "—";
    }

    function setPlayingState(playing) {
        isPlaying = playing;
        iconPlay.style.display  = playing ? "none" : "block";
        iconPause.style.display = playing ? "block" : "none";
        elMusicEq.classList.toggle("paused", !playing);
    }

    function togglePlayPause() {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else if (audio.src) {
            audio.play().catch(() => {});
        } else {
            loadAndPlay(currentTrack);
        }
    }

    function nextTrack() {
        if (!CONFIG.musicPlaylist.length) return;
        currentTrack = (currentTrack + 1) % CONFIG.musicPlaylist.length;
        loadAndPlay(currentTrack);
    }

    function prevTrack() {
        if (!CONFIG.musicPlaylist.length) return;
        currentTrack = (currentTrack - 1 + CONFIG.musicPlaylist.length) % CONFIG.musicPlaylist.length;
        loadAndPlay(currentTrack);
    }

    function toggleMute() {
        if (!audio) return;
        isMuted = !isMuted;
        audio.volume = isMuted ? 0 : (CONFIG.musicVolume || 30) / 100;
        iconVolOn.style.display  = isMuted ? "none" : "block";
        iconVolOff.style.display = isMuted ? "block" : "none";
    }

    function shufflePlaylist() {
        const pl = CONFIG.musicPlaylist;
        for (let i = pl.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pl[i], pl[j]] = [pl[j], pl[i]];
        }
    }

    function setupMusicControls() {
        btnPlayPause.addEventListener("click", togglePlayPause);
        btnNext.addEventListener("click", nextTrack);
        btnPrev.addEventListener("click", prevTrack);
        btnVolume.addEventListener("click", toggleMute);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

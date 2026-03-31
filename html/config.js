const CONFIG = {

    // Server identity
    serverName: "HYPER",
    serverTagline: "ROLEPLAY",
    welcomeText: "Welcome to the city. Your story begins now.",

    // Logo (place in html/assets/img/logo.png, set to "" to hide)
    logo: "",
    logoSize: 46,

    // Background slideshow (place images in html/assets/img/)
    backgrounds: [
        "assets/img/bg1.jpg",
        "assets/img/bg2.jpg",
        "assets/img/bg3.jpg",
        "assets/img/bg4.jpg",
    ],
    slideshowInterval: 8000,
    slideshowTransition: 1800,
    kenBurnsEffect: true,

    // Overlay
    overlayOpacity: 0.7,
    overlayColor: "10, 10, 12",

    // Music playlist (place files in html/assets/music/)
    musicPlaylist: [
        { title: "Believe In Yourself", src: "assets/music/believe-in-yourself.mp3" },
        { title: "Wide Awake", src: "assets/music/wide-awake.mp3" },
        // { title: "Lo-Fi Beat", src: "assets/music/lofi-beat.mp3" },
        // { title: "Ambient", src: "assets/music/ambient.ogg" },
    ],
    musicVolume: 30,
    musicAutoPlay: true,
    musicShuffle: false,
    showMusicPlayer: true,

    // Social links (set to "" to hide)
    socials: {
        discord: "https://discord.gg/yourserver",
        store: "https://yourstore.tebex.io",
        website: "https://yourserver.com",
        // twitter: "",
        // tiktok: "",
        // youtube: "",
        // instagram: "",
    },
    showSocialLabels: true,

    // Loading bar
    showLoadingBar: true,
    loadingText: "Loading assets…",
    loadingCompleteText: "Ready",
    loadingBarWidth: 280,
    loadingBarHeight: 2,
    loadingBarSmoothing: 0.08,

    // Typography
    headingFont: "'Outfit', sans-serif",
    bodyFont: "'Inter', sans-serif",
    serverNameSize: "clamp(22px, 2vw, 32px)",
    taglineSize: "clamp(11px, .9vw, 15px)",
    welcomeTextSize: "clamp(15px, 1.2vw, 20px)",
    welcomeTextMaxWidth: 500,

    // Accent color (HSL)
    accentHue: 220,
    accentSaturation: 15,
    accentLightness: 55,

    // Layout
    screenPadding: "clamp(28px, 3vw, 56px)",

    // Visibility toggles
    showServerName: true,
    showTagline: true,
    showWelcomeText: true,
    showSocials: true,

    // Animations
    enableAnimations: true,
    fadeInDuration: 0.9,
    fadeInDelay: 0.3,
};

# Hyper-Loading

Simple loading screen for FiveM. Made by **Hyper1450**. Licensed under MIT.

## Setup

1. Drop `hyper-loading` into your `resources` folder.
2. Add to `server.cfg`:
```
ensure hyper-loading
setr sv_showBusySpinnerOnLoadingScreen false
```
3. Restart your server.

## Config

Edit `html/config.js` — everything is in there.

- **Backgrounds** → `bg1.jpg` is included as a placeholder. You need to add your own `bg2.jpg`, `bg3.jpg`, `bg4.jpg` (or whatever you want) into `html/assets/img/` and update the `backgrounds` array in config
- **Music** → put audio in `html/assets/music/`, add to `musicPlaylist`
- **Socials** → fill in your URLs, set to `""` to hide. Supports: discord, store, website, twitter, tiktok, youtube, instagram
- **Logo** → put your logo in `html/assets/img/`, set the `logo` path
- **Accent color** → change `accentHue` (0–360), `accentSaturation`, `accentLightness`
- **Visibility** → toggle any element on/off: `showServerName`, `showTagline`, `showWelcomeText`, `showSocials`, `showLoadingBar`, `showMusicPlayer`
- **Overlay** → adjust `overlayOpacity` (0–1) and `overlayColor`
- **Fonts** → change `headingFont` and `bodyFont`
- **Animations** → `enableAnimations`, `fadeInDuration`, `fadeInDelay`

Recommended image size: **1920×1080 JPG**, ~300KB each.

## Files

```
hyper-loading/
├── client.lua
├── fxmanifest.lua
└── html/
    ├── config.js       ← edit this
    ├── index.html
    ├── style.css
    ├── script.js
    └── assets/
        ├── img/        ← backgrounds & logo
        └── music/      ← music files
```

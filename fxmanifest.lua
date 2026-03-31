-- Hyper-Loading v1.0.0

fx_version 'cerulean'
game 'gta5'

name 'hyper-loading'
description 'Premium Loading Screen'
author 'Hyper1450'
version '1.0.0'

loadscreen 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/config.js',
    'html/assets/img/*.jpg',
    'html/assets/img/*.png',
    'html/assets/img/*.webp',
    'html/assets/fonts/*.woff2',
    'html/assets/music/*.mp3',
    'html/assets/music/*.ogg',
    'html/assets/music/*.wav',
}

loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

client_script 'client.lua'


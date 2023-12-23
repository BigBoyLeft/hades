fx_version "cerulean"
game "gta5"
author "Left"
description "A simple framework for FiveM"
version "1.0.0"

server_script "server/index.js"
client_script "client/index.js"

ui_page "ui/index.html"

files {
    "ui/**/*"
}

dependencies {
    "/onesync"
}
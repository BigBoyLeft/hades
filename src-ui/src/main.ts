import { type App as ViteApp, createApp } from 'vue';
import App from './App.vue';

const MOUNT_DIV_ID = '#app';

let app: ViteApp<Element>;

function mount() {
    app = createApp(App);
    app.mount(MOUNT_DIV_ID);
}

mount();

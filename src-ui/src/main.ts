import { type App as ViteApp, createApp } from 'vue';
import App from './App.vue';
// @ts-ignore
import { VUE_PLUGIN_IMPORTS } from './imports/plugins.ts';

const MOUNT_DIV_ID = '#app';

let app: ViteApp<Element>;

function mount() {
    app = createApp(App);
    for (const plugin of VUE_PLUGIN_IMPORTS) {
        app.use(plugin);
    }
    app.mount(MOUNT_DIV_ID);
}

mount();

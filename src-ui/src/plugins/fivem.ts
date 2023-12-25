import { App } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $fivem: {
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}

export default {
  install: (app: App, options?: any) => {
    app.config.globalProperties.$fivem = {
      on: (event: string, callback: (data: any) => void) => {
        window.addEventListener('message', (e: MessageEvent) => {
          if (e.data.event === event) {
            callback(e.data.data);
          }
        });
      },
    };
  },
};
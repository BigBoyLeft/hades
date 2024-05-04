export class Events {
    static on(event: string, callback: Function, net?: boolean) {
        const eventFn = net ? onNet : on;

        eventFn(event, (...args: any[]) => {
            callback(...args);
        });
    }

    static once(event: string, callback: Function, net?: boolean) {
        const wrappedCallback = (...args: any[]) => {
            callback(...args);
            this.off(event, wrappedCallback);
        };

        this.on(event, wrappedCallback, net);
    }

    static off(eventName: string, callback: Function) {
        removeEventListener(eventName, callback);
    }

    static emit(event: string, net?: boolean, ...args: any[]) {
        const emitFn = net ? emitNet : emit;

        emitFn(event, ...args);
    }
}

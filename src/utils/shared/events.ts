export class Events {
    static readonly events: { [key: string]: Array<Function> } = {};

    static on(event: string, callback: Function, net?: boolean) {
        const eventFn = net ? onNet : on;

        if (!this.events[event]) {
            this.events[event] = [];

            eventFn(event, (...args: any[]) => {
                const callbacks = this.events[event];
                if (!callbacks) return console.log('no callbacks');
                callbacks.forEach((cb: Function) => cb(...args));
            });
        }

        this.events[event].push(callback);
    }

    static once(event: string, callback: Function, net?: boolean) {
        const wrappedCallback = (...args: any[]) => {
            callback(...args);
            this.off(event, wrappedCallback);
        };

        this.on(event, wrappedCallback, net);
    }

    static off(event: string, callback: Function) {
        if (this.events[event]) {
            const index = this.events[event].indexOf(callback);
            if (index !== -1) {
                this.events[event].splice(index, 1);
                if (this.events[event].length === 0) {
                    delete this.events[event];
                }
            }
        }
    }

    static emit(event: string, net?: boolean, ...args: any[]) {
        const emitFn = net ? emitNet : emit;

        emitFn(event, ...args);
    }
}

const onEvent = (net: boolean): Function => (net ? onNet : on);

// Wrapper around fivem's event system onNet and on functions
// fivem doesn't allow for multiple listeners on the same event or a remove api
// we need to use onNet and on functions to register events
// you can use the removeEventListener to remove the event handler
// if an event is not already registered it needs to be registered and the callback func will just trigger the events function or functions
class Events {
    static readonly events: { [key: string]: Array<Function> } = {};

    static on(event: string, callback: Function, net?: boolean) {
        const eventFunction = net ? onNet : on;
        if (!this.events[event]) {
            this.events[event] = [];
            eventFunction(event, (...args: any[]) => {
                const callbacks = this.events[event];
                if (!callbacks) return console.log('no callbacks');
                this.events[event]?.forEach((cb: Function) => cb(...args));
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

    static emit(event: string, ...args: any[]) {
        if (this.events[event]) {
            this.events[event].forEach((callback: Function) => callback(...args));
        }
    }
}

export default Events;

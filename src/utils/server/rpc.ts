import { getSource } from "./utils";

export class RPC {
    static events = new Map<string, Function>();

    /**
     * Calls an RPC event on the server and returns a promise that resolves with the result.
     * @param event - The name of the RPC event.
     * @param playerId - The ID of the player to send the RPC event to.
     * @param args - Additional arguments to pass to the RPC event.
     * @returns A promise that resolves with the result of the RPC event.
     * @example
     * const result = await RPC.call('myEvent', 1, 'arg1', 'arg2');
     */
    static call<T = any>(event: string, playerId: number, ...args: any[]) {
        const startTime = Date.now(); // Record the start time

        return new Promise((resolve, reject) => {
            const id = event + Math.random().toString(36).substr(2, 9);

            const listener = (data: T) => {
                RPC.events.delete(event);
                clearTimeout(timeoutId);
                const endTime = Date.now(); // Record the end time
                const duration = endTime - startTime; // Calculate the duration
                console.log(`Returned data in ${duration}ms`); // Log the duration
                resolve(data);
            };

            RPC.events.set(event, listener);

            onNet(id, listener);
            emitNet(event, playerId, id, ...args);

            const timeoutId = setTimeout(() => {
                RPC.events.delete(event);
                reject(new Error('Timeout'));
            }, 5000);
        });
    }

    /**
     * Registers an event listener for an RPC event.
     * @param event - The name of the RPC event.
     * @param callback - The callback function to be executed when the RPC event is triggered.
     * @example
     * RPC.on('myEvent', (arg1, arg2) => {
     *     // Handle the event
     * });
     */
    static on(event: string, callback: Function) {
        onNet(event, async (id: string, ...args: any[]) => {
            const src = getSource();
            const result = await callback(...args);

            emitNet(id, src, result);
        });
    }
}

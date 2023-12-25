const state: { [key: string]: any } = {};

export function set(key: string, value: any) {
    state[key] = value;
}

export function get(key: string) {
    return state[key];
}

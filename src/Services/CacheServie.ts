export default class CacheService extends Map<string, number> {
    private timeouts: any = {};

    constructor(array: any = []) {
        super(array);
    }

    delete(key: string): boolean {
        return super.delete(this.preProcess(key));
    }

    get(key: string): any {
        return super.get(this.preProcess(key));
    }

    has(key: string): boolean {
        return super.has(this.preProcess(key));
    }

    set(key: string, value: any, options: any = {}) {
        key = this.preProcess(key);

        if (options.ttl) {
            // instead of using timeouts it could validate the ttl when `get` is called
            // so the amount of timeouts doesn't get out of control
            if (this.timeouts[key]) {
                clearTimeout(this.timeouts[key]);
            }

            this.timeouts[key] = setTimeout(() => this.delete(key), options.ttl);
        }

        return super.set(key, value);
    }

    preProcess(key: string): string {
        if (typeof key === 'object') {
            return JSON.stringify(key);
        }

        return key;
    }
}

export function isEmpty(
    obj: Object,
) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function extend(a: any, b: any) {
    const c = { ...a };

    if (!a || !b) {
        return c;
    }

    const keys = Object.keys(b);

    for (let i = 0, l = keys.length; i < l; i += 1) {
        const key = keys[i];

        if (Object.prototype.toString.call(b[key]) === '[object Object]') {
            if (Object.prototype.toString.call(c[key]) !== '[object Object]') {
                c[key] = b[key];
            } else {
                c[key] = extend(c[key], b[key]);
            }
        } else {
            c[key] = b[key];
        }
    }

    return c;
}

export function fromDotCase(
    obj: any,
) {
    const result = {};

    for (const objectPath in obj) {
        const parts = objectPath.split('.');

        let target: any = result;
        while (parts.length > 1) {
            const part = parts.shift();

            if (!part) break;

            target[part] = target[part] || {};
            target = target[part];
        }

        target[parts[0]] = obj[objectPath];
    }

    return result;
}

export function toDotCase(
    obj: any,
    target: any = {},
    prefix: string = '',
) {
    Object.keys(obj).forEach(function (key) {
        if (typeof (obj[key]) === 'object' && !Array.isArray(obj[key])) {
            toDotCase(obj[key], target, prefix + key + '.');
        } else {
            return target[prefix + key] = obj[key];
        }

        return null;
    });

    return target;
}

export function hasProp(
    obj: any,
    prop: string | number,
) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function httpSerialize(
    obj: any,
    prefix: string = '',
): string {
    const str = [];
    let p;

    for (p in obj) {
        if (hasProp(obj, p)) {
            const k = prefix ? prefix + '[' + p + ']' : p;
            const v = obj[p];

            str.push((v !== null && typeof v === 'object')
                ? httpSerialize(v, k)
                : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
    }

    return str.join('&');
}

export function filter(
    obj: any,
    fn: Function,
) {
    const result: any = {};
    let key;

    for (key in obj) {
        if (hasProp(obj, key) && !fn(obj[key], key)) {
            result[key] = obj[key];
        }
    }

    return result;
}

export function map(
    obj: any,
    fn: (value: string, key: string, index: number) => void,
) {
    let i = 0;
    const newObject: any = {};

    Object.keys(obj).map((key) => {
        i += 1;
        newObject[key] = fn(obj[key], key, i - 1);

        return null;
    });

    return newObject;
}


export default {
    isEmpty,
    extend,
    fromDotCase,
    toDotCase,
    hasProp,
    httpSerialize,
    filter,
    map,
};

export function auditTime(
    func: Function,
    time: number = 0,
): Function {
    let timer: any | null;

    return (...args: any[]) => {
        if (timer) return;

        if (typeof func !== 'undefined') {
            func.call(null, ...args);
        }

        timer = setTimeout(() => {
            timer = null;
        }, time > 0 ? time : 300);
    };
}

export function debounceTime(
    func: Function,
    time: number = 0,
): Function {
    let timer: any | null;

    return (...args: any[]) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            if (typeof func !== 'undefined') {
                func.call(null, ...args);
            }

            timer = null;
        }, time > 0 ? time : 300);
    };
}

export function throttleTime(
    time: number,
) {
    let now: number;
    let before: number;

    return () => {
        now = (new Date()).getTime();

        if (!before || now - before > time) {
            before = now;
            return true;
        }

        before = now;
        return false;
    };
}

export default {
    auditTime,
    debounceTime,
    throttleTime,
};

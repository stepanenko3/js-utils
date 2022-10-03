import ObjectUtil from './ObjectUtil';
import DomUtil from './DomUtil';
import OperatorUtil from './OperatorUtil';

export function dispatch(
    element: HTMLElement,
    name: string,
) {
    if ('createEvent' in document) {
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent(name, false, true);
        element.dispatchEvent(evt);
    } else {
        (<any>element).fireEvent(`on${name}`);
    }
}

export function createCustom(
    type: string,
    params: Object = {},
) {
    const eventParams = {
        bubbles: false,
        cancelable: false,
        detail: '',
        ...params,
    };

    if (typeof window.CustomEvent === 'function') {
        return new CustomEvent(type, eventParams);
    }

    const customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(
        type,
        eventParams.bubbles,
        eventParams.cancelable,
        eventParams.detail,
    );

    return customEvent;
}

export function listen(
    selector: string | HTMLElement | HTMLElement[] | Document | Window,
    eventName: string,
    fn: Function,
    options = {},
) {
    const opts = ObjectUtil.extend({
        parent: document,
    }, options);

    let nodes: HTMLElement[];

    if (typeof selector === 'string') {
        nodes = DomUtil.nodeArray(selector, opts.parent);
    } else if (Array.isArray(selector)) {
        nodes = selector;
    } else {
        nodes = [selector as HTMLElement];
    }

    let listener: any = fn;
    if (opts.debounceTime) {
        listener = OperatorUtil.debounceTime(function (...args: any[]) {
            return fn(...args);
        }, opts.debounceTime);
    } else if (opts.auditTime) {
        listener = OperatorUtil.auditTime(function (...args: any[]) {
            return fn(...args);
        }, opts.auditTime);
    }

    const events = eventName.split(' ');

    events.map((e: string) => nodes.map((n) => n.addEventListener(e, listener, opts)));

    return {
        unsubscribe: () => events.map((e: string) => nodes.map((n) => n.removeEventListener(e, listener, opts))),
    };
}

export function getPointer(e: Event) {
    if (e instanceof MouseEvent) {
        return e;
    } if (e instanceof TouchEvent) {
        const event = (<any>e).originalEvent || e;
        return event.touches[0] || event.changedTouches[0] || null;
    }
    return null;
}

export function pause(e: Event) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();

    e.cancelBubble = true;
    e.returnValue = false;

    return false;
}

export function pointerEventDown(e: Event) {
    if (e instanceof MouseEvent) {
        return (e.buttons === undefined ? e.which === 1 : e.buttons === 1);
    }

    return (e instanceof TouchEvent);
}

export function runOnKeys(
    func: Function,
    ...codes: (string | string[])[]
) {
    const pressed = new Set();

    document.addEventListener('keydown', function (event) {
        pressed.add(event.code);

        for (const code of codes) {
            let founded = false;

            if (typeof code === 'string' && pressed.has(code)) {
                founded = true;
            }

            if (typeof code === 'object' && Array.isArray(code)) {
                for (const code1 of <any[]>code) {
                    if (pressed.has(code1)) {
                        founded = true;
                    }
                }
            }

            if (!founded) return;
        }

        pressed.clear();

        func();
    });

    document.addEventListener('keyup', function (event) {
        pressed.delete(event.code);
    });
}

export default {
    dispatch,
    createCustom,
    listen,
    getPointer,
    pause,
    pointerEventDown,
    runOnKeys,
};

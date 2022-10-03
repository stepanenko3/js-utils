import { loadCSS } from 'fg-loadcss';

import EventUtil from './EventUtil';
import ScrollUtil from './ScrollUtil';

export function ready(fn: Function): void {
    if (document.readyState !== 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', () => fn());
    } else {
        (<any>document).attachEvent('onreadystatechange', function () {
            if (document.readyState !== 'loading') fn();
        });
    }
}

export function nodeArray(
    selector: string,
    parent: Document | HTMLElement | null = document,
): HTMLElement[] {
    return parent ? [].slice.call(parent.querySelectorAll(selector)) : [];
}

export function getCoords(
    el: HTMLElement,
) {
    var box = el.getBoundingClientRect();

    var { body } = document;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return {
        top: Math.round(top),
        left: Math.round(left),
    };
}

export function firstChild(
    el: HTMLElement,
) {
    let firstEl = el.firstChild;

    while (firstEl != null && firstEl.nodeType === 3) {
        firstEl = firstEl.nextSibling;
    }

    return firstEl;
}

export function getClosest(
    el: HTMLElement,
    selector: string,
): HTMLElement | null {
    return el.matches(selector)
        ? el
        : el.closest(selector);
}

export function getSiblings(
    el: HTMLElement,
    filter: Function,
): HTMLElement[] {
    if (!el) {
        return [];
    }

    const siblings: any[] = [];

    let element: HTMLElement | ChildNode | null = el.parentNode?.firstChild || null;

    do {
        if (element && element.nodeType === 1 && element !== el && (!filter || filter(element))) {
            siblings.push(element);
        }
    } while (element = element?.nextSibling || null);

    return siblings;
}

export function getStyle(
    el: HTMLElement,
): CSSStyleDeclaration {
    return window.getComputedStyle
        ? window.getComputedStyle(el, null)
        : (<any>el).currentStyle;
}

export function getTransformMatrix(el: HTMLElement): WebKitCSSMatrix {
    const style = getStyle(el);

    return new WebKitCSSMatrix(style.webkitTransform);
}

export function getTranslateValues(el: HTMLElement) {
    const style = getStyle(el);
    const matrix = style.transform || style.webkitTransform || (<any>style).mozTransform;

    if (matrix === 'none' || typeof matrix === 'undefined') {
        return {
            x: 0,
            y: 0,
            z: 0,
        };
    }

    const matrixType = matrix.includes('3d') ? '3d' : '2d';
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');

    if (matrixType === '2d') {
        return {
            x: matrixValues[4],
            y: matrixValues[5],
            z: 0,
        };
    }

    if (matrixType === '3d') {
        return {
            x: matrixValues[12],
            y: matrixValues[13],
            z: matrixValues[14],
        };
    }

    return {};
}

export function inViewport(
    el: HTMLElement | string,
    callback: Function,
    options = {},
): IntersectionObserver | null {
    const element: HTMLElement | null = typeof el === 'string' ? document.querySelector(el) : el;

    if (!element)
        return null;

    const observer: any = new IntersectionObserver((entries) => {
        entries.forEach((entry) => callback(entry));
    }, options);

    observer.observe(element);

    return observer;
}

// inViewport('.target', element => {
//     element.isIntersecting (bool) true/false
// }, {
//     root: document.querySelector('.scroll')
// })

export function inViewportOffset(
    el: HTMLElement,
) {
    const H = window.outerHeight;
    const r = el.getBoundingClientRect();
    let t = r.top;
    const b = r.bottom;

    if (t > 0) t = 0;

    let a;
    if (t > 0) a = H - t;
    else if (b < H) a = b;
    else a = H;

    return Math.max(0, a);
}

export function isChild(
    el: HTMLElement,
    parentObj: HTMLElement,
) {
    while (el !== undefined && el != null && el.tagName.toUpperCase() !== 'BODY') {
        if (el === parentObj) {
            return true;
        }

        el = el.parentNode as HTMLElement;
    }

    return false;
}

export function isElement(el: HTMLElement) {
    return (
        typeof HTMLElement === 'object'
            ? el instanceof HTMLElement
            : el && typeof el === 'object' && el !== null && el.nodeType === 1 && typeof el.nodeName === 'string'
    );
}

export function isNode(el: HTMLElement) {
    return (
        typeof Node === 'object'
            ? el instanceof Node
            : el && typeof el === 'object' && typeof el.nodeType === 'number' && typeof el.nodeName === 'string'
    );
}

export function isVisible(element: HTMLElement | string) {
    let el: HTMLElement | null = typeof element === 'string'
        ? document.querySelector(element)
        : element;

    if (!el) return false;

    let style = getStyle(el);

    if (style.visibility === 'hidden' || style.display === 'none') {
        return false;
    }

    while (!(/body/i).test(<any>el)) {
        el = el.parentNode as HTMLElement;

        style = getStyle(el);

        if (style.visibility === 'hidden' || style.display === 'none') {
            return false;
        }
    }

    return true;
}

export function getHeight(
    el: HTMLElement,
) {
    const style = getStyle(el);

    return el.offsetHeight + parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
}

export function getWidth(
    el: HTMLElement,
) {
    const style = getStyle(el);

    return el.offsetWidth + parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
}

export function replaceComment(
    el: HTMLElement,
    section: string,
    html: string,
) {
    const regex = new RegExp(`<!--\\s?\/start ${section}\\s?-->([\\s\\S]*?)<!--\\s?\/end ${section}\\s?-->`, 'g');

    el.innerHTML = el.innerHTML.replace(regex, `<!--/start ${section}-->${html}<!--/end ${section}-->`);
}

export function setTranslate(
    el: HTMLElement,
    cm: WebKitCSSMatrix,
    x: number,
    y: number,
) {
    el.style.transform = 'matrix3d(' + cm.m11 + ', ' + cm.m12 + ', ' + cm.m13 + ', ' + cm.m14 + ', ' + cm.m21 + ', ' + cm.m22 + ', ' + cm.m23 + ', ' + cm.m24 + ', ' + cm.m31 + ', ' + cm.m32 + ', ' + cm.m33 + ', ' + cm.m34 + ', ' + x + ', ' + y + ', ' + cm.m43 + ', ' + cm.m44 + ')';
}

export function setTransformPosition(
    el: HTMLElement,
    x: number,
    y: number,
) {
    return setTranslate(el, getTransformMatrix(el), x, y);
}

export function stopVideos(
    element: HTMLElement | Document = document,
) {
    nodeArray('iframe, video', element)
        .map((el: HTMLElement): any => {
            if (el instanceof HTMLVideoElement) {
                el.pause();
            } else if (el instanceof HTMLIFrameElement) {
                const { src } = el;

                if (src.indexOf('youtube') !== -1 && el.contentWindow) {
                    el.contentWindow.postMessage(JSON.stringify({
                        event: 'command',
                        func: 'pauseVideo',
                    }), '*');
                } else {
                    el.setAttribute('src', src);
                }
            }
        });
}

export function popupCenter(
    url: string,
    title: string,
    w: number,
    h: number,
): Window | null {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    let width;
    if (window.innerWidth) {
        width = window.innerWidth;
    } else if (document.documentElement.clientWidth) {
        width = document.documentElement.clientWidth;
    } else {
        width = window.screen.width;
    }

    let height;
    if (window.innerHeight) {
        height = window.innerHeight;
    } else if (document.documentElement.clientHeight) {
        height = document.documentElement.clientHeight;
    } else {
        height = window.screen.height;
    }

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(url, title, `toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0,width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`);

    if (!newWindow)
        return null;

    newWindow.focus();

    return newWindow;
}

export function meta(
    name: string,
    value: string | null = null,
): string | null {
    if (name == 'title') {
        if (value) {
            document.title = value;
        }

        return document.title;
    }

    const metas = document.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i += 1) {
        if (metas[i].getAttribute('name') === name) {
            if (value) {
                metas[i].setAttribute('content', value);
            }

            return metas[i].getAttribute('content');
        }
    }

    return '';
}

export function loadScriptAsync(src: string, callback: Function = () => { }) {
    const e = document.createElement('script');
    e.src = src;
    e.type = 'text/javascript';

    EventUtil.listen(e, 'load', callback, {
        once: true,
    });

    document.getElementsByTagName('head')[0].appendChild(e);
}

export function togglePasswordVisible(field: HTMLElement) {
    const input = field.querySelector('input');
    const btn = field.querySelector('.btn');

    if (!input || !btn)
        return;

    if (input.type === 'password') {
        input.type = 'text';
        btn.classList.add('active');
    } else {
        input.type = 'password';
        btn.classList.remove('active');
    }
}

export function toggleClass(
    el: HTMLElement,
    selector: string,
    className: string,
    reverse: boolean = false,
) {
    if (!el || !el.tagName || !selector || !className)
        return;

    if (
        el instanceof HTMLInputElement
        && el.tagName.toLowerCase() === 'input'
        && ['checkbox', 'radio'].indexOf(el.getAttribute('type')?.toLowerCase() || '') !== -1
    ) {
        let { checked } = el;
        if (reverse) checked = !checked;

        nodeArray(selector)
            .map((n: HTMLElement) => n.classList.toggle(className, checked));
    } else {
        nodeArray(selector)
            .map((n: HTMLElement) => n.classList.toggle(className));
    }
}

export function renameField(
    el: HTMLElement,
    attr: string,
    count: number | string,
    forName: boolean = false,
    regex: RegExp = /([^[]+?\[)\d+(\].*)/,
) {
    const attrNew = el.getAttribute(attr);

    if (attrNew) {
        if (attr === 'name' || forName === true) {
            const a = attrNew.replace(regex, '$1' + count + '$2');

            el.setAttribute(attr, a);
        } else {
            const a = attrNew.split(/_[0-9]*$/i)[0];

            el.setAttribute(attr, a + '_' + count);
        }
    }
}

export function togglePopup(
    selector: string,
    className: string,
    status: boolean | null = null,
) {
    const s = status === null
        ? !document.body.classList.contains('popup-open')
        : status;

    document.body.classList.toggle('popup-open', s);
    const el = document.querySelector(selector);

    if (el) {
        el.classList.toggle(className, s);

        if (s) {
            ScrollUtil.lock(el);
        }
    }

    if (!s) {
        ScrollUtil.unlockAll();
    }

    return el;
}

export {
    loadCSS,
};

export default {
    loadCSS,
    ready,
    nodeArray,
    getCoords,
    firstChild,
    getClosest,
    getSiblings,
    getTransformMatrix,
    getTranslateValues,
    inViewport,
    inViewportOffset,
    isChild,
    isElement,
    isNode,
    getStyle,
    isVisible,
    getHeight,
    getWidth,
    replaceComment,
    setTransformPosition,
    setTranslate,
    stopVideos,
    popupCenter,
    meta,
    loadScriptAsync,
    togglePasswordVisible,
    toggleClass,
    renameField,
    togglePopup,
};

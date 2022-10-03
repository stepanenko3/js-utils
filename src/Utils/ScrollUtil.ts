import * as ScrollPlugin from 'scroll';

import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
} from 'body-scroll-lock';
import EventUtil from './EventUtil';


export function doc(): HTMLElement {
    // IE < 9 & Node
    const scrollEl = typeof window?.pageYOffset === 'undefined' ?
        document?.documentElement :
        null;

    if (scrollEl) {
        return scrollEl;
    }

    const startScrollTop = window.pageYOffset;

    document.documentElement.scrollTop = startScrollTop + 1;

    if (window.pageYOffset > startScrollTop) {
        document.documentElement.scrollTop = startScrollTop;

        return document.documentElement;
    }

    return (document.scrollingElement || document.body) as HTMLElement;
}

export function smoothTo(
    y: number,
    smoothDistance: number = 100,
    duration: number = 200,
) {
    const offset = window.pageYOffset;

    if (y === offset) {
        return;
    }

    window.scrollTo({
        top: offset < y - smoothDistance
            ? y - smoothDistance : y + smoothDistance,
    });

    ScrollPlugin.top(doc(), y, {
        duration: duration,
    });
}

// https://codepen.io/aaroniker/pen/WNNLRYb
export function bindScrollIntoView() {
    return EventUtil.listen('a[href^="#"]', 'click', (e: Event) => {
        EventUtil.pause(e);

        const href = (e.target as HTMLElement)
            .getAttribute('href') || '';

        document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth',
        });
    });
}

// https://codepen.io/aaroniker/pen/RwwEQqZ
export function bindScrollTo() {
    EventUtil.listen('a[href^="#"]', 'click', (e: Event) => {
        EventUtil.pause(e);

        const elem = e.target as HTMLElement;

        const href = elem.getAttribute('href') || '';
        const block = document.querySelector(href);

        if (!block || !(elem instanceof HTMLElement))
            return;

        const offset = elem.dataset.offset ? parseInt(elem.dataset.offset, 10) : 0;
        const bodyOffset = document.body.getBoundingClientRect().top;

        window.scrollTo({
            top: block.getBoundingClientRect().top - bodyOffset + offset,
            behavior: 'smooth',
        });
    });
}

export {
    disableBodyScroll as lock,
    enableBodyScroll as unlock,
    clearAllBodyScrollLocks as unlockAll,
};

export default {
    doc,
    smoothTo,
    bindScrollIntoView,
    bindScrollTo,

    lock: disableBodyScroll,
    unlock: enableBodyScroll,
    unlockAll: clearAllBodyScrollLocks,
};

import NumberUtil from './NumberUtil';
import StringUtil from './StringUtil';
import DomUtil from './DomUtil';
import NotifyUtil from './NotifyUtil';
import EventUtil from './EventUtil';

export function generateBorderBlob() {
    const percentage1 = NumberUtil.random(25, 75);
    const percentage2 = NumberUtil.random(25, 75);
    const percentage3 = NumberUtil.random(25, 75);
    const percentage4 = NumberUtil.random(25, 75);

    const percentage11 = 100 - percentage1;
    const percentage21 = 100 - percentage2;
    const percentage31 = 100 - percentage3;
    const percentage41 = 100 - percentage4;

    const borderRadius = `${percentage1}% ${percentage11}% ${percentage21}% ${percentage2}% / ${percentage3}% ${percentage4}% ${percentage41}% ${percentage31}%`;

    return borderRadius;
}

export function getQueryParamByName(
    name: string,
    url: string = window.location.href,
    def: any = null,
): string {
    const nameClone = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + nameClone + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);

    if (!results) {
        return def;
    }

    if (!results[2]) {
        return def;
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function humanFileSize(
    bytes: number,
    si: boolean = true,
): string {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    let u = -1;

    do {
        bytes /= thresh;
        u += 1;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);

    return bytes.toFixed(1) + ' ' + units[u];
}

export function money(
    amount: number,
    currency: string = 'uah',
    digits: number = 2,
    locale: string = 'ru-RU',
) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    }).format(amount);
}

export function pickColorBasedOnBg(
    bgColor: string,
    lightColor: string,
    darkColor: string,
) {
    const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16); // hexToR
    const g = parseInt(color.substring(2, 4), 16); // hexToG
    const b = parseInt(color.substring(4, 6), 16); // hexToB
    const uicolors = [r / 255, g / 255, b / 255];
    const c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
}

export function isRetina() {
    let mediaQuery;

    if (typeof window !== 'undefined' && window !== null) {
        mediaQuery = '(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25),'
            + '(-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)';

        if (window.devicePixelRatio > 1.25) {
            return true;
        }

        if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
            return true;
        }
    }

    return false;
}

export function updateQueryStringParameter(
    uri: string,
    key: string,
    value: string,
): string {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';

    return uri.match(re)
        ? uri.replace(re, '$1' + key + '=' + value + '$2')
        : uri + separator + key + '=' + value;
}

export function setupWordRotation(
    el: HTMLElement | Document = document,
    interval: number = 2000,
): any {
    return setInterval(function () {
        const show = el.querySelector('span[data-show]');

        if (!show)
            return;

        el.querySelector('span[data-up]')
            ?.removeAttribute('data-up');

        show.removeAttribute('data-show');
        show.setAttribute('data-up', '');

        (show.nextElementSibling || el.querySelector('span:first-child'))
            ?.setAttribute('data-show', '');
    }, interval);
}

export const requestAnimFrame = window.requestAnimationFrame
    || function (callback: Function) {
        window.setTimeout(callback, 1000 / 60);
    };

export function generateUrl(params: string[]) {
    return '/' + (params || [])
        .filter((param: string) => param && (NumberUtil.isNumeric(param) || param.length > 0))
        .join('/');
}

export function getMap(json: any[], data: any) {
    let tpl = '';

    json.map((n) => {
        let opactiy = data[n.key] || 0;
        if (opactiy <= 0.1) opactiy = 0.1;

        tpl += `<path d="${n.path}" data-id="${n.key}" style="fill:rgba(37, 112, 255, ${opactiy})"></path>`;

        return n;
    });

    return `<svg viewBox="0 0 2000 1001" class="map-svg">${tpl}</svg>`;
}

export function copyText(
    textToCopy: string,
    isNotify: boolean = true,
) {
    return StringUtil.copyToClipboard(textToCopy, () => {
        if (!isNotify) return;

        NotifyUtil.show('Success copied', {
            backgroundColor: 'var(--color-success-500)',
            elementsStyle: 'light',
        });
    });
}

export function indicatorSelect(
    el: HTMLElement,
    state: boolean = true,
) {
    if (!el || !el.hasAttribute('indicator-selector'))
        return;

    return DomUtil.nodeArray(`[indicator-selector="${el.getAttribute('indicator-selector')}"]`)
        .map((n: HTMLElement) => {
            const classList = n.getAttribute('indicator-class');

            if (!classList)
                return n;

            classList.split(',').map((c) => n.classList.toggle(c, state));

            return n;
        });
}

export function safeEval(code: string) {
    return eval(code);
}

export function updateCountTotal(
    key: string,
    res: { count: number, total: number } | null = null,
) {
    if (!res)
        return;

    DomUtil
        .nodeArray(`[data-${key}-toggle]`)
        .map((n) => n.classList.toggle('empty', !res.count));

    DomUtil
        .nodeArray(`[data-${key}-count]`)
        .map((n) => {
            n.innerHTML = '' + (res.count || 0);
            n.classList.toggle('empty', !res.count);

            return n;
        });

    DomUtil
        .nodeArray(`[data-${key}-total]`)
        .map((n) => {
            n.innerHTML = '' + (res.total || 0);
            n.classList.toggle('empty', !res.count);

            return n;
        });
}

export function generatePreviews(e: Event) {
    const input = e.target as HTMLInputElement;
    const maxFiles = parseInt(input.getAttribute('max-files') || '', 10) || 5;
    const maxFileSize = parseInt(input.getAttribute('max-file-size') || '', 10) || 4096;
    const field = DomUtil.getClosest(input, '.form-field');
    const previewArea = field?.querySelector('.form-field__previews');

    function clearPreviews() {
        if (!previewArea)
            return;

        previewArea.innerHTML = '';
        previewArea.classList.add('hidden');
    }

    clearPreviews();

    function generateError(message: string) {
        NotifyUtil.show(message, {
            backgroundColor: 'var(--color-danger-500)',
            elementsStyle: 'light',
        });

        EventUtil.pause(e);

        input.value = '';
        return false;
    }

    if (maxFiles > 0 && input.files && input.files.length > maxFiles) {
        return generateError(`Only ${maxFiles} files accepted.`);
    }

    const allow = (input.getAttribute('accept') || 'jpg,jpeg,png')
        .toString()
        .replaceAll(' ', '')
        .replaceAll(',', '|');

    const regexp = new RegExp(`.(${allow})$`, 'i');

    function readAndPreview(file: any) {
        if (!regexp.test(file.name)) {
            return generateError(file.name + ' is not an image');
        }

        const fileSize = Math.round((file.size / 1000));

        if (fileSize >= maxFileSize) {
            return generateError(`File too Big, please select a file less than ${humanFileSize(maxFileSize * 1000)}`);
        }

        const reader = new FileReader();

        reader.addEventListener('load', function () {
            if (!previewArea)
                return;

            const tpl = `<div class="page-img">
                <img src="${this.result}" title="${file.name}" />
            </div>`;

            previewArea.classList.remove('hidden');
            previewArea.insertAdjacentHTML('beforeend', tpl);
        });

        reader.readAsDataURL(file);

        return file;
    }

    if (input.files) {
        [].forEach.call(input.files, readAndPreview);
    }

    return true;
}

export function counterChangeValue(e: Event, el: HTMLElement) {
    EventUtil.pause(e);

    const counter: HTMLElement | null = DomUtil.getClosest(e.target as HTMLElement, '[counter]');
    const value: number = parseInt(el.getAttribute('counter-update') || '0', 10);
    const input: HTMLInputElement | null = counter?.querySelector('input') || null;

    if (!input)
        return;

    const min = parseInt(input.getAttribute('min') || '1', 10);
    const max = parseInt(input.getAttribute('max') || '1000000', 10);
    const oldVal = parseInt(input.value, 10);

    let newVal = oldVal + value;
    if (newVal < min) newVal = min;
    if (newVal > max) newVal = max;

    if (input.classList.contains('disabled'))
        return;

    input.value = '' + newVal;

    if (oldVal !== newVal)
        EventUtil.dispatch(input, 'change');
}

export default {
    generateBorderBlob,
    getQueryParamByName,
    humanFileSize,
    money,
    pickColorBasedOnBg,
    isRetina,
    updateQueryStringParameter,
    setupWordRotation,
    requestAnimFrame,
    generateUrl,
    getMap,
    copyText,
    indicatorSelect,
    safeEval,
    updateCountTotal,
    generatePreviews,
    counterChangeValue,
};

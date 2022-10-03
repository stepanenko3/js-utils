export function hashCode(
    string: string,
): number {
    let hash: number = 0,
        i: number,
        chr: number;

    if (string.length === 0) {
        return hash;
    }

    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash;
}

export function isJson(
    str: string,
): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function copyToClipboard(
    str: string,
    callback: Function = () => { },
): void {
    const tmpEl = document.createElement('input');
    tmpEl.type = 'text';
    tmpEl.value = str;

    document.body.appendChild(tmpEl);

    tmpEl.select();
    document.execCommand('Copy');

    document.body.removeChild(tmpEl);

    callback();
}

export default {
    hashCode,
    isJson,
    copyToClipboard,
};

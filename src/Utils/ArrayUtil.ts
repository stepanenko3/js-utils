export function findFirst(
    array: any[],
    n: number | null = null,
) {
    if (array == null) {
        return undefined;
    }

    if (n == null) {
        return array[0];
    }

    if (n < 0) {
        return [];
    }

    return array.slice(0, n);
}

export function getByAscii(
    needle: string,
    haystack: any[],
) {
    if (!needle || !haystack) return 'transparent';

    const asciiCodeSum = needle
        .split('')
        .map((letter) => letter.charCodeAt(0))
        .reduce((previous, current) => previous + current);

    return haystack[asciiCodeSum % haystack.length];
}

export function removeValue(
    array: any[],
    value: string | number | any,
): any[] {
    const index = array.indexOf(value);

    if (index > -1) {
        array.splice(index, 1);
    }

    return array;
}

export default {
    findFirst,
    getByAscii,
    removeValue,
};

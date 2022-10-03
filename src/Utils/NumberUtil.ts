export function between(
    value: number,
    a: number,
    b: number,
    inclusive: boolean = true,
): boolean {
    const min = Math.min(a, b);
    const max = Math.max(a, b);

    return inclusive
        ? value >= min && value <= max
        : value > min && value < max;
}

export function declOfNum(
    number: number,
    titles: any[],
): any {
    const cases = [2, 0, 1, 1, 1, 2];

    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

export function isNumeric(n: string): boolean {
    return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

export function random(
    min: number,
    max: number,
): number {
    const min2 = Math.ceil(min);
    const max2 = Math.floor(max);

    return Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
}

export default {
    between,
    declOfNum,
    isNumeric,
    random,
};

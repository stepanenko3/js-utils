import ObjectUtil from './ObjectUtil';

export function i18n(
    key: string,
    params: any = {},
    def: string = '',
) {
    const data = ObjectUtil.toDotCase((<any>window).i18n || {});

    let res = data[key] || def;

    Object.keys(params).map((k) => (res = res.replace(`{${k}}`, params[k])));

    return res;
}

export {
    i18n as __,
};

export default {
    i18n,
    '__': i18n,
};

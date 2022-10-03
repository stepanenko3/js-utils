import http, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CacheFacade } from '../Facades';
import DomUtil from './DomUtil';
import ObjectUtil from './ObjectUtil';
import NotifyUtil from './NotifyUtil';
import ProgressUtil from './ProgressUtil';
import { __ } from './TranslateUtil';

export interface HttpConfig extends AxiosRequestConfig {
    setDefaultHeaders?: boolean,
    autoData?: object | null,
    body?: string,
    cache?: boolean,
}

export function handleError(
    error: AxiosError | null = null,
    stopProgress: boolean = true,
    callback: Function = () => { },
) {
    console.error(error);

    if (stopProgress)
        ProgressUtil.done();

    const messages: any = {
        default: __('errors.code.default'),
        403: __('errors.code.403'),
        404: __('errors.code.404'),
    };

    let message = null;

    if (error && error.response) {
        const { data, status, headers }: any = error.response;

        let formattedTime = '';

        if (status === 429) {
            const date = new Date(parseInt(headers['x-ratelimit-reset']) * 1000);
            const hours = date.getHours();
            const seconds = parseInt('0' + date.getSeconds(), 10);

            let minutes: string | number = date.getMinutes();

            if (seconds > 5)
                minutes += 1;

            minutes = '0' + minutes;

            formattedTime = `${hours}:${minutes.substr(-2)}`;

            messages[429] = __('errors.code.429', {
                time: formattedTime,
            });
        }

        const errorsKeys = Object.keys(data && data.errors ? data.errors : []);

        if (!message && errorsKeys.length === 1) {
            message = data.errors[errorsKeys[0]];
        }

        if (!message && ObjectUtil.hasProp(messages, status)) {
            message = messages[status];
        }

        if (!message && data.message) {
            message = data.message;
        }

        if (data && data.redirect) {
            message = `<a href="${data.redirect}>${message}</a>`;
        }
    } else if (error && error.request) {
        console.log(error.request);
    } else if (error) {
        message = error.message;
    }

    if (!message) {
        message = messages.default;
    }

    NotifyUtil.show(message, {
        backgroundColor: 'var(--color-danger-500)',
        elementsStyle: 'light',
    });

    callback(error);
}

export function run(config: HttpConfig) {
    if (config.setDefaultHeaders === true || config.setDefaultHeaders === undefined) {
        config.headers = ObjectUtil.extend({
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': DomUtil.meta('csrf-token'),
            'X-Requested-With': 'XMLHttpRequest',
        }, (config.headers || []));

        delete config.setDefaultHeaders;
    }

    if (config.autoData) {
        delete config.params;
        delete config.body;
        delete config.data;

        let url = config.url || '';

        if (config.method === undefined || config.method?.toUpperCase() === 'GET') {
            const queryParams = ObjectUtil.httpSerialize(config.autoData);
            url = url.indexOf('?') === -1 ? `${url}?${queryParams}` : `${url}&${queryParams}`;
        } else {
            config.data = config.autoData;
        }

        config.url = url;

        delete config.autoData;
    }

    if (config.cache === true && config.method?.toUpperCase() === 'GET') {
        delete config.cache;

        const key = `http:${config?.url || ''}`;

        if (CacheFacade.has(key)) {
            return Promise.resolve(CacheFacade.get(key));
        }

        return http(config).then((response: AxiosResponse) => {
            CacheFacade.set(key, response);

            return response;
        });
    }

    return http(config);
}

export function get(config: HttpConfig) {
    return run(ObjectUtil.extend(config, {
        method: 'GET',
    }));
}

export function post(config: HttpConfig) {
    return run(ObjectUtil.extend(config, {
        method: 'POST',
    }));
}

export function put(config: HttpConfig) {
    return run(ObjectUtil.extend(config, {
        method: 'PUT',
    }));
}

export default {
    get,
    post,
    put,
    run,
    handleError,
};

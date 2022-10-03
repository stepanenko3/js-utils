import Toast, { ToastOptions } from '@stepanenko3/js-toast';
import ObjectUtil from './ObjectUtil';

export function show(
    message: string,
    options: Partial<ToastOptions> = {},
) {
    Toast.show(
        ObjectUtil.extend({
            backgroundColor: 'var(--color-elements-bg)',
            elementsStyle: 'dark',
            content: message,
            duration: 8000,
            unfocusduration: 3000,
            position: 'bottom-right',
            showclose: true,
            progressbar: 'bottom',
            opactiy: 1,
            class: {
                title: `vtoast__title ${(options.elementsStyle || 'dark') === 'light' ? 'text-white' : ''}`,
            },
        }, options),
    );
}


export default {
    show,
};

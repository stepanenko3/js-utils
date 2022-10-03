import serialize from 'form-serialize';

import ObjectUtil from './ObjectUtil';
import EventUtil from './EventUtil';
import NotifyUtil from './NotifyUtil';
import DomUtil from './DomUtil';
import HelpersUtil from './HelpersUtil';
import ProgressUtil from './ProgressUtil';

export {
    serialize,
};

export function laravelErrors(errors: any) {
    const res: any = {};

    ObjectUtil.map(errors, (val: string, key: string) => {
        const ex = key.split('.', 4);

        const withoutFirst = ex.slice(1).join('][');
        const newKey = ex[0] + (withoutFirst ? `[${withoutFirst}]` : '');

        res[newKey] = val;
    });

    return res;
}

export function setInputValue(
    form: HTMLFormElement,
    name: string,
    value: string,
    dispatch = true,
) {
    const dispatchChange = (el: HTMLElement) => {
        if (!dispatch) {
            return;
        }

        EventUtil.dispatch(el, 'change');
        EventUtil.dispatch(form, 'change');
    };

    const input = form.querySelector(`[name="${name}"]`);

    if (!input)
        return;

    const tag = input.tagName.toLowerCase();

    if (input instanceof HTMLInputElement && tag === 'input') {
        const el: HTMLInputElement | null = form.querySelector(`input[name="${name}"][value="${value}"]`);

        if (!el)
            return;

        if (input.type === 'checkbox') {
            if (el) {
                el.checked = !el.checked;

                dispatchChange(el);
            }
        } else if (input.type === 'radio') {
            if (el) {
                el.checked = true;

                dispatchChange(el);
            } else {
                const el2: HTMLInputElement | null = form.querySelector(`input[name="${name}"]:checked`);

                if (!el2)
                    return;

                el2.checked = false;

                dispatchChange(el2);
            }
        }
    } else if (input instanceof HTMLSelectElement && tag === 'select') {
        input.value = value;

        dispatchChange(input);
    }
}

export function handleError(
    form: HTMLElement | HTMLFormElement,
    data: any,
    callbackError: any = null,
) {
    DomUtil.nodeArray('.invalid', form).map((el) => el.classList.remove('invalid'));
    DomUtil.nodeArray('.form-field__error', form).map((el) => el.remove());

    if (callbackError) {
        HelpersUtil.safeEval(`${callbackError}(${JSON.stringify(data)})`);
    } else {
        ProgressUtil.done();
    }

    if (!data || !data.errors) return;

    if (data.errors._) {
        NotifyUtil.show(data.errors._, {
            backgroundColor: 'var(--color-danger-500)',
            elementsStyle: 'light',
        });
    }

    const errors = laravelErrors(data.errors);

    Object.keys(errors).map((key) => {
        DomUtil.nodeArray(`[name="${key}"],[name="${key}[]"]`, form).map((el) => {
            const ratingField = DomUtil.getClosest(el, '.form-field__rating');
            if (ratingField) {
                ratingField.classList.add('invalid');
            } else {
                const field = DomUtil.getClosest(el, '.form-field');
                if (field) {
                    field.classList.add('invalid');
                    field.insertAdjacentHTML('beforeend', `<div class="form-field__error">${errors[key]}</div>`);
                }
            }

            return el;
        });

        return key;
    });
}

export default {
    laravelErrors,
    serialize,
    setInputValue,
    handleError,
};

import NumberUtil from './NumberUtil';
import progressInstance from 'nprogress';

export default {
    ...progressInstance,

    check: ():  boolean => {
        return NumberUtil.between(progressInstance.status || 0, 0, 100, false);
    },
};

import Cookies from 'js-cookie';

import ArrayUtil from './src/Utils/ArrayUtil';
import DomUtil from './src/Utils/DomUtil';
import EventUtil from './src/Utils/EventUtil';
import FormUtil from './src/Utils/FormUtil';
import HelpersUtil from './src/Utils/HelpersUtil';
import HttpUtil from './src/Utils/HttpUtil';
import NotifyUtil from './src/Utils/NotifyUtil';
import NumberUtil from './src/Utils/NumberUtil';
import ObjectUtil from './src/Utils/ObjectUtil';
import OperatorUtil from './src/Utils/OperatorUtil';
import ProgressUtil from './src/Utils/ProgressUtil';
import ScrollUtil from './src/Utils/ScrollUtil';
import StringUtil from './src/Utils/StringUtil';
import TranslateUtil from './src/Utils/TranslateUtil';

const main = {
    cookie: Cookies,
    array: ArrayUtil,
    dom: DomUtil,
    event: EventUtil,
    form: FormUtil,
    helpers: HelpersUtil,
    http: HttpUtil,
    notify: NotifyUtil,
    number: NumberUtil,
    object: ObjectUtil,
    operator: OperatorUtil,
    progress: ProgressUtil,
    scroll: ScrollUtil,
    string: StringUtil,
    translate: TranslateUtil,
};

export {
    main as default,
    Cookies as cookie,
    ArrayUtil as array,
    DomUtil as dom,
    EventUtil as event,
    FormUtil as form,
    HelpersUtil as helpers,
    HttpUtil as http,
    NotifyUtil as notify,
    NumberUtil as number,
    ObjectUtil as object,
    OperatorUtil as operator,
    ProgressUtil as progress,
    ScrollUtil as scroll,
    StringUtil as string,
    TranslateUtil as translate,
}

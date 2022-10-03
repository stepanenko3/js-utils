import Cookies from 'js-cookie';

import ArrayUtil from './Utils/ArrayUtil';
import DomUtil from './Utils/DomUtil';
import EventUtil from './Utils/EventUtil';
import FormUtil from './Utils/FormUtil';
import HelpersUtil from './Utils/HelpersUtil';
import HttpUtil from './Utils/HttpUtil';
import NotifyUtil from './Utils/NotifyUtil';
import NumberUtil from './Utils/NumberUtil';
import ObjectUtil from './Utils/ObjectUtil';
import OperatorUtil from './Utils/OperatorUtil';
import ProgressUtil from './Utils/ProgressUtil';
import ScrollUtil from './Utils/ScrollUtil';
import StringUtil from './Utils/StringUtil';
import TranslateUtil from './Utils/TranslateUtil';

export {
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
};

export default {
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

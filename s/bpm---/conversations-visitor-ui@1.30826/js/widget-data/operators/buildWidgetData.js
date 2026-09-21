'use es6';

import pipe from 'transmute/pipe';
import curry from 'transmute/curry';
import {
    List as ImmutableList,
    Map as ImmutableMap
} from 'immutable';
import Raven from 'raven-js';
import WidgetData from 'conversations-internal-schema/widget-data/records/WidgetData';
import Responder from 'conversations-internal-schema/responders/records/Responder';
import TypicalResponseTime from 'conversations-internal-schema/typical-response-time/records/TypicalResponseTime';
import {
    buildWidgetColoring
} from 'conversations-visitor-experience-components/visitor-widget/util/color';
import WidgetAvailabilityOptions from 'conversations-internal-schema/availability/records/WidgetAvailabilityOptions';
import {
    buildWelcomeMessage
} from './buildWelcomeMessage';
import {
    isTypeBot
} from 'conversations-internal-schema/responders/operators/isTypeBot';
import WidgetFont from 'conversations-internal-schema/font/model/WidgetFont';
import {
    SYSTEM_FONTS
} from 'conversations-internal-schema/font/constants/constants';
const UPDATED_UI_FONT = {
    fontFamily: 'system-ui',
    fallbacks: ['Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
    variants: []
};
const enforceValues = curry((valuesToEnforce, subject) => {
    var _subject$recommendedQ;
    const useSystemFont = !subject.fontFamily;
    return ImmutableMap(subject).merge(valuesToEnforce).set('coloring', buildWidgetColoring(subject.accentColor)).set('widgetFont', WidgetFont({
        fontFamily: useSystemFont ? UPDATED_UI_FONT.fontFamily : subject.fontFamily,
        fallbacks: useSystemFont ? UPDATED_UI_FONT.fallbacks : subject.fontFallbacks,
        variants: useSystemFont ? UPDATED_UI_FONT.variants : subject.fontVariants,
        fontGroup: useSystemFont ? SYSTEM_FONTS : subject.fontGroup
    })).set('gates', subject.gates).set('recommendedQuestionsForAgent', (_subject$recommendedQ = subject === null || subject === void 0 ? void 0 : subject.recommendedQuestionsForAgent) !== null && _subject$recommendedQ !== void 0 ? _subject$recommendedQ : []);
});
export const buildWidgetData = (data = {}) => {
    var _data$sendFrom;
    const responders = data.sendFrom || [];
    const sendFrom = data.sendFrom || [];
    const botResponder = isTypeBot(data === null || data === void 0 || (_data$sendFrom = data.sendFrom) === null || _data$sendFrom === void 0 ? void 0 : _data$sendFrom[0]) ? Responder(sendFrom[0]) : null;
    const responder = botResponder || sendFrom[0];
    let returnValue;
    try {
        returnValue = pipe(enforceValues({
            availabilityOptions: new WidgetAvailabilityOptions(data.availabilityOptions),
            botResponder,
            inOfficeHours: data.inOfficeHours,
            message: buildWelcomeMessage(data.message),
            messagesPageUri: data.messagesPageUri,
            nextStartTime: data.nextOfficeHoursStartTime,
            responder: Responder(responder),
            responders: ImmutableList(responders).map(Responder),
            sendFrom: ImmutableList(sendFrom).map(Responder),
            typicalResponseTime: TypicalResponseTime(data.typicalResponseTime),
            widgetLocation: data.widgetLocation
        }), WidgetData)(data);
    } catch (e) {
        Raven.captureException(e, {
            extra: {
                data
            }
        });
    }
    return returnValue;
};
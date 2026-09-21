'use es6';

import getLangLocale from './getLangLocale';
import TitleFormatters from './TitleFormatters';
import CjkCharacterRegExp from '../constants/regex/CJK';

// Formats a first and last name depending on the character set.
export default (({
    name,
    firstName,
    lastName,
    email,
    titleType
}, options) => {
    const first = firstName && firstName.trim();
    const last = lastName && lastName.trim();
    const fullName = name && name.trim();
    let formattedName;
    if (!first && !last) {
        formattedName = fullName || email || '';
    } else if (first && !last) {
        formattedName = first;
    } else if (!first && last) {
        formattedName = last;
    }
    if (typeof formattedName === 'undefined') {
        const cjkLastTest = CjkCharacterRegExp.test(last);
        const cjkFirstTest = CjkCharacterRegExp.test(first);
        if (cjkLastTest && cjkFirstTest) {
            // Should be formatted last first: https://issues.hubspotcentral.com/browse/CRM-44973
            formattedName = `${last} ${first}`;
        } else {
            formattedName = `${first} ${last}`;
        }
    }
    if (titleType) {
        const lang = options && options.locale || getLangLocale();
        const titleFormatter = TitleFormatters[lang] && TitleFormatters[lang][titleType];
        if (titleFormatter) {
            formattedName = titleFormatter(formattedName);
        }
    }
    return formattedName;
});
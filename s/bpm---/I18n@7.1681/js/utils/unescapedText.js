'use es6';

import I18n from 'I18n';
export default ((msg, opts) => {
    const optsClone = {};
    for (const key in opts) {
        if (typeof opts[key] === 'string') {
            optsClone[key] = I18n.SafeString(opts[key]);
        } else {
            optsClone[key] = opts[key];
        }
    }

    // i18n-lint-describe-next-line key-is-argument
    return I18n.text(msg, optsClone);
});
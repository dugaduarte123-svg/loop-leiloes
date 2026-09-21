/* hs-eslint ignored failing-rules */
/* eslint-disable promise/catch-or-return */

'use es6';

import I18n from 'I18n';
export default ((key, options) => {
    I18n.Info.then(() => {
        // i18n-lint-describe-next-line key-is-argument
        document.title = I18n.text(key, options);
    });
});
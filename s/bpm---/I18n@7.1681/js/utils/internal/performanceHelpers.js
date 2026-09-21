/* hs-eslint ignored failing-rules */
/* eslint-disable prefer-const */
/* eslint-disable prefer-template */

'use es6';

// Custom HubSpot logic to log key usage
let keysUsed = {};
let fallbackKeys = [];
let keyUsedTimeout;
let shouldLogUsage = Math.random() <= 0.05;
export function logKeyUsage(key, usedFallbackTranslation, requestedLocaleValue) {
    let hasSetKeysUsed = false;

    function setKeysUsed(newKey) {
        if (!hasSetKeysUsed) {
            keysUsed[newKey] = keysUsed[newKey] ? keysUsed[newKey] + 1 : 1;
        }
        hasSetKeysUsed = true;
    }
    try {
        if (usedFallbackTranslation) {
            if (localStorage.getItem('TRACK_I18N_FALLBACK_TRANSLATIONS')) {
                let i18nFallbackTranslations = localStorage.getItem('TRACK_I18N_FALLBACK_TRANSLATIONS');
                if (!i18nFallbackTranslations) {
                    i18nFallbackTranslations = key;
                } else {
                    i18nFallbackTranslations = i18nFallbackTranslations.concat(',', key);
                }
                localStorage.setItem('I18N_FALLBACK_TRANSLATIONS', i18nFallbackTranslations);
            }
        }
    } catch (e) {
        return;
    }
    if (!shouldLogUsage) {
        return;
    }
    clearTimeout(keyUsedTimeout);
    setKeysUsed(key);
    if (usedFallbackTranslation && fallbackKeys.indexOf(key) === -1) {
        fallbackKeys.push(key);
    }
    keyUsedTimeout = setTimeout(() => {
        if (window.Raven) {
            window.Raven.capturePageEvent('i18nKeysUsed', {
                extra: {
                    keysUsed: JSON.stringify(keysUsed),
                    i18nKeyCount: Object.keys(keysUsed).length,
                    fallbackKeys: JSON.stringify(fallbackKeys),
                    englishFallbackCount: fallbackKeys.length,
                    requestedLocaleValue
                }
            });
        }

        // Don't leak memory if the tab stays open forever.
        shouldLogUsage = false;
        keysUsed = {};
    }, 1000 * 60);
}
// End custom HubSpot Logic
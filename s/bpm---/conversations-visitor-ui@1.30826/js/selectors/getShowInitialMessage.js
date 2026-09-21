'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getIsOpen
} from './getIsOpen';
import {
    getPopOpenWelcomeMessage
} from './widgetDataSelectors/getPopOpenWelcomeMessage';
import {
    getIsMobile
} from '../selectors/getIsMobile';
import {
    getPopMessageOnSmallScreens
} from './widgetDataSelectors/getPopMessageOnSmallScreens';
import {
    getInitialMessageText
} from './widgetDataSelectors/getInitialMessageText';
import {
    getAvailabilityAwayMessage
} from '../availability/selectors/getAvailabilityAwayMessage';
import {
    getShouldHideWelcomeMessage
} from './getShouldHideWelcomeMessage';
import {
    getPopOpenWidget
} from './widgetDataSelectors/getPopOpenWidget';
import {
    getIsAIChatbot
} from './widgetDataSelectors/getIsAIChatbot';
import {
    getUsePillLauncher
} from '../widget-data/selectors/widgetDataSelectors';
export const getShowInitialMessage = createSelector([getPopOpenWelcomeMessage, getPopMessageOnSmallScreens, getInitialMessageText, getAvailabilityAwayMessage, getIsOpen, getIsMobile, getShouldHideWelcomeMessage, getPopOpenWidget, getIsAIChatbot, getUsePillLauncher], (popOpenWelcomeMessage, popMessageOnSmallScreens, initialMessage, awayMessage, isOpen, isMobile, shouldHideWelcomeMessage, popOpenWidget, isAIChatbot, usePillLauncher) => {
    if (shouldHideWelcomeMessage && !usePillLauncher) {
        return false;
    }
    if (usePillLauncher) {
        return Boolean(!awayMessage && !isOpen);
    }
    const popMessage = isMobile ? Boolean(popMessageOnSmallScreens) : popOpenWidget || Boolean(popOpenWelcomeMessage);
    return Boolean(popMessage && !!initialMessage && !awayMessage && !isOpen);
});
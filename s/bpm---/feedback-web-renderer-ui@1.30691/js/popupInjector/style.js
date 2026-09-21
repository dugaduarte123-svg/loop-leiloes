'use es6';

const ANIMATION_TIME = 0.4;
const CSAT_WIDTH = 350;
export const EXTENDED_CSAT_WIDTH = CSAT_WIDTH + 200;
const NPS_WIDTH = 480;
export const CALLOUT_MAX_WIDTH = 450;
const MAX_FEEDBACK_WIDTH = Math.max(NPS_WIDTH, CSAT_WIDTH, EXTENDED_CSAT_WIDTH, CALLOUT_MAX_WIDTH);

// this is the expanded size, there are no className changes on expansion
// so we have to assume it's always expanded
const CONVERSATIONS_WIDTH = 416;
// leadflows use 'em's, so this is approximate
const LEADFLOW_WIDTH = 420;
const PHONE_BREAK = 544;
const TABLET_BREAK = 768;
const PREVIEW_TABLET_BREAK = 600;
export const UI_ID = 'hs-feedback-ui';
export const FETCHER_ID = 'hs-feedback-fetcher';
export const EXTENDED_WIDTH_CLASS = 'hs-feedback-extended-width';
export const SHOWN_CLASS = 'hs-feedback-shown';
export const SLID_OUT_CLASS = 'hs-feedback-slid-out';
export const EXPANDED_CLASS = 'hs-feedback-expanded';
const createSlideAnimations = (suffix, yAxisDirectionalMultiplier) => `
  @keyframes feedback-slide-in-${suffix} {
    from {transform: translate(0, ${yAxisDirectionalMultiplier * 100}%);}
    to {transform: translate(0, 0);}
  }

  @keyframes feedback-slide-out-${suffix} {
    from {transform: translate(0, 0);}
    to {transform: translate(0, ${yAxisDirectionalMultiplier * 100}%);}
  }

  #${UI_ID}.${suffix} {
    animation-name: feedback-slide-in-${suffix};
  }

  #${UI_ID}.${suffix}.${SLID_OUT_CLASS} {
    animation-name: feedback-slide-out-${suffix};
    animation-fill-mode: forwards;
  }
`;
export const baseStyleSheet = `
  #${UI_ID} {
    animation-duration: ${ANIMATION_TIME}s;
    animation-timing-function: ease-out;
    display: none;
    height: 0;
    overflow: hidden;
    position: fixed;
    z-index: 2147483647;
    max-width: 100%;
  }

  .hubspot.space-sword #${UI_ID} {
    /* TODO: replace the 1211 with z-index token once available from Trellis (issue: https://git.hubteam.com/HubSpot/foundations-theming/issues/233) */
    z-index: ${window.hsFeedbackWebZIndex || 1211};
  }

  #${UI_ID}.${SHOWN_CLASS} {
    display: block;
  }

  #${FETCHER_ID} {
    display: none
  }

  ${createSlideAnimations('hs-feedback-left', 1)}
  ${createSlideAnimations('hs-feedback-right', 1)}
  ${createSlideAnimations('hs-feedback-top', -1)}

  #${UI_ID} > iframe {
    width: 100%;
    height: 100%;
  }

  #${UI_ID}:not(.hs-feedback-top) {
    bottom: 0;
  }

  #${UI_ID}.hs-feedback-left {
    left: 0;
  }

  #${UI_ID}.hs-feedback-right {
    right: 0;
  }

  .zorse #${UI_ID}:not(.hs-feedback-top) {
    bottom: 6px;
  }

  .zorse #${UI_ID}.hs-feedback-right {
    right: 0;
  }

  #${UI_ID}.hs-feedback-top {
    left: 0;
    top: 0;
    width: 100%;
  }

  #${UI_ID}.hs-feedback-nps:not(.hs-feedback-top) {
    width: ${NPS_WIDTH}px;
  }

  #${UI_ID}.hs-feedback-csat:not(.hs-feedback-top) {
    width: ${CSAT_WIDTH}px;
  }

  #${UI_ID}.hs-feedback-csat.${EXTENDED_WIDTH_CLASS}:not(.hs-feedback-top) {
    width: ${EXTENDED_CSAT_WIDTH}px;
  }

  #${UI_ID}.hs-feedback-csat:not(.hs-feedback-top):not(.${EXPANDED_CLASS}):not(.hs-feedback-mobile) {
    width: ${CALLOUT_MAX_WIDTH}px;
  }

  #${UI_ID}.hs-feedback-csat.${EXTENDED_WIDTH_CLASS}:not(.hs-feedback-top) {
    width: ${EXTENDED_CSAT_WIDTH}px !important;
  }

  #${UI_ID}.preview.hs-feedback-csat.hs-feedback-callout:not(.${EXPANDED_CLASS}):not(.hs-feedback-top) {
    width: ${CALLOUT_MAX_WIDTH}px !important;
  }

  #${UI_ID}:not(.preview):not(.hs-feedback-callout):not(.hs-feedback-top):not(.hs-feedback-desktop),
  #${UI_ID}.${EXPANDED_CLASS}:not(.preview):not(.hs-feedback-top):not(.hs-feedback-desktop) {
    width: 100% !important;
  }

  @media only screen and (max-width: ${PREVIEW_TABLET_BREAK}px) {
    #${UI_ID}.preview:not(.hs-feedback-top),
    #${UI_ID}.${EXPANDED_CLASS}.preview:not(.hs-feedback-top) {
      width: 100% !important;
    }
  }

  #${UI_ID}.${SHOWN_CLASS} ~ #tally-widget-container,
  #${UI_ID}.${SHOWN_CLASS} ~ #wootric-modal {
    display: none !important;
  }

  /* hide all popups in the same position as us */
  #${UI_ID}.hs-feedback-right.${SHOWN_CLASS}:not(.hs-feedback-mobile) ~ #hubspot-messages-iframe-container,
  #${UI_ID}.hs-feedback-right.${SHOWN_CLASS}:not(.hs-feedback-mobile) ~ .leadinModal-theme-bottom-right-corner,
  #${UI_ID}.hs-feedback-left.${SHOWN_CLASS}:not(.hs-feedback-mobile)  ~ .leadinModal-theme-bottom-left-corner,
  #${UI_ID}.hs-feedback-top.${SHOWN_CLASS}:not(.hs-feedback-mobile)   ~ .leadinModal-theme-top {
    display: none !important;
  }

  /* hide leadflows when we're tablet-stretched across from them */
  @media only screen and (min-width: ${PHONE_BREAK}px) and (max-width: ${Math.max(TABLET_BREAK, MAX_FEEDBACK_WIDTH + LEADFLOW_WIDTH)}px) {
    #${UI_ID}.hs-feedback-left.${SHOWN_CLASS}  ~ .leadinModal-theme-bottom-right-corner,
    #${UI_ID}.hs-feedback-right.${SHOWN_CLASS} ~ .leadinModal-theme-bottom-left-corner {
      display: none !important;
    }
  }

  /* hide messages when we're tablet-stretched across from them */
  @media only screen and (max-width: ${Math.max(TABLET_BREAK, MAX_FEEDBACK_WIDTH + CONVERSATIONS_WIDTH)}px) {
    #${UI_ID}.hs-feedback-left.${SHOWN_CLASS} ~ #hubspot-messages-iframe-container {
      display: none !important;
    }
  }


  /* repeat above rules for small screens when we're set to display on mobile */
  #${UI_ID}.hs-feedback-mobile.hs-feedback-right.${SHOWN_CLASS}:not(.hs-feedback-no-mobile) ~ #hubspot-messages-iframe-container,
  #${UI_ID}.hs-feedback-mobile.hs-feedback-left.${SHOWN_CLASS}:not(.hs-feedback-no-mobile)  ~ #hubspot-messages-iframe-container,
  #${UI_ID}.hs-feedback-mobile.hs-feedback-right.${SHOWN_CLASS}:not(.hs-feedback-no-mobile) ~ .leadinModal-theme-bottom-right-corner,
  #${UI_ID}.hs-feedback-mobile.hs-feedback-left.${SHOWN_CLASS}:not(.hs-feedback-no-mobile)  ~ .leadinModal-theme-bottom-left-corner,
  #${UI_ID}.hs-feedback-mobile.hs-feedback-top.${SHOWN_CLASS}:not(.hs-feedback-no-mobile)   ~ .leadinModal-theme-top,
  #${UI_ID}.hs-feedback-mobile.hs-feedback-left.${SHOWN_CLASS}:not(.hs-feedback-no-mobile)  ~ .leadinModal-theme-bottom-right-corner,
  #${UI_ID}.hs-feedback-mobile.hs-feedback-right.${SHOWN_CLASS}:not(.hs-feedback-no-mobile) ~ .leadinModal-theme-bottom-left-corner {
    display: none !important;
  }

  /* don't display us on small screens if we're set to not display on mobile */
  #${UI_ID}.hs-feedback-mobile.hs-feedback-no-mobile {
    display: none;
  }
`;
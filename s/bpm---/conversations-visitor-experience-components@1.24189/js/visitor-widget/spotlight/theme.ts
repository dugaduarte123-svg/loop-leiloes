import { WHITE, NEUTRAL_750, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import { hexToRgba } from 'visitor-ui-component-library/utils/hexToRgba';

/** #FF4800 — primary brand orange, unread indicators */
const ORANGE = '#FF4800';

/**
 * Design tokens for Spotlight form-factor components.
 *
 * Source of truth: https://git.hubteam.com/pages/fosullivan/AI-SDR-Storybook/
 */
export const spotlightTheme = {
  /**
   * 4-based spacing scale.
   * @see https://git.hubteam.com/pages/fosullivan/AI-SDR-Storybook/?path=/story/foundations-design-tokens--spacing
   * @example margin-bottom: ${spotlightTheme.spacing.sm}
   */
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    xxxxl: '40px'
  },
  /**
   * Border radius scale.
   * @see https://git.hubteam.com/pages/fosullivan/AI-SDR-Storybook/?path=/story/foundations-design-tokens--radii
   */
  borderRadius: {
    /** icon buttons, dropdowns */
    sm: '8px',
    /** color swatches, booking card */
    md: '10px',
    /** widget shell, booking card body */
    lg: '12px',
    /** widget shell corners */
    xl: '16px',
    /** confirm button, time slots, duration pills, user bubble */
    pill: '9999px'
  },
  /**
   * Typography scale.
   * @see https://git.hubteam.com/pages/fosullivan/AI-SDR-Storybook/?path=/story/foundations-design-tokens--typography
   */
  typography: {
    fontSize: {
      /** widget subtitle, uppercase labels */
      xs: '11px',
      /** reasoning / meta */
      sm: '11.5px',
      /** slots / calendar, calendar days */
      md: '12px',
      /** confirm button, status title */
      lg: '13px',
      /** ask suggestions */
      lgHalf: '13.5px',
      /** widget title, message body, user bubble */
      xl: '14px',
      /** gallery count overlay */
      xxl: '22px'
    },
    fontWeight: {
      regular: 400,
      /** calendar days */
      semibold: 600,
      /** uppercase labels */
      bold: 700
    },
    lineHeight: {
      /** body text */
      md: '18px',
      /** larger body text */
      lg: '20px'
    }
  },
  /**
   * Brand and semantic colors.
   * @see https://git.hubteam.com/pages/fosullivan/AI-SDR-Storybook/?path=/story/foundations-design-tokens--colours
   */
  color: {
    /** card and panel surfaces */
    surface: WHITE,
    // Brand
    /** #FF4800 — primary brand orange, unread indicators */
    orange: ORANGE,
    /** primary text */
    ink: NEUTRAL_1600,
    /** #6b7280 — secondary / muted text */
    muted: '#6b7280',
    // Surface
    /** #fafafa — default background */
    bg: '#fafafa',
    /** #e5e7eb — borders, dividers */
    border: '#e5e7eb',
    /** #F0F0F0 — user message bubble background */
    userBubble: '#F0F0F0',
    /** #8A8A8A — selected stroke */
    selectedStroke: '#8A8A8A',
    // Semantic
    success: '#16a34a',
    successBg: '#dcfce7',
    error: '#dc2626',
    errorBg: '#fee2e2',
    // Widget chrome
    /** rgba(0,0,0,0.85) — primary message text */
    messageText: 'rgba(0,0,0,0.85)',
    /** muted chrome elements (≥4.5:1 on white, WCAG AA) */
    mutedChrome: NEUTRAL_750
  },
  /**
   * Elevation shadows.
   */
  shadow: {
    /** Two-layer widget shell shadow — large diffused lift + thin crisp definition */
    card: '0 4px 24px #0000001a, 0 1px 6px #0000000f',
    /** Dropdown / popover */
    popover: '0 2px 8px #00000014',
    /** Ask-bar / launcher hover state, non-glowing */
    hover: '0 1px 16px 0 #e6e6e6'
  },
  /**
   * Z-index layers.
   */
  zIndex: {
    /** 9999 — overlays, popovers, floating cards */
    overlay: 9999,
    /** 99999 — lightbox and fullscreen overlays; must beat all other widget elements */
    lightbox: 99999
  }
};

/**
 * Two-layer glow for the Spotlight ask-bar's active (pulsed) state, plus an ambient drop
 * shadow. Padding reserved around the launcher when the glow is showing (see
 * WidgetWrapper, spacing.xxxl) is deliberately smaller than this glow's ~38px max reach —
 * visually confirmed acceptable.
 */
export const getGlowShadow = color => `0 0 16px 12px ${hexToRgba(color, 0.35)}, 0 0 24px 14px ${hexToRgba(color, 0.2)}, 0 2px 12px rgba(0, 0, 0, 0.08)`;

/**
 * Dimmer resting state the glow pulses from; also the static (smaller) glow shown once the
 * ask-bar is expanded.
 */
export const getGlowShadowDim = color => `0 0 8px 2px ${hexToRgba(color, 0.15)}, 0 0 14px 4px ${hexToRgba(color, 0.08)}, 0 2px 12px rgba(0, 0, 0, 0.08)`;
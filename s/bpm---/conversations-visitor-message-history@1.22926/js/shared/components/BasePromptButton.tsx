import { css } from 'styled-components';
export const MAX_PROMPT_BUTTON_WIDTH = 384;
export const promptButtonCoreStyles = css(["display:inline-flex;align-items:center;padding:7px 10px;border-radius:10px;font-weight:600;font-size:12px;line-height:18px;text-align:left;box-sizing:border-box;word-break:break-word;transition:color 0.2s ease,border-color 0.2s ease,opacity 0.2s ease;"]);
export const promptButtonFixedWidthStyles = css(["max-width:", "px;width:max-content;"], MAX_PROMPT_BUTTON_WIDTH);
export const promptButtonFlexibleWidthStyles = css(["max-width:100%;"]);
export const promptButtonBaseStyles = css(["", " ", ""], promptButtonCoreStyles, promptButtonFixedWidthStyles);
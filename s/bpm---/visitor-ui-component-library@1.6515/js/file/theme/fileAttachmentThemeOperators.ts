import { getDisabledTextColor, getDisabledBackgroundColor, getTextColor } from '../../theme/defaultThemeOperators';
import { GYPSUM, KOALA } from '../../constants/WidgetColors';
export const getFileAttachmentProcessingTextColor = getDisabledTextColor;
export const getFileAttachmentProcessingBackgroundColor = getDisabledBackgroundColor;
export const getFileAttachmentTextColor = getTextColor;
export const getFileAttachmentBackgroundColor = () => GYPSUM;
export const getFileAttachmentBorderColor = () => KOALA;
import { I18N_LABELS } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export const handleI18nLabels = data => postMessageToParent(I18N_LABELS, data);
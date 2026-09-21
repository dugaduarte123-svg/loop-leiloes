import { PILL, DEFAULT } from 'conversations-internal-schema/widget-data/constants/launcherTypes';
export const getUsePillLauncher = ({
  isAIChatBot,
  isClosingAgentSystemChatflow = false,
  launcherType,
  mobile
}) => (isAIChatBot || isClosingAgentSystemChatflow) && (launcherType === PILL || launcherType === DEFAULT) && !mobile;
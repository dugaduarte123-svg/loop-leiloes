import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import InitialMessageAvatars from './components/InitialMessageAvatars';
import styled from 'styled-components';
import { SMALL, MEDIUM_SMALL } from 'visitor-ui-component-library/constants/sizes';
import { jsx as _jsx } from "react/jsx-runtime";
const getAvatarHeightAboveBubble = isMobile => isMobile ? AVATAR_SIZES[SMALL] - 16 : AVATAR_SIZES[MEDIUM_SMALL] - 16;
const IconWrapper = styled.div.withConfig({
  displayName: "WelcomeMessageAvatars__IconWrapper"
})(["display:inline-flex;vertical-align:middle;position:absolute;left:50%;top:", ";transform:translateX(-50%);"], ({
  mobile
}) => `-${getAvatarHeightAboveBubble(mobile)}px`);
const WelcomeMessageAvatars = ({
  chatHeadingConfig,
  chatHeadingResponders,
  mobile
}) => {
  return /*#__PURE__*/_jsx(IconWrapper, {
    mobile: mobile,
    children: /*#__PURE__*/_jsx(InitialMessageAvatars, {
      chatHeadingConfig: chatHeadingConfig,
      chatHeadingResponders: chatHeadingResponders,
      mobile: mobile
    })
  });
};
WelcomeMessageAvatars.displayName = 'WelcomeMessageAvatar';
export default WelcomeMessageAvatars;
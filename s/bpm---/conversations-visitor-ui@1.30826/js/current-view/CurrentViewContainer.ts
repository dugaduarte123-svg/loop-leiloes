import { hasMinimumMobileSdkVersion } from 'visitor-ui-component-library/utils/isInSDK';
import { connect } from 'react-redux';
import { getEnableSdkCloseButton } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import CurrentView from './CurrentView';
import { getCurrentView } from './selectors/getCurrentView';
const mapStateToProps = state => {
  return {
    currentView: getCurrentView(state),
    enableSdkCloseButton: getEnableSdkCloseButton(state) && hasMinimumMobileSdkVersion({
      minMajor: 1,
      minMinor: 0,
      minPatch: 6
    })
  };
};
export default connect(mapStateToProps)(CurrentView);
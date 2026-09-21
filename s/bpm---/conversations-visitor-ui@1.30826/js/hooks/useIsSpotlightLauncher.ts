import { useSelector } from 'react-redux';
import { getUseSpotlightLauncher } from '../widget-data/selectors/widgetDataSelectors';
const useIsSpotlightLauncher = () => useSelector(getUseSpotlightLauncher);
export default useIsSpotlightLauncher;
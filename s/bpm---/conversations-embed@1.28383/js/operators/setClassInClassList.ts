import { LEFT_ALIGNED, RIGHT_ALIGNED } from '../constants/widgetLocation';
import { ALIGNED_LEFT_CLASS, ALIGNED_RIGHT_CLASS } from '../constants/widgetClassNames';
const classNames = {
  [LEFT_ALIGNED]: ALIGNED_LEFT_CLASS,
  [RIGHT_ALIGNED]: ALIGNED_RIGHT_CLASS
};
export const setClassInClassList = ({
  widgetLocation,
  classList
}) => {
  const widgetLocationClass = classNames[widgetLocation];
  if (classList.contains(widgetLocationClass)) {
    return;
  }
  const otherLocations = Object.keys(classNames).filter(className => className !== widgetLocation);
  otherLocations.forEach(location => {
    classList.remove(location);
  });
  classList.add(widgetLocationClass);
};
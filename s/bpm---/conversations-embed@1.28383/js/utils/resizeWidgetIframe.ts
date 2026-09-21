import { PARENT_ID } from '../constants/elementSelectors';
export const resizeWidgetIframe = ({
  height,
  width
}) => {
  const parent = document.getElementById(PARENT_ID);
  if (!parent || !width || !height) return;
  parent.style.width = `${width}px`;
  parent.style.height = `${height}px`;
};
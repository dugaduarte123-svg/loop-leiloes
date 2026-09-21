const defaultWidgetColoring = {
  accentColor: '',
  textColor: '',
  useDefaultColor: false
};
const WidgetColoring = widgetColoringOptions => Object.assign({}, defaultWidgetColoring, widgetColoringOptions);
export default WidgetColoring;
import { METHODS } from '../constants/unsupportedFramework';
export const isUsingUnsupportedFramework = () => {
  // Check methods that are added/overwritten by frameworks
  // these methods cause issues that do not allow allow the visitor UI to render
  const overriddenMethods = METHODS.filter(method => !!method).length;
  return Boolean(overriddenMethods);
};
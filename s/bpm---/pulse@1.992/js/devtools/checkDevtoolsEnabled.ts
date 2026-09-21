import { DEVTOOLS_LOCAL_STORAGE_KEY, DEVTOOLS_PRINT_LOGS_TO_CONSOLE } from './sharedConstants';
export const checkDevtoolsEnabled = () => {
  try {
    return !!localStorage.getItem(DEVTOOLS_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('Error checking devtools enabled', error);
    return false;
  }
};
export const checkPrintToConsole = () => {
  try {
    return !!localStorage.getItem(DEVTOOLS_PRINT_LOGS_TO_CONSOLE);
  } catch (error) {
    console.error('Error checking print logs to console', error);
  }
};
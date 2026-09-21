import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["component"];
import { checkDevtoolsEnabled, checkPrintToConsole } from './checkDevtoolsEnabled';
import { safe } from './safe';
export const createLogger = ({
  devtoolsEnabled = checkDevtoolsEnabled(),
  printToConsole = checkPrintToConsole(),
  logs = [],
  defaultTags = {}
} = {}) => {
  if (!devtoolsEnabled && !printToConsole) {
    return undefined;
  }
  let onLog;
  const makeLog = level => (message, tags) => {
    if (!devtoolsEnabled && !printToConsole) {
      return;
    }
    safe(() => {
      const baseMergedTags = Object.assign({}, defaultTags, tags);
      const mergedTags = baseMergedTags;
      const now = Date.now();
      if (devtoolsEnabled) {
        var _onLog;
        const log = {
          timestamp: now,
          message,
          level,
          tags: mergedTags
        };
        logs.push(log);
        (_onLog = onLog) === null || _onLog === void 0 || _onLog(log);
      }
      if (printToConsole) {
        const {
            component
          } = mergedTags,
          restTags = _objectWithoutPropertiesLoose(mergedTags, _excluded);
        const baseString = `${now} [${component || 'unknown'}] ${message}`;
        console[level](`${baseString} ${mergedTags !== null && mergedTags !== void 0 && mergedTags.instanceKey ? `| ${mergedTags.instanceKey}` : ''} | ${Object.entries(restTags).map(([key, value]) => `${key}: ${value}`).join(', ')}`);
      }
    });
  };
  return {
    debug: makeLog('debug'),
    info: makeLog('info'),
    warn: makeLog('warn'),
    error: makeLog('error'),
    attachDevtools: cb => {
      onLog = cb;
    },
    withTags: tags => {
      const logger = createLogger({
        devtoolsEnabled,
        printToConsole,
        logs,
        defaultTags: Object.assign({}, defaultTags, tags)
      });
      if (onLog) {
        logger.attachDevtools(onLog);
      }
      return logger;
    }
  };
};
class DevLogger {
  constructor({
    debug
  } = {}) {
    this._debug = Boolean(debug);
    this.debug = this.debug.bind(this);
  }
  _isDebugMode() {
    return this._debug;
  }

  /*
   * Toggles the logger's debug mode
   * @param {boolean} debugMode - whether to turn debug on or off
   */
  debug(debugMode) {
    this._debug = debugMode;
  }

  /*
   * Log a message if in debug mode
   * @param {string} message - the message to log
   */
  log(message) {
    if (!this._isDebugMode()) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`${DevLogger.LOGGING_PREFIX} ${message}`);
  }

  /*
   * Log an error if in debug mode
   * @param {string} message - the error to log
   */
  error(message) {
    if (!this._isDebugMode()) {
      return;
    }

    // eslint-disable-next-line no-console
    console.error(`${DevLogger.LOGGING_PREFIX} ${message}`);
  }
}
DevLogger.LOGGING_PREFIX = 'HubSpot Conversations log:';
export default DevLogger;
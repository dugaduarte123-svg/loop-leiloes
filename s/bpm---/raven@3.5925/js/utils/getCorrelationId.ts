"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCorrelationIdFromResponse = getCorrelationIdFromResponse;
exports.getCorrelationIdFromServerTiming = getCorrelationIdFromServerTiming;
exports.getCorrelationIdFromXHR = getCorrelationIdFromXHR;
/**
 * The server-timing header is a string which represents a map that looks like this:
 * "cache;desc="Cache Read";dur=23.2, hcid;desc="445b7839-9a35-4c18-ba6e-4251e0b20c96""
 *
 * hcid is the correlation id we are interested in.
 */
function getCorrelationIdFromServerTiming(serverTiming) {
  var _valueEntry$split$;
  const hcidEntry = serverTiming.split(',').find(entry => {
    return entry.trim().startsWith('hcid;');
  });
  if (!hcidEntry) {
    return null;
  }
  const valueEntry = hcidEntry.split(';').find(entry => {
    return entry.trim().startsWith('desc=');
  });
  if (!valueEntry) {
    return null;
  }
  const value = (_valueEntry$split$ = valueEntry.split('=')[1]) === null || _valueEntry$split$ === void 0 ? void 0 : _valueEntry$split$.trim();
  if (!value) {
    return null;
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value);
  }
  return value;
}

/**
 * Instead of using xhr.getResponseHeader, we need to use xhr.getAllResponseHeaders
 * to avoid the warning message some browsers report to the console when the header
 * is blocked by CORS.
 */
function getCorrelationIdFromXHR(xhr) {
  const allHeaders = xhr.getAllResponseHeaders().split('\r\n');

  // First try to get correlation ID from X-HubSpot-Correlation-Id header
  const xHubspotCorrelationIdHeader = allHeaders.find(header => {
    return header.toLowerCase().startsWith('x-hubspot-correlation-id');
  });
  if (xHubspotCorrelationIdHeader) {
    const correlationId = xHubspotCorrelationIdHeader.slice('x-hubspot-correlation-id: '.length).trim();
    if (correlationId) {
      return correlationId;
    }
  }

  // Fallback to Server-Timing header for backward compatibility
  const serverTimingHeader = allHeaders.find(header => {
    return header.toLowerCase().startsWith('server-timing');
  });
  if (!serverTimingHeader) {
    return null;
  }
  return getCorrelationIdFromServerTiming(serverTimingHeader.slice('Server-Timing: '.length));
}

/**
 * Similar to getCorrelationIdFromXHR, but for fetch responses.
 */
function getCorrelationIdFromResponse(response) {
  var _find;
  // First try to get correlation ID from X-HubSpot-Correlation-Id header
  const xHubspotCorrelationId = response.headers.get('x-hubspot-correlation-id');
  if (xHubspotCorrelationId) {
    return xHubspotCorrelationId;
  }

  // Fallback to Server-Timing header for backward compatibility
  const serverTimingHeader = (_find = [...response.headers.entries()].find(([key]) => key.toLowerCase() === 'server-timing')) === null || _find === void 0 ? void 0 : _find[1];
  if (!serverTimingHeader) {
    return null;
  }
  return getCorrelationIdFromServerTiming(serverTimingHeader);
}
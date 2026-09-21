import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["enabledGates", "enabledV3Gates"],
  _excluded2 = ["enabled_gates", "enabled_v3_gates"];
/** The raw response from `login-verify/hub-user-info`.
 *
 * This should only be used by passing to {@link transformUserInfoResponse}.
 */

/** The raw response from `login-verify/user-info`.
 *
 * This should only be used by passing to {@link transformHublessUserInfoResponse}. */

function transformGates(v2Gates, v3Gates) {
  return [...(v2Gates || []), ...(v3Gates || []).map(gate =>
  // eslint-disable-next-line hubspot-dev/no-bare-gate-strings
  `g8:${gate}`)];
}
export function transformHublessUserInfoResponse(response) {
  const {
      enabledGates,
      enabledV3Gates
    } = response,
    responseWithoutGates = _objectWithoutPropertiesLoose(response, _excluded);
  return Object.assign({}, responseWithoutGates, {
    enabledGates: transformGates(enabledGates, enabledV3Gates)
  });
}
export function transformUserInfoResponse({
  auth,
  portal,
  user
}) {
  const {
      enabled_gates: enabledGates,
      enabled_v3_gates: enabledV3Gates
    } = portal,
    portalWithoutGates = _objectWithoutPropertiesLoose(portal, _excluded2);
  const gates = transformGates(enabledGates, enabledV3Gates);
  const info = {
    user,
    gates,
    portal: Object.assign({}, portalWithoutGates, {
      enabled_gates: gates
    })
  };
  if (auth) {
    info.auth = auth;
  }
  return info;
}
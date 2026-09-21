export const getPortalId = () => {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return parseInt(scriptElement.getAttribute('data-hsjs-portal'), 10);
};
export const getMessagesEnv = () => {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return scriptElement.getAttribute('data-hsjs-env');
};
export const getMessagesHublet = () => {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return scriptElement.getAttribute('data-hsjs-hublet');
};
export const getIsLocal = () => {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return scriptElement.getAttribute('data-hsjs-local') === 'true';
};
export function getScriptEnvParams() {
  const scriptElement = document.getElementById('hubspot-messages-loader');
  return {
    ungatedFor: scriptElement.getAttribute('ungated-for'),
    portalId: getPortalId(),
    messagesEnv: getMessagesEnv(),
    messagesHublet: getMessagesHublet(),
    isLocal: getIsLocal()
  };
}
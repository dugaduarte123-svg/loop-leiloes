export function getIsAiCopilotEnabled() {
  return Boolean(document.querySelector('iframe[name="nav-components:chatspot-sidebar"]'));
}
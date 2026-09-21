import { buildCmsScriptLoaderSrc } from './buildCmsScriptLoaderSrc';
export const buildCmsScriptLoaderPath = ({
  portalId
}) => {
  const scriptSrc = buildCmsScriptLoaderSrc({
    portalId
  });
  return `${document.location.origin}${scriptSrc}`;
};
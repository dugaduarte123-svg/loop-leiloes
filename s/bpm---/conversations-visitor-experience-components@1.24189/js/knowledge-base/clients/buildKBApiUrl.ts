export function buildKBApiUrl(domain, endpoint, params) {
  const url = new URL(`https://${domain}/_hcms/livechat/kb/proxy/${endpoint}`);
  const searchParams = new URLSearchParams();
  searchParams.set('knowledgeBaseId', params.knowledgeBaseId.toString());
  if (params.portalId) {
    searchParams.set('portalId', params.portalId.toString());
  }
  if (params.categoryId) {
    searchParams.set('categoryId', params.categoryId.toString());
  }
  if (params.identificationToken) {
    searchParams.set('identificationToken', params.identificationToken);
  }
  if (params.email) {
    searchParams.set('email', params.email);
  }
  url.search = searchParams.toString();
  return url.toString();
}
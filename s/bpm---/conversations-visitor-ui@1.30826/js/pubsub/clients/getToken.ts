import noAuthHttp from '../../http/noAuthApiClient';
export const getToken = ({
  sessionId,
  hubspotUtk
}) => noAuthHttp.get('livechat-public/v1/pubsub/token/visitor', {
  query: {
    sessionId,
    hubspotUtk
  }
});
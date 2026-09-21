import { Map as ImmutableMap } from 'immutable';
import invariant from 'react-utils/invariant';
import * as senderTypes from '../constants/cmfSenderTypes';
import { getSenderKeyFromType } from './getSenderKeyFromType';
const senderTypeValues = Object.keys(senderTypes).map(key => senderTypes[key]);
export const buildSender = ({
  senderType,
  senderId
}) => {
  invariant(senderTypeValues.includes(senderType), `Invalid sender type. Should be one of ${senderTypeValues.join(' | ')}. Received %s`, senderType);
  const senderIdKey = getSenderKeyFromType(senderType);
  if (senderIdKey === null) {
    return ImmutableMap({
      '@type': senderType
    });
  }
  return ImmutableMap({
    '@type': senderType,
    [senderIdKey]: senderId
  });
};
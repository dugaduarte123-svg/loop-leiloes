import { defineResource } from 'pulse/resources';
import { fromPromise } from 'pulse/adapters';
import { resolveThreadAttachmentsClient } from '../clients/resolveThreadAttachmentsClient';
const resolveThreadAttachmentsResolver = fromPromise('resolveThreadAttachments', params => resolveThreadAttachmentsClient(params));
export const ResolveThreadAttachments = defineResource({
  typeName: 'conversations-visitor-ui:ResolveThreadAttachments',
  resolver: resolveThreadAttachmentsResolver,
  args: ['threadId', 'sessionId', 'fileIds']
}).register();
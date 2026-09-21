import get from 'transmute/get';
export const fileIsUploadingInThread = ({
  localId,
  threadId
}, state) => {
  const threadUploads = get(threadId, state);
  return !!threadUploads && !!get(localId, threadUploads);
};
export const createFormDataForAttachment = ({
  file
}) => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};
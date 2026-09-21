export const generateIdForFile = ({
  file,
  timestamp
}) => {
  const safeFileName = file ? file.name : '';
  return `${safeFileName}-${timestamp}`;
};
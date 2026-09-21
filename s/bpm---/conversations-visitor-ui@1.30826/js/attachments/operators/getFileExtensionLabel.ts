export const getFileExtensionLabel = file => {
  if (!file) return undefined;
  const dotIndex = file.name.lastIndexOf('.');
  return dotIndex > 0 ? file.name.slice(dotIndex + 1).toUpperCase() : undefined;
};
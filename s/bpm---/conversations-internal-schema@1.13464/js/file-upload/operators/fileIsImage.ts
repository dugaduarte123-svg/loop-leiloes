const IMAGE_EXTENSIONS = ['PNG', 'GIF', 'JPEG', 'JPG'];
export const fileIsImage = file => {
  const name = file.name;
  const nameParts = name.split('.');
  const extension = nameParts[nameParts.length - 1] || '';
  return IMAGE_EXTENSIONS.indexOf(extension.toUpperCase()) !== -1;
};
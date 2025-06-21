const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

function validateImage(file) {
  if (!file) return 'No file uploaded';
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return 'Only JPG and PNG images are allowed';
  }
  if (file.size > MAX_SIZE) {
    return 'File size exceeds 2MB';
  }
  return null;
}

export default validateImage; 
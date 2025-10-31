// Helper function to sanitize filenames
export default function sanitizeFileName(fileName) {
  return fileName
    .normalize("NFD") // normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-zA-Z0-9.-_]/g, "_"); // replace invalid chars with underscore
}

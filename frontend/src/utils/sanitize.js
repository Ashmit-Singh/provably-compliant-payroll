// Simple input sanitization for frontend forms
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.trim()
    .replace(/\.{2,}/g, '') // Remove path traversal
    .replace(/</g, '&lt;')   // Escape HTML
    .replace(/>/g, '&gt;');
}

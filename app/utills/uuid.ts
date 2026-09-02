export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older mobile browsers
  return 'id-' + Math.random().toString(36).substring(2, 11);
}

// El backend devuelve rutas relativas (ej. "/uploads/photos/x.jpg") y sirve
// los archivos con express.static en el mismo host que la API. Resolvemos la
// URL absoluta prefijando el origin de VITE_API_URL.
const API_ORIGIN = (() => {
  try {
    return new URL(import.meta.env.VITE_API_URL).origin;
  } catch {
    return "";
  }
})();

export const resolvePhotoUrl = (
  path: string | null | undefined,
): string | null => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ORIGIN}${path}`;
};
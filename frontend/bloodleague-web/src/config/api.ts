export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const getApiUrl = (path: string) => {
  // Eliminar barra inicial si existe para evitar dobles barras
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
};
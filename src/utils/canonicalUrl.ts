export const canonicalUrl = (path: string, fullPath: boolean = false): string => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return fullPath ? `${baseUrl}${path}` : `${path}`;
}
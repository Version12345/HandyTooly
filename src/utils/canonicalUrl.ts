export const canonicalUrl = (path: string, fullPath: boolean = true): string => {
  const baseUrl = process.env.BASE_URL;
  return fullPath ? `${baseUrl}${path}` : `${path}`;
}
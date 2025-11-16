export function formatDate(d?: string) {
  return d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '';
}
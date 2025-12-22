/**
 * Utility functions for file import and export operations
 */

/**
 * Import text file content with specified file types
 * @param acceptedTypes - Comma-separated file extensions (e.g., '.txt,.md,.csv')
 * @param onFileLoad - Callback function to handle the loaded file content
 */
export const importFromFile = (
  acceptedTypes: string = '.txt,.md,.html,.css,.js,.json,.xml,.csv',
  onFileLoad: (content: string, filename?: string) => void
) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = acceptedTypes;
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileLoad(text, file.name);
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

/**
 * Export content as a downloadable file
 * @param content - The content to save
 * @param filename - The name of the file to save
 * @param contentType - MIME type of the content (default: 'text/plain')
 */
export const exportToFile = (
  content: string,
  filename: string,
  contentType: string = 'text/plain'
) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
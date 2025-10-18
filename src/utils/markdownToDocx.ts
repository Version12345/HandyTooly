import { convertMarkdownToDocx, downloadDocx, Options } from "@mohtasham/md-to-docx";

export const options: Options = {
  documentType: "document",
  style: {
    titleSize: 32,
    headingSpacing: 240,
    paragraphSpacing: 200,
    lineSpacing: 1,
    heading1Size: 32,
    heading2Size: 28,
    heading3Size: 24,
    heading4Size: 20,
    heading5Size: 18,
    paragraphSize: 22,
    listItemSize: 24,
    codeBlockSize: 20,
    blockquoteSize: 24,
  },
};

export async function downloadAsDocx(markdown: string, documentType: string) {
  try {
    // Convert markdown to DOCX
    const blob = await convertMarkdownToDocx(markdown, options);
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `${documentType}_${timestamp}.docx`;
    
    // Download in browser
    downloadDocx(blob, filename);
  } catch (err) {
    console.error(`Failed to convert ${documentType} to DOCX:`, err);
    throw err; // Re-throw so calling component can handle the error
  }
}
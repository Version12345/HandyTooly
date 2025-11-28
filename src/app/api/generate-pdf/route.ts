import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    // Import html2canvas and jsPDF only on server side
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    // Create a temporary div element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 800px;
      background: white;
      padding: 40px;
      font-family: Arial, sans-serif;
    `;
    
    document.body.appendChild(tempDiv);

    // Capture the element as an image
    const canvas = await html2canvas(tempDiv, {
      width: 800,
      height: 1000,
      backgroundColor: '#ffffff',
    });

    // Remove the temporary element
    document.body.removeChild(tempDiv);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Get PDF as buffer
    const pdfBuffer = pdf.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="dividend-analysis.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
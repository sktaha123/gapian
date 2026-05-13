import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exports a list of ideas to CSV
 */
export function exportCSV(ideas, filename = 'gapian-results.csv') {
  if (!ideas || ideas.length === 0) return;
  const header = ['Title', 'Headline', 'Description', 'Score', 'Tags', 'Pricing', 'Audience'];
  const rows = ideas.map(i => [
    i.title, 
    i.headline, 
    i.description, 
    i.score, 
    (i.tags || []).join(' | '), 
    i.pricing, 
    i.audience
  ]);
  
  const csv = [header, ...rows]
    .map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
    
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports a list of ideas to PDF
 */
export function exportPDF(ideas, filename = 'gapian-results.pdf') {
  if (!ideas || ideas.length === 0) return;
  
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246); // Blue-500
  doc.text('GAPIAN', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(`AI Generated Digital Product Concepts • ${timestamp}`, 14, 30);

  const tableColumn = ["Product Title", "Headline", "Score", "Pricing"];
  const tableRows = ideas.map(idea => [
    idea.title,
    idea.headline,
    `${idea.score}/10`,
    idea.pricing
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 20 },
      3: { cellWidth: 30 }
    }
  });

  // Details Section (More detailed descriptions)
  let currentY = doc.lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('Detailed Descriptions', 14, currentY);
  currentY += 10;

  ideas.forEach((idea, index) => {
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(11);
    doc.setTextColor(59, 130, 246);
    doc.text(`${index + 1}. ${idea.title}`, 14, currentY);
    currentY += 6;
    
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(idea.description, 180);
    doc.text(splitDesc, 14, currentY);
    currentY += (splitDesc.length * 5) + 10;
  });

  doc.save(filename);
}

import jsPDF from 'jspdf';
import Equipment from '../models/Equipment';
import '../assets/fonts/Roboto-Black-normal';


export function generatePdf(equipments, template, fileName = 'report.pdf') {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  doc.setFont('Roboto-Black', 'normal');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const margin = 20;
  const gap = 15;
  
  const { cols, rows } = template;
  const stickersPerPage = cols * rows;
  
  const usableWidth = pageWidth - margin * 2 - gap * (cols - 1);
  const usableHeight = pageHeight - margin * 2 - gap * (rows - 1);
  const colWidth = usableWidth / cols;
  const rowHeight = usableHeight / rows;

  const fontSize = 5.7;
  const lineHeight = fontSize + 2;

  function drawEquipmentText(equipment, x, y) {
    if (!equipment) return;

    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    
    const lines = equipment.toString().split('\n');
    let currentY = y + lineHeight;
    
    lines.forEach((line) => {
      if (currentY + lineHeight > y + rowHeight) return;
      
      const maxWidth = colWidth - 10;
      const wrappedLines = doc.splitTextToSize(line, maxWidth);
      
      wrappedLines.forEach((wrappedLine) => {
        if (currentY + lineHeight <= y + rowHeight) {
          doc.text(wrappedLine, x + 5, currentY);
          currentY += lineHeight;
        }
      });
    });
  }

  for (let pageStart = 0; pageStart < equipments.length; pageStart += stickersPerPage) {
    if (pageStart > 0) {
      doc.addPage();
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const equipmentIndex = pageStart + row * cols + col;
        const equipment = equipmentIndex < equipments.length ? equipments[equipmentIndex] : null;
        
        const x = margin + col * (colWidth + gap);
        const y = margin + row * (rowHeight + gap);
        
        drawEquipmentText(equipment, x, y);
      }
    }
  }

  doc.save(fileName);
}

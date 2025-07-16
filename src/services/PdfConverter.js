import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const gap = 10;

  const { cols, rows } = template;
  const stickersPerPage = cols * rows;

  // Вычисляем размеры для строгой сетки
  const usableWidth = pageWidth - margin * 2 - gap * (cols - 1);
  const usableHeight = pageHeight - margin * 2 - gap * (rows - 1);
  const colWidth = usableWidth / cols;
  const rowHeight = usableHeight / rows;

  const baseFontSize = 10;
  const fontSize = baseFontSize / 1.75;
  doc.setFontSize(fontSize);

  function drawEquipmentTable(equipment, x, y) {
    if (!equipment) {
      // Рисуем пустую ячейку если оборудования нет
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(1);
      doc.rect(x, y, colWidth, rowHeight);
      return y + rowHeight;
    }

    const lines = equipment.toString().split('\n');
    const body = lines.map(line => [String(line)]);

    autoTable(doc, {
      startY: y,
      margin: { left: x, top: 0, right: 0, bottom: 0 },
      theme: 'grid',
      styles: {
        font: 'Roboto-Black',
        fontSize,
        cellPadding: 3,
        valign: 'middle',
        halign: 'left',
        overflow: 'linebreak',
      },
      tableWidth: colWidth,
      tableHeight: rowHeight, // Фиксированная высота
      head: [['']],
      body,
      columnStyles: {
        0: { cellWidth: colWidth - 10 }
      }
    });

    return y + rowHeight;
  }

  // Разбиваем оборудование по страницам
  for (let pageStart = 0; pageStart < equipments.length; pageStart += stickersPerPage) {
    if (pageStart > 0) {
      doc.addPage();
    }

    // Заполняем строго по сетке rows × cols
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const equipmentIndex = pageStart + row * cols + col;
        const equipment = equipmentIndex < equipments.length ? equipments[equipmentIndex] : null;

        const x = margin + col * (colWidth + gap);
        const y = margin + row * (rowHeight + gap);

        drawEquipmentTable(equipment, x, y);
      }
    }
  }

  doc.save(fileName);
}

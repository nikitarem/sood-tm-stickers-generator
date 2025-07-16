import jsPDF from 'jspdf';
import Equipment from '../models/Equipment';
import '../assets/fonts/PT_Sans-Web-Regular-normal';
import { PDF_SETTINGS } from '../config';

/**
 * Вычисляет размеры и позиции для стикеров на странице
 * 
 * @param {jsPDF} doc - Объект jsPDF документа
 * @param {Object} template - Шаблон с параметрами cols и rows
 * @returns {Object} Объект с размерами и расчетными параметрами
 */
function calculateLayout(doc, template) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const { cols, rows } = template;
  const stickersPerPage = cols * rows;
  
  const usableWidth = pageWidth - PDF_SETTINGS.MARGIN * 2 - PDF_SETTINGS.GAP * (cols - 1);
  const usableHeight = pageHeight - PDF_SETTINGS.MARGIN * 2 - PDF_SETTINGS.GAP * (rows - 1);
  const colWidth = usableWidth / cols;
  const rowHeight = usableHeight / rows;

  return {
    pageWidth,
    pageHeight,
    stickersPerPage,
    colWidth,
    rowHeight
  };
}

/**
 * Настраивает шрифт и стили для PDF документа
 * 
 * @param {jsPDF} doc - Объект jsPDF документа
 */
function setupDocumentStyles(doc) {
  doc.setFont(PDF_SETTINGS.FONT_FAMILY, PDF_SETTINGS.FONT_STYLE);
  doc.setFontSize(PDF_SETTINGS.FONT_SIZE);
  doc.setTextColor(0, 0, 0);
}

/**
 * Отрисовывает текст оборудования в указанной области стикера
 * 
 * @param {jsPDF} doc - Объект jsPDF документа
 * @param {Equipment} equipment - Объект оборудования для отрисовки
 * @param {number} x - X координата левого верхнего угла стикера
 * @param {number} y - Y координата левого верхнего угла стикера
 * @param {number} colWidth - Ширина колонки стикера
 * @param {number} rowHeight - Высота строки стикера
 */
function drawEquipmentText(doc, equipment, x, y, colWidth, rowHeight) {
  if (!equipment) return;

  const lineHeight = PDF_SETTINGS.FONT_SIZE + PDF_SETTINGS.LINE_HEIGHT_OFFSET;
  const lines = equipment.toString().split('\n');
  let currentY = y + lineHeight;
  
  lines.forEach((line) => {
    if (currentY + lineHeight > y + rowHeight) return;
    
    const maxWidth = colWidth - PDF_SETTINGS.TEXT_MARGIN;
    const wrappedLines = doc.splitTextToSize(line, maxWidth);
    
    wrappedLines.forEach((wrappedLine) => {
      if (currentY + lineHeight <= y + rowHeight) {
        doc.text(wrappedLine, x + PDF_SETTINGS.TEXT_PADDING, currentY);
        currentY += lineHeight;
      }
    });
  });
}

/**
 * Отрисовывает одну страницу стикеров
 * 
 * @param {jsPDF} doc - Объект jsPDF документа
 * @param {Equipment[]} equipments - Массив оборудования
 * @param {Object} template - Шаблон с параметрами cols и rows
 * @param {number} pageStart - Индекс первого элемента на странице
 * @param {Object} layout - Объект с размерами страницы
 */
function drawPage(doc, equipments, template, pageStart, layout) {
  const { cols, rows } = template;
  const { stickersPerPage, colWidth, rowHeight } = layout;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const equipmentIndex = pageStart + row * cols + col;
      const equipment = equipmentIndex < equipments.length ? equipments[equipmentIndex] : null;
      
      const x = PDF_SETTINGS.MARGIN + PDF_SETTINGS.LEFT_OFFSET + col * (colWidth + PDF_SETTINGS.GAP);
      const y = PDF_SETTINGS.MARGIN + row * (rowHeight + PDF_SETTINGS.GAP);
      
      drawEquipmentText(doc, equipment, x, y, colWidth, rowHeight);
    }
  }
}

/**
 * Генерирует PDF файл со стикерами оборудования
 * 
 * @param {Equipment[]} equipments - Массив объектов оборудования
 * @param {Object} template - Шаблон с параметрами cols и rows
 * @param {string} [fileName='report.pdf'] - Имя файла для сохранения
 * @throws {Error} При ошибке генерации PDF
 */
export function generatePdf(equipments, template, fileName = PDF_SETTINGS.DEFAULT_FILENAME) {
  const doc = new jsPDF({
    unit: PDF_SETTINGS.UNIT,
    format: PDF_SETTINGS.FORMAT,
  });

  setupDocumentStyles(doc);
  const layout = calculateLayout(doc, template);

  for (let pageStart = 0; pageStart < equipments.length; pageStart += layout.stickersPerPage) {
    if (pageStart > 0) {
      doc.addPage();
    }

    drawPage(doc, equipments, template, pageStart, layout);
  }

  doc.save(fileName);
}

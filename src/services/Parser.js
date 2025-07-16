import * as XLSX from 'xlsx';
import Equipment from '../models/Equipment';
import {
  MONTH_MAP,
  MONTH_NAMES,
  PERIOD_PATTERN,
  TIME_UNITS,
  REQUIRED_HEADERS,
  EXCEL_COLUMNS,
  ERROR_MESSAGES,
  FILE_CONSTRAINTS
} from '../config';

/**
 * Парсит строку месяца и года в объект Date
 * 
 * @param {string} monthStr - Название месяца на русском языке
 * @param {string} yearStr - Год в виде строки
 * @returns {Date|null} Объект Date или null, если парсинг не удался
 */
function parseDate(monthStr, yearStr) {
  if (!monthStr || !yearStr) return null;
  
  const monthLower = monthStr.trim().toLowerCase();
  const month = MONTH_MAP[monthLower];
  const year = parseInt(yearStr, 10);
  
  if (month === undefined || isNaN(year)) return null;
  
  return new Date(year, month, 1);
}

/**
 * Форматирует дату в строку вида "Месяц YYYY г."
 * 
 * @param {Date} date - Объект Date для форматирования
 * @returns {string} Отформатированная строка или пустая строка
 */
function formatDate(date) {
  if (!date) return '';
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()} г.`;
}

/**
 * Добавляет к дате указанный период (месяцы или годы)
 * 
 * @param {Date} date - Исходная дата
 * @param {string} periodStr - Строка с периодом (например, "12 месяцев" или "1 год")
 * @returns {Date} Новая дата с добавленным периодом или исходная дата
 */
function addPeriod(date, periodStr) {
  if (!date || !periodStr) return date;
  
  const period = periodStr.trim().toLowerCase();
  const match = period.match(PERIOD_PATTERN);
  
  if (!match) return date;

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const newDate = new Date(date.getTime());

  if (TIME_UNITS.YEARS.includes(unit)) {
    newDate.setFullYear(newDate.getFullYear() + value);
  } else if (TIME_UNITS.MONTHS.includes(unit)) {
    newDate.setMonth(newDate.getMonth() + value);
  }
  
  return newDate;
}

/**
 * Валидирует заголовки Excel файла
 * 
 * @param {Array} headers - Массив заголовков из первой строки
 * @throws {Error} Если заголовки не соответствуют требуемым
 */
function validateHeaders(headers) {
  if (!headers || headers.length < REQUIRED_HEADERS.length) {
    throw new Error(ERROR_MESSAGES.INVALID_HEADERS);
  }

  for (let i = 0; i < REQUIRED_HEADERS.length; i++) {
    const actualHeader = headers[i]?.toString().trim().toLowerCase();
    const expectedHeader = REQUIRED_HEADERS[i].toLowerCase();
    
    if (actualHeader !== expectedHeader) {
      throw new Error(
        `Неверный формат заголовков. Ожидалось "${REQUIRED_HEADERS[i]}" на позиции ${i + 1}, найдено "${headers[i]}".`
      );
    }
  }
}

/**
 * Обрабатывает одну строку Excel файла и создает объект Equipment
 * 
 * @param {Array} row - Строка данных из Excel
 * @param {number} maxNameLength - Максимальная длина наименования
 * @returns {Equipment|null} Объект Equipment или null, если строка некорректна
 */
function processRow(row, maxNameLength) {
  if (!row || row.length < 7) return null;

  const name = row[EXCEL_COLUMNS.NAME] || '';
  const inventoryNumber = row[EXCEL_COLUMNS.INVENTORY_NUMBER] || '';
  const maintenancePeriod = row[EXCEL_COLUMNS.MAINTENANCE_PERIOD] || '';
  const monthStr = row[EXCEL_COLUMNS.MONTH] || '';
  const yearStr = row[EXCEL_COLUMNS.YEAR] || '';
  const engineer = row[EXCEL_COLUMNS.ENGINEER] || '';

  const date = parseDate(monthStr, yearStr);
  const maintenanceDone = date ? formatDate(date) : '';
  const nextDate = date ? addPeriod(date, maintenancePeriod) : null;
  const maintenanceNext = nextDate ? formatDate(nextDate) : '';

  return new Equipment(
    name,
    inventoryNumber,
    maintenancePeriod,
    maintenanceDone,
    maintenanceNext,
    engineer,
    maxNameLength
  );
}

/**
 * Парсит Excel файл и извлекает данные об оборудовании
 * 
 * @param {File} file - Файл Excel для парсинга
 * @param {number} [maxNameLength=100] - Максимальная длина наименования
 * @returns {Promise<Equipment[]>} Массив объектов Equipment
 * @throws {Error} При ошибках чтения или парсинга файла
 */
export function parseExcelFile(file, maxNameLength = FILE_CONSTRAINTS.MAX_NAME_LENGTH_DEFAULT) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error(ERROR_MESSAGES.NO_FILE));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          reject(new Error(ERROR_MESSAGES.FILE_READ_ERROR));
          return;
        }

        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames.length) {
          reject(new Error(ERROR_MESSAGES.NO_SHEETS));
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        if (!rows.length) {
          reject(new Error(ERROR_MESSAGES.EMPTY_SHEET));
          return;
        }

        validateHeaders(rows[0]);

        const equipments = [];
        for (let i = 1; i < rows.length; i++) {
          const equipment = processRow(rows[i], maxNameLength);
          if (equipment) {
            equipments.push(equipment);
          }
        }

        resolve(equipments);
      } catch (error) {
        reject(new Error(ERROR_MESSAGES.PROCESSING_ERROR + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error(ERROR_MESSAGES.FILE_READ_ERROR));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Файл с константами приложения
 */

// Ограничения файлов
export const FILE_CONSTRAINTS = {
  MAX_NAME_LENGTH_DEFAULT: 100,
  MIN_NAME_LENGTH: 50,
  MAX_NAME_LENGTH_LIMIT: 500,
  ALLOWED_EXTENSIONS: /\.(xlsx|xls)$/i
};

// PDF настройки
export const PDF_SETTINGS = {
  FONT_SIZE: 5.7,
  LINE_HEIGHT_OFFSET: 2,
  MARGIN: 20,
  GAP: 15,
  TEXT_PADDING: 5,
  TEXT_MARGIN: 10,
  UNIT: 'pt',
  FORMAT: 'a4',
  FONT_FAMILY: 'PT_Sans-Web-Regular',
  FONT_STYLE: 'normal',
  DEFAULT_FILENAME: 'equipment_report.pdf'
};

// UI константы
export const UI_CONSTANTS = {
  INPUT_WIDTH: '80px',
  INPUT_MARGIN_LEFT: '10px'
};

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  NO_FILE: 'Передан не файл.',
  FILE_READ_ERROR: 'Не удалось прочитать файл.',
  NO_SHEETS: 'Файл не содержит ни одного листа.',
  EMPTY_SHEET: 'Первый лист пустой.',
  INVALID_HEADERS: 'Заголовки отсутствуют или неполные.',
  INVALID_FORMAT: 'Пожалуйста, загрузите файл в формате .xlsx или .xls',
  EMPTY_FILE: 'Файл пустой или не содержит данных.',
  NO_DATA_FOR_PDF: 'Нет данных для генерации PDF',
  PROCESSING_ERROR: 'Ошибка при обработке файла: ',
  PDF_GENERATION_ERROR: 'Ошибка при генерации PDF: '
};

// Тексты интерфейса
export const UI_TEXTS = {
  LOADING: 'Обработка файла, пожалуйста, подождите...',
  DATA_LOADED: 'Данные успешно загружены. Кол-во записей: ',
  PAGES_REQUIRED: 'Потребуется листов: ',
  STICKERS_ON_LAST_PAGE: 'Наклеек на последнем листе: '
};

// Требуемые заголовки Excel файла
export const REQUIRED_HEADERS = [
  'Наименование оборудования',
  'Инвентарный номер',
  'Периодичность ТО',
  'График ТО',
  'Год сейчас'
];

// Индексы колонок в Excel
export const EXCEL_COLUMNS = {
  NAME: 0,
  INVENTORY_NUMBER: 1,
  MAINTENANCE_PERIOD: 2,
  MONTH: 3,
  YEAR: 4,
  ENGINEER: 6
};

// Карта месяцев
export const MONTH_MAP = {
  январь: 0,
  февраль: 1,
  март: 2,
  апрель: 3,
  май: 4,
  июнь: 5,
  июль: 6,
  август: 7,
  сентябрь: 8,
  октябрь: 9,
  ноябрь: 10,
  декабрь: 11
};

// Названия месяцев для форматирования
export const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Паттерны для парсинга периода
export const PERIOD_PATTERN = /(\d+)\s*(год|года|лет|месяц|месяцев|месяца)/;

// Единицы времени
export const TIME_UNITS = {
  YEARS: ['год', 'года', 'лет'],
  MONTHS: ['месяц', 'месяцев', 'месяца']
}; 
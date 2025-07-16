import React, { useState } from 'react';
import { parseExcelFile } from '../../services/Parser';
import { generatePdf } from '../../services/PdfConverter';
import { TemplateSelector } from '../TemplateSelector/TemplateSelector';
import { STICKER_TEMPLATES, DEFAULT_TEMPLATE } from '../../config/templates';
import { 
  FILE_CONSTRAINTS, 
  ERROR_MESSAGES, 
  UI_TEXTS, 
  UI_CONSTANTS,
  PDF_SETTINGS 
} from '../../config/constants';
import Equipment from '../../models/Equipment';
import './App.css';

/**
 * Валидирует загружаемый файл
 * 
 * @param {File|null} file - Загружаемый файл
 * @returns {string} Сообщение об ошибке или пустая строка если файл валиден
 */
function validateFile(file) {
  if (!file) return '';
  
  if (!FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.test(file.name)) {
    return ERROR_MESSAGES.INVALID_FORMAT;
  }
  
  return '';
}

/**
 * Вычисляет количество страниц для PDF
 * 
 * @param {Equipment[]} equipments - Массив оборудования
 * @param {Object} template - Шаблон стикеров
 * @returns {number} Количество страниц
 */
function calculatePagesCount(equipments, template) {
  if (!equipments.length || !template) return 0;
  const stickersPerPage = template.cols * template.rows;
  return Math.ceil(equipments.length / stickersPerPage);
}

/**
 * Вычисляет количество стикеров на последней странице
 * 
 * @param {Equipment[]} equipments - Массив оборудования
 * @param {Object} template - Шаблон стикеров
 * @returns {number} Количество стикеров на последней странице
 */
function calculateLastPageStickers(equipments, template) {
  if (!equipments.length || !template) return 0;
  const stickersPerPage = template.cols * template.rows;
  return equipments.length % stickersPerPage || stickersPerPage;
}

/**
 * Главный компонент приложения для генерации стикеров оборудования
 * 
 * @returns {JSX.Element} JSX элемент главного компонента
 */
function App() {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE);
  const [maxNameLength, setMaxNameLength] = useState(FILE_CONSTRAINTS.MAX_NAME_LENGTH_DEFAULT);

  /**
   * Обрабатывает изменение выбранного файла
   * 
   * @param {Event} e - Событие изменения input файла
   */
  const handleFileChange = (e) => {
    setError('');
    setEquipments([]);
    
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      setFileName('');
      setFile(null);
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFileName('');
      setFile(null);
      return;
    }

    setFileName(selectedFile.name);
    setFile(selectedFile);
  };

  /**
   * Обрабатывает конвертацию Excel файла в данные оборудования
   */
  const handleConvert = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    setEquipments([]);

    try {
      const parsedEquipments = await parseExcelFile(file, maxNameLength);

      if (!parsedEquipments || parsedEquipments.length === 0) {
        setError(ERROR_MESSAGES.EMPTY_FILE);
        setLoading(false);
        return;
      }

      setEquipments(parsedEquipments);
      setLoading(false);
    } catch (err) {
      setError(ERROR_MESSAGES.PROCESSING_ERROR + err.toString());
      setLoading(false);
    }
  };

  /**
   * Обрабатывает генерацию и скачивание PDF файла
   */
  const handleDownloadPdf = () => {
    if (!equipments || equipments.length === 0) {
      setError(ERROR_MESSAGES.NO_DATA_FOR_PDF);
      return;
    }
    
    try {
      const template = STICKER_TEMPLATES[selectedTemplate];
      generatePdf(equipments, template, PDF_SETTINGS.DEFAULT_FILENAME);
    } catch (err) {
      setError(ERROR_MESSAGES.PDF_GENERATION_ERROR + err.toString());
    }
  };

  /**
   * Обрабатывает изменение максимальной длины наименования
   * 
   * @param {Event} e - Событие изменения input
   */
  const handleMaxLengthChange = (e) => {
    const value = parseInt(e.target.value) || FILE_CONSTRAINTS.MAX_NAME_LENGTH_DEFAULT;
    setMaxNameLength(value);
  };

  const currentTemplate = STICKER_TEMPLATES[selectedTemplate];
  const pagesCount = calculatePagesCount(equipments, currentTemplate);
  const stickersPerPage = currentTemplate.cols * currentTemplate.rows;
  const lastPageStickers = calculateLastPageStickers(equipments, currentTemplate);

  return (
    <div className="container">
      <h2>Конвертер Excel в PDF ({currentTemplate.name})</h2>
      <div className="desc">
        Загрузите Excel-файл (.xlsx или .xls).<br />
        Шаблон: {stickersPerPage} текстовых наклеек на лист (без рамок).<br />
        Наименование может переноситься на несколько строк.
      </div>
      
      <TemplateSelector 
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />

      <div className="name-length-setting">
        <label className="file-label">
          Максимальная длина наименования: 
          <input 
            type="number" 
            min={FILE_CONSTRAINTS.MIN_NAME_LENGTH}
            max={FILE_CONSTRAINTS.MAX_NAME_LENGTH_LIMIT}
            value={maxNameLength}
            onChange={handleMaxLengthChange}
            style={{ 
              width: UI_CONSTANTS.INPUT_WIDTH, 
              marginLeft: UI_CONSTANTS.INPUT_MARGIN_LEFT 
            }}
          /> символов
        </label>
      </div>

      <label className="file-label" htmlFor="excelFile">
        Выберите Excel-файл:
      </label>
      <input 
        type="file" 
        id="excelFile" 
        accept=".xlsx,.xls" 
        onChange={handleFileChange} 
      />
      <div id="fileName">{fileName}</div>
      
      <button 
        id="convertBtn" 
        disabled={!file || loading} 
        onClick={handleConvert}
      >
        Конвертировать
      </button>
      
      <button 
        id="downloadPdfBtn" 
        disabled={!equipments.length} 
        onClick={handleDownloadPdf}
      >
        Скачать PDF
      </button>
      
      {loading && (
        <div id="loading" className="loading">
          {UI_TEXTS.LOADING}
        </div>
      )}
      
      {error && <div id="error">{error}</div>}
      
      {equipments.length > 0 && (
        <div id="preview">
          <b>{UI_TEXTS.DATA_LOADED}{equipments.length}</b><br />
          <span>{UI_TEXTS.PAGES_REQUIRED}{pagesCount}</span><br />
          <span>{UI_TEXTS.STICKERS_ON_LAST_PAGE}{lastPageStickers}</span>
        </div>
      )}
    </div>
  );
}

export default App;

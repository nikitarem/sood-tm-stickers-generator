import React, { useState } from 'react';
import { parseExcelFile } from '../../services/Parser';
import { generatePdf } from '../../services/PdfConverter';
import { TemplateSelector } from '../TemplateSelector/TemplateSelector';
import { STICKER_TEMPLATES, DEFAULT_TEMPLATE } from '../../config/templates';
import Equipment from '../../models/Equipment';
import './App.css'

function App() {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE);
  const [maxNameLength, setMaxNameLength] = useState(100);

  const handleFileChange = (e) => {
    setError('');
    setEquipments([]);
    const selectedFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;

    if (!selectedFile) {
      setFileName('');
      setFile(null);
      return;
    }

    if (!/\.(xlsx|xls)$/i.test(selectedFile.name)) {
      setError('Пожалуйста, загрузите файл в формате .xlsx или .xls');
      setFileName('');
      setFile(null);
      return;
    }

    setFileName(selectedFile.name);
    setFile(selectedFile);
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setEquipments([]);

    try {
      const parsedEquipments = await parseExcelFile(file, maxNameLength);

      if (!parsedEquipments || parsedEquipments.length === 0) {
        setError('Файл пустой или не содержит данных.');
        setLoading(false);
        return;
      }

      setEquipments(parsedEquipments);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при обработке файла: ' + err.toString());
      setLoading(false);
    }
  };

  const calculatePages = () => {
    if (!equipments.length || !selectedTemplate) return 0;
    const template = STICKER_TEMPLATES[selectedTemplate];
    const stickersPerPage = template.cols * template.rows;
    return Math.ceil(equipments.length / stickersPerPage);
  };

  const handleDownloadPdf = () => {
    if (!equipments || equipments.length === 0) {
      setError('Нет данных для генерации PDF');
      return;
    }
    try {
      const template = STICKER_TEMPLATES[selectedTemplate];
      generatePdf(equipments, template, 'equipment_report.pdf');
    } catch (err) {
      setError('Ошибка при генерации PDF: ' + err.toString());
    }
  };

  const currentTemplate = STICKER_TEMPLATES[selectedTemplate];
  const pagesCount = calculatePages();
  const stickersPerPage = currentTemplate.cols * currentTemplate.rows;

  return (
    <>
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
              min="50" 
              max="500" 
              value={maxNameLength}
              onChange={(e) => setMaxNameLength(parseInt(e.target.value) || 100)}
              style={{ width: '80px', marginLeft: '10px' }}
            /> символов
          </label>
        </div>

        <label className="file-label" htmlFor="excelFile">
          Выберите Excel-файл:
        </label>
        <input type="file" id="excelFile" accept=".xlsx,.xls" onChange={handleFileChange} />
        <div id="fileName">{fileName}</div>
        <button id="convertBtn" disabled={!file || loading} onClick={handleConvert}>
          Конвертировать
        </button>
        <button id="downloadPdfBtn" disabled={!equipments.length} onClick={handleDownloadPdf}>
          Скачать PDF
        </button>
        {loading && <div id="loading" className="loading">Обработка файла, пожалуйста, подождите...</div>}
        {error && <div id="error">{error}</div>}
        {equipments.length > 0 && (
          <div id="preview">
            <b>Данные успешно загружены. Кол-во записей: {equipments.length}</b><br />
            <span>Потребуется листов: {pagesCount}</span><br />
            <span>Наклеек на последнем листе: {equipments.length % stickersPerPage || stickersPerPage}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

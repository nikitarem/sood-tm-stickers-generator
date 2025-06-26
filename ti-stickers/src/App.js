import React, { useState } from 'react';
import { parseExcelFile } from './Parser';
import { generatePdf } from './PdfConverter';
import Equipment from './Equipment';

function App() {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setError('');
    setEquipments([]);
    const selectedFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;

    if (!selectedFile) {
      setFileName('');
      setFile(null);
      return;
    }

    // Проверяем расширение файла
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
      const parsedEquipments = await parseExcelFile(file);

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

  const handleDownloadPdf = () => {
    if (!equipments || equipments.length === 0) {
      setError('Нет данных для генерации PDF');
      return;
    }
    try {
      generatePdf(equipments, 'equipment_report.pdf');
    } catch (err) {
      setError('Ошибка при генерации PDF: ' + err.toString());
    }
  };

  return (
    <>
      <style>{`
        body { font-family: Arial, sans-serif; background: #f7f7f7; margin: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px #0001; padding: 30px; }
        h2 { margin-top: 0; }
        .desc { color: #555; margin-bottom: 20px; }
        .file-label { display: block; margin-bottom: 10px; font-weight: bold; }
        #fileName { font-size: 0.95em; color: #007bff; margin-bottom: 10px; }
        #preview { margin-top: 20px; background: #f2f2f2; border-radius: 6px; padding: 10px; font-size: 0.96em; white-space: pre-wrap; }
        #error { color: #b00; margin-top: 10px; }
        .loading { color: #007bff; margin-top: 10px; }
        button { background: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-size: 1em; cursor: pointer; margin-right: 10px; }
        button:disabled { background: #aaa; cursor: not-allowed; }
        @media (max-width: 600px) {
          .container { padding: 10px; }
        }
      `}</style>

      <div className="container">
        <h2>Конвертер Excel в PDF (3 × 8)</h2>
        <div className="desc">
          Загрузите Excel-файл (.xlsx или .xls).<br />
          Вся проверка формата и заголовков выполняется при конвертации.
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
            <b>Данные успешно загружены. Кол-во записей: {equipments.length}</b>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

/**
 * Точка входа в приложение генератора стикеров для технического обслуживания оборудования
 * 
 * @author Denis (Refactored)
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import { App } from './components';

/**
 * Корневой элемент React приложения
 * 
 * @type {ReactDOM.Root}
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

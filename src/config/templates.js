// src/config/templates.js
export const STICKER_TEMPLATES = {
    '3x8': {
        cols: 3,
        rows: 8,
        name: '3×8 (по умолчанию)',
        description: '3 колонки × 8 рядов = 24 наклейки на лист'
    },
    '3x7': {
        cols: 3,
        rows: 7,
        name: '3×7',
        description: '3 колонки × 7 рядов = 21 наклейка на лист'
    },
    '2x10': {
        cols: 2,
        rows: 10,
        name: '2×10',
        description: '2 колонки × 10 рядов = 20 наклеек на лист'
    },
    '4x6': {
        cols: 4,
        rows: 6,
        name: '4×6',
        description: '4 колонки × 6 рядов = 24 наклейки на лист'
    }
};

export const DEFAULT_TEMPLATE = '3x8';

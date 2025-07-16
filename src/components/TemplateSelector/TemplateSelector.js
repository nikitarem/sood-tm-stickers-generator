import React from 'react';
import { STICKER_TEMPLATES } from '../../config/templates';
import './TemplateSelector.css';

export function TemplateSelector({ selectedTemplate, onTemplateChange }) {
    return (
        <div className="template-selector">
            <label className="template-label">
                Шаблон наклеек:
            </label>
            <select
                value={selectedTemplate}
                onChange={(e) => onTemplateChange(e.target.value)}
                className="template-select"
            >
                {Object.entries(STICKER_TEMPLATES).map(([key, template]) => (
                    <option key={key} value={key}>
                        {template.name} - {template.description}
                    </option>
                ))}
            </select>
        </div>
    );
}

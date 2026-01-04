import React from 'react';
import { Card } from './ui/Card';

export type SortField = 'createdAt' | 'priority' | 'title';
export type SortDirection = 'asc' | 'desc';

interface SortBarProps {
    sortBy: SortField;
    onSortChange: (field: SortField) => void;
    sortDir: SortDirection;
    onDirChange: (dir: SortDirection) => void;
}

export const SortBar = ({ sortBy, onSortChange, sortDir, onDirChange }: SortBarProps) => {
    return (
        <div className="flex justify-end gap-3 mb-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Ordenar por:</span>
                <select
                    className="bg-white border border-slate-200 text-sm rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-100 outline-none"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as SortField)}
                >
                    <option value="createdAt">Fecha</option>
                    <option value="priority">Prioridad</option>
                    <option value="title">Nombre</option>
                </select>
            </div>

            <div className="flex bg-white rounded-md border border-slate-200 p-1">
                <button
                    onClick={() => onDirChange('asc')}
                    className={`px-2 rounded ${sortDir === 'asc' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    ↑
                </button>
                <button
                    onClick={() => onDirChange('desc')}
                    className={`px-2 rounded ${sortDir === 'desc' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    ↓
                </button>
            </div>
        </div>
    );
};

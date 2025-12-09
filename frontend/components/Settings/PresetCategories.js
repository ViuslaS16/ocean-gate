'use client';

import { PRESET_CATEGORIES } from '@/lib/utils';

const PresetCategories = ({ onSelect }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preset Categories</h3>
            <p className="text-sm text-gray-600 mb-4">
                Select a preset lobster category to quickly add with pre-filled details:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRESET_CATEGORIES.map((preset, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(preset)}
                        className="text-left p-3 border border-gray-200 rounded-lg hover:border-ocean-500 hover:bg-ocean-50 transition-colors"
                    >
                        <div className="font-medium text-sm text-gray-900">{preset.species}</div>
                        <div className="text-xs text-gray-500 mt-1">{preset.weightRange}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PresetCategories;

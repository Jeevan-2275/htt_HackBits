'use client';

import { useState } from 'react';

export default function DynamicListInput({ label, items, onItemsChange, placeholder, maxItems = 10 }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() && items.length < maxItems) {
      onItemsChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-3">
        {label}
        {maxItems && items.length > 0 && (
          <span className="text-slate-500 font-normal ml-2">
            ({items.length}/{maxItems})
          </span>
        )}
      </label>

      {/* Input Row */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || 'Type and press Enter to add'}
          disabled={items.length >= maxItems}
          className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleAddItem}
          disabled={!inputValue.trim() || items.length >= maxItems}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition cursor-pointer"
        >
          Add
        </button>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-black/40 border border-white/10 rounded-lg group hover:border-blue-500/30 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-100">{item}</span>
              </div>
              <button
                onClick={() => handleRemoveItem(index)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 transition"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <p className="text-slate-500 text-sm italic">No items added yet</p>
      )}
    </div>
  );
}

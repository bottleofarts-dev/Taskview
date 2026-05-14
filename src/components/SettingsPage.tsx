import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Plus, Trash2, Tag, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const SettingsPage: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useTaskContext();
  const [newCatName, setNewCatName] = useState('');
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const colors = [
    'bg-blue-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-indigo-500', 
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 
    'bg-rose-500', 'bg-slate-500'
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleAddCategory = () => {
    if (newCatName.trim()) {
      addCategory(newCatName.trim(), selectedColor);
      setNewCatName('');
    }
  };

  const handleClearData = () => {
    localStorage.removeItem('taskflow_tasks');
    localStorage.removeItem('taskflow_categories');
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Categories Management */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Tag size={20} className="text-slate-400" /> Manage Categories
        </h2>
        
        <div className="space-y-3 mb-6">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className={cn("w-3 h-3 rounded-full", cat.color)} />
                <span className="font-medium text-slate-700">{cat.name}</span>
              </div>
              <button 
                onClick={() => deleteCategory(cat.id)}
                className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                disabled={categories.length <= 1} // Prevent deleting the last category
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-600 mb-3">Add New Category</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Category name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 flex-1 text-sm text-slate-700"
            />
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-6 h-6 rounded-full shrink-0 border-2 transition-transform", 
                    color,
                    selectedColor === color ? "scale-110 border-slate-800" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                />
              ))}
            </div>
            <button
              onClick={handleAddCategory}
              disabled={!newCatName.trim()}
              className="w-full py-2.5 bg-slate-800 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              <Plus size={18} /> Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 shadow-sm">
        <h2 className="text-lg font-bold text-rose-900 mb-2 flex items-center gap-2">
          <AlertCircle size={20} className="text-rose-500" /> Danger Zone
        </h2>
        <p className="text-sm text-rose-700 mb-4">
          This will permanently delete all your tasks and custom categories. This action cannot be undone.
        </p>

        {showClearConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={handleClearData}
              className="flex-1 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl"
            >
              Yes, delete all
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 py-2 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-2.5 bg-white text-rose-600 font-semibold rounded-xl border border-rose-200 text-sm"
          >
            Clear All Data
          </button>
        )}
      </div>

      {/* About */}
      <div className="text-center py-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">TaskFlow v1.0.0</p>
        <p className="text-xs text-slate-400 mt-1">A simple, local-first task manager.</p>
      </div>

    </div>
  );
};

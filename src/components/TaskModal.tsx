import React, { useState, useEffect } from 'react';
import { Task, Subtask, Priority } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { X, Plus, Trash2, Calendar, Bell, Tag, Flag, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { categories, addTask, updateTask, deleteTask } = useTaskContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [hasReminder, setHasReminder] = useState(false);
  const [priority, setPriority] = useState<Priority>('medium');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setCategoryId(taskToEdit.categoryId || (categories.length > 0 ? categories[0].id : ''));
        setDueDate(taskToEdit.dueDate ? format(new Date(taskToEdit.dueDate), 'yyyy-MM-dd') : '');
        setHasReminder(taskToEdit.hasReminder);
        setPriority(taskToEdit.priority || 'medium');
        setSubtasks(taskToEdit.subtasks || []);
      } else {
        // Reset
        setTitle('');
        setDescription('');
        setCategoryId(categories.length > 0 ? categories[0].id : '');
        setDueDate('');
        setHasReminder(false);
        setPriority('medium');
        setSubtasks([]);
      }
    }
  }, [isOpen, taskToEdit, categories]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      categoryId,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      hasReminder,
      priority,
      completed: taskToEdit ? taskToEdit.completed : false,
      subtasks,
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  const handleAddSubtask = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') || !newSubtask.trim()) return;
    e.preventDefault();
    setSubtasks([...subtasks, { id: uuidv4(), title: newSubtask, completed: false }]);
    setNewSubtask('');
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };
  
  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm sm:p-4 transition-opacity">
      <div 
        className="w-full sm:w-[500px] h-[90vh] sm:h-auto sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-8 duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {taskToEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Title input */}
          <div>
            <input
              type="text"
              placeholder="What do you need to do?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
              autoFocus
            />
          </div>

          <div className="space-y-4">
            {/* Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              <div className="relative group">
                <div className="flex flex-col gap-1 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1"><Tag size={10}/> Category</span>
                  <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium focus:outline-none appearance-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative group">
                <div className="flex flex-col gap-1 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1"><Flag size={10}/> Priority</span>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-transparent text-sm font-medium focus:outline-none appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="relative group col-span-2 sm:col-span-2">
                <div className="flex flex-col gap-1 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1"><Calendar size={10}/> Due Date</span>
                    <button 
                      onClick={() => setHasReminder(!hasReminder)}
                      className={cn("p-1 rounded-md transition-colors", hasReminder ? "bg-amber-100 text-amber-600" : "text-slate-400 hover:bg-slate-200")}
                      title="Toggle Reminder"
                    >
                      <Bell size={12} />
                    </button>
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <textarea
                placeholder="Add details or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 p-3 text-sm text-slate-700 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
              />
            </div>

            {/* Subtasks */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Subtasks</h4>
              <div className="space-y-2">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleSubtask(st.id)}
                        className={cn(
                          "w-4 h-4 rounded appearance-none border flex items-center justify-center transition-colors",
                          st.completed ? "bg-slate-800 border-slate-800" : "border-slate-300"
                        )}
                      >
                         <Check size={10} strokeWidth={3} className={cn("text-white", st.completed ? "opacity-100" : "opacity-0")} />
                      </button>
                      <span className={cn("text-sm", st.completed ? "text-slate-400 line-through" : "text-slate-700")}>
                        {st.title}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeSubtask(st.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-all font-sans"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-3 mt-2">
                  <Plus size={16} className="text-blue-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Add a subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={handleAddSubtask}
                    className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400 py-1 border-b border-transparent focus:border-blue-200 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 mt-auto flex items-center justify-between pb-safe">
          {taskToEdit ? (
            <button 
              onClick={() => { deleteTask(taskToEdit.id); onClose(); }}
              className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> <span className="hidden sm:inline">Delete Task</span>
            </button>
          ) : <div></div>}
          
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm shadow-blue-600/20"
          >
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

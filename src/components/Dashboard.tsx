import React, { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TaskItem } from './TaskItem';
import { TaskModal } from './TaskModal';
import { Task } from '../types';
import { Plus, ListTodo, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { isToday, isPast } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { tasks, categories } = useTaskContext();
  const [filter, setFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.categoryId === filter);
    }
    
    // Sort: incomplete first, then by due date, then by priority, then creation date
    return filtered.sort((a, b) => {
      // Completed vs Incomplete
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      // Due dates
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Priorities (high > medium > low)
      const pMap = { high: 3, medium: 2, low: 1 };
      if (pMap[a.priority] !== pMap[b.priority]) {
        return pMap[b.priority] - pMap[a.priority];
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filter]);

  const activeCount = tasks.filter(t => !t.completed).length;
  const todayCount = tasks.filter(t => !t.completed && t.dueDate && isToday(new Date(t.dueDate))).length;
  const overdueCount = tasks.filter(t => !t.completed && t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))).length;

  const handleOpenModal = (task?: Task) => {
    setSelectedTask(task || null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Tasks</span>
            <span className="text-2xl font-bold text-slate-800">{activeCount}</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col gap-1">
            <span className="text-blue-600 text-xs font-semibold uppercase tracking-wider">Due Today</span>
            <span className="text-2xl font-bold text-blue-900">{todayCount}</span>
          </div>
          <div className={cn("p-4 rounded-2xl border shadow-sm flex flex-col gap-1", overdueCount > 0 ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100")}>
            <span className={cn("text-xs font-semibold uppercase tracking-wider", overdueCount > 0 ? "text-rose-600" : "text-slate-500")}>Overdue</span>
            <span className={cn("text-2xl font-bold", overdueCount > 0 ? "text-rose-900" : "text-slate-800")}>{overdueCount}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Categories</span>
            <span className="text-2xl font-bold text-slate-800">{categories.length}</span>
          </div>
        </div>

        {/* Categories Filter */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Lists</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                filter === 'all' 
                  ? "bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-200" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
            >
              All Tasks
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all border flex items-center gap-2",
                  filter === cat.id 
                    ? "bg-white text-slate-900 border-slate-300 shadow-sm" 
                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", cat.color)} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ListTodo size={20} className="text-slate-400" /> My Tasks
            </h2>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white/50 rounded-3xl border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-slate-800 font-semibold mb-1">All caught up!</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-[250px] mx-auto">
                There are no tasks in this list. Create a new task to get started.
              </p>
              <button 
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-600/20"
              >
                <Plus size={18} /> Add first task
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              {filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} onClick={handleOpenModal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-20 sm:bottom-8 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 active:scale-95 z-30"
      >
        <Plus size={24} />
      </button>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={selectedTask}
      />
    </>
  );
};

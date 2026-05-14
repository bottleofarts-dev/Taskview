import React, { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TaskItem } from './TaskItem';
import { TaskModal } from './TaskModal';
import { Task } from '../types';
import { Plus, Search, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const TasksPage: React.FC = () => {
  const { tasks } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort: incomplete first, then by due date, then creation
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, searchQuery, statusFilter]);

  const handleOpenModal = (task?: Task) => {
    setSelectedTask(task || null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-300">
        
        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700 shadow-sm"
            />
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={cn(
                "flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all",
                statusFilter === 'all' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={cn(
                "flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all",
                statusFilter === 'active' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={cn(
                "flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all",
                statusFilter === 'completed' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Task List */}
        <div>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-slate-800 font-semibold mb-1">No tasks found</h3>
              <p className="text-slate-500 text-sm">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
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

import React from 'react';
import { Check, Calendar, Bell, ChevronRight, AlertCircle } from 'lucide-react';
import { Task } from '../types';
import { cn, formatFriendlyDate } from '../lib/utils';
import { useTaskContext } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => {
  const { toggleTaskCompletion, categories } = useTaskContext();
  const category = categories.find(c => c.id === task.categoryId);
  
  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const hasSubtasks = totalSubtasks > 0;

  return (
    <div 
      className={cn(
        "group flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-3 cursor-pointer transition-all active:scale-[0.98]",
        task.completed ? "opacity-60 bg-slate-50/50" : "hover:border-slate-200"
      )}
      onClick={() => onClick(task)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleTaskCompletion(task.id);
        }}
        className={cn(
          "shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5",
          task.completed 
            ? "bg-slate-800 border-slate-800 text-white" 
            : "border-slate-300 group-hover:border-slate-400 bg-transparent text-transparent"
        )}
      >
        <Check size={14} strokeWidth={3} className={task.completed ? "opacity-100" : "opacity-0"} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn(
            "text-[15px] font-medium truncate leading-tight",
            task.completed ? "text-slate-500 line-through" : "text-slate-800"
          )}>
            {task.title}
          </h3>
          
          {task.priority === 'high' && !task.completed && (
            <div className="shrink-0 flex items-center mt-0.5">
              <AlertCircle size={14} className="text-rose-500" />
            </div>
          )}
        </div>
        
        {task.description && (
          <p className="mt-1 text-[13px] text-slate-500 line-clamp-1">
            {task.description}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium">
          {category && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn("w-2 h-2 rounded-full", category.color)} />
              <span>{category.name}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 shrink-0",
              isPastDue ? "text-rose-500" : ""
            )}>
              <Calendar size={12} />
              <span>{formatFriendlyDate(task.dueDate)}</span>
            </div>
          )}

          {task.hasReminder && !task.completed && (
            <div className="shrink-0">
              <Bell size={12} className="text-amber-500" />
            </div>
          )}

          {hasSubtasks && (
            <div className="flex items-center gap-1 shrink-0 text-slate-400">
              <span className={cn("w-1 h-1 rounded-full bg-slate-300")} />
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Remove the chevron as we want the whole surface to feel clickable but uncluttered */}
    </div>
  );
};

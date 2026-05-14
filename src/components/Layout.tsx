import React from 'react';
import { cn } from '../lib/utils';
import { LayoutDashboard, CheckSquare, Settings } from 'lucide-react';

export type View = 'home' | 'tasks' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, currentView, onViewChange }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 pb-16 sm:pb-0 font-sans">
      <header className="px-6 py-8 pb-4 sticky top-0 bg-slate-50/80 backdrop-blur-lg z-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-20 pb-safe">
        <button 
          onClick={() => onViewChange('home')}
          className={cn("flex flex-col items-center gap-1", currentView === 'home' ? "text-blue-600" : "text-slate-400")}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => onViewChange('tasks')}
          className={cn("flex flex-col items-center gap-1", currentView === 'tasks' ? "text-blue-600" : "text-slate-400")}
        >
          <CheckSquare size={24} />
          <span className="text-[10px] font-medium">Tasks</span>
        </button>
        <button 
          onClick={() => onViewChange('settings')}
          className={cn("flex flex-col items-center gap-1", currentView === 'settings' ? "text-blue-600" : "text-slate-400")}
        >
          <Settings size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>

      {/* Desktop Sidebar / Top Nav Additions can be here if needed */}
      <div className="hidden sm:flex fixed top-0 left-0 h-screen w-20 flex-col border-r border-slate-200 bg-white items-center py-8 gap-8">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm mb-4">
          T
        </div>
        <button 
          onClick={() => onViewChange('home')}
          className={cn("p-3 rounded-xl transition-colors", currentView === 'home' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50")}
        >
          <LayoutDashboard size={24} />
        </button>
        <button 
          onClick={() => onViewChange('tasks')}
          className={cn("p-3 rounded-xl transition-colors", currentView === 'tasks' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50")}
        >
          <CheckSquare size={24} />
        </button>
        <button 
          onClick={() => onViewChange('settings')}
          className={cn("p-3 rounded-xl transition-colors mt-auto", currentView === 'settings' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50")}
        >
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
};


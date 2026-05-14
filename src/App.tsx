/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { Layout, View } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TasksPage } from './components/TasksPage';
import { SettingsPage } from './components/SettingsPage';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const getTitle = () => {
    switch (currentView) {
      case 'home': return 'TaskFlow';
      case 'tasks': return 'All Tasks';
      case 'settings': return 'Settings';
    }
  };

  return (
    <TaskProvider>
      <Layout 
        title={getTitle()} 
        currentView={currentView} 
        onViewChange={setCurrentView}
      >
        {currentView === 'home' && <Dashboard />}
        {currentView === 'tasks' && <TasksPage />}
        {currentView === 'settings' && <SettingsPage />}
      </Layout>
    </TaskProvider>
  );
}


"use client";

import  { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Routines } from './pages/Routines';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { CreateRoutine } from './pages/CreateRoutine';
import { AppProvider } from './context/AppContext';
export function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editRoutineId, setEditRoutineId] = useState<string | null>(null);
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard navigateTo={setCurrentPage} />;
        
      case 'routines':
        return <Routines navigateTo={setCurrentPage} setEditRoutineId={setEditRoutineId} />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      case 'create-routine':
        return <CreateRoutine navigateTo={setCurrentPage} editRoutineId={editRoutineId} setEditRoutineId={setEditRoutineId} />;
      default:
        return <Dashboard navigateTo={setCurrentPage} />;
    }
  };
  return <AppProvider>
    <div className="bg-blue-500 text-white p-4">If you see a blue box, Tailwind is working!</div>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
          {renderPage()}
        </div>
      </div>
    </AppProvider>;
}

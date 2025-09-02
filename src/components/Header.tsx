import React from 'react';
import { DumbbellIcon } from 'lucide-react';

export interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => (
  <header className="w-full bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button className="flex items-center font-bold text-lg" onClick={() => setCurrentPage('dashboard')}>
          <DumbbellIcon className="h-5 w-5 mr-2" />
          FitTrack
        </button>
      </div>
      <nav className="flex items-center space-x-6">
        <button className={`px-1 py-2 ${currentPage === 'dashboard' ? 'text-blue-600 font-medium' : 'text-gray-600'}`} onClick={() => setCurrentPage('dashboard')}>
          Dashboard
        </button>
        <button className={`px-1 py-2 ${currentPage === 'routines' ? 'text-blue-600 font-medium' : 'text-gray-600'}`} onClick={() => setCurrentPage('routines')}>
          Routines
        </button>
        <button className={`px-1 py-2 ${currentPage === 'history' ? 'text-blue-600 font-medium' : 'text-gray-600'}`} onClick={() => setCurrentPage('history')}>
          History
        </button>
        <button className={`px-1 py-2 ${currentPage === 'profile' ? 'text-blue-600 font-medium' : 'text-gray-600'}`} onClick={() => setCurrentPage('profile')}>
          Profile
        </button>
      </nav>
      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
    </div>
    <div className="w-full bg-gray-50 py-3 px-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center text-sm text-gray-600">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span>Demo Mode</span>
        </div>
        <p className="ml-2">
          This app is running in demo mode. Your data is stored in your
          browser's localStorage and will persist between sessions, but only
          on this device.
        </p>
      </div>
    </div>
  </header>
);
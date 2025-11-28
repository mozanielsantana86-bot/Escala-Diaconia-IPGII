import React, { useState, useEffect } from 'react';
import { Volunteer, Shift, MonthData } from './types';
import { getSundaysInMonth, getMonthName } from './utils/dateUtils';
import VolunteerManager from './components/VolunteerManager';
import Scheduler from './components/Scheduler';
import Dashboard from './components/Dashboard';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  // Date State
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // App Title State
  const [appTitle, setAppTitle] = useState(() => {
    return localStorage.getItem('appTitle') || "Voluntários do Domingo";
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Welcome Screen State
  const [showWelcome, setShowWelcome] = useState(true);

  // Data State - Initialize empty
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem('volunteers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('shifts');
    return saved ? JSON.parse(saved) : [];
  });

  // View State
  const [activeTab, setActiveTab] = useState<'team' | 'schedule' | 'dashboard'>('team');

  // Persist Data
  useEffect(() => {
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('appTitle', appTitle);
  }, [appTitle]);

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Logic Handlers
  const handleAddVolunteer = (newVolunteer: Volunteer) => {
    setVolunteers(prev => [...prev, newVolunteer]);
  };

  const handleRemoveVolunteer = (id: string) => {
    // Remove from volunteers list
    setVolunteers(prev => prev.filter(v => v.id !== id));
    // Remove from all shifts to maintain data integrity
    setShifts(prev => prev.map(shift => ({
      ...shift,
      volunteerIds: shift.volunteerIds.filter(vid => vid !== id)
    })));
  };

  // Derived State
  const monthData: MonthData = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    sundays: getSundaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // Render Welcome Screen
  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} appName={appTitle} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 print:hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shrink-0 shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              type="text"
              value={appTitle}
              onChange={(e) => setAppTitle(e.target.value)}
              className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-transparent hover:border-gray-300 dark:hover:border-slate-600 focus:border-indigo-600 outline-none transition-all px-1 py-0.5 w-full sm:w-auto"
              placeholder="Nome do Grupo"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Month Selector */}
            <div className="flex items-center gap-4 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
              <button 
                onClick={() => handleMonthChange(-1)}
                className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded shadow-sm transition-all text-gray-600 dark:text-slate-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="font-semibold text-gray-700 dark:text-slate-200 min-w-[120px] text-center hidden sm:block">
                {getMonthName(monthData.month)} {monthData.year}
              </span>
              <span className="font-semibold text-gray-700 dark:text-slate-200 text-sm sm:hidden">
                {getMonthName(monthData.month).substring(0, 3)}/{monthData.year.toString().substring(2)}
              </span>
              <button 
                onClick={() => handleMonthChange(1)}
                className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded shadow-sm transition-all text-gray-600 dark:text-slate-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            
            {/* Back Button (Logout) */}
            <button
               onClick={() => setShowWelcome(true)}
               className="p-2 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-1"
               title="Sair para tela inicial"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-4 mb-8 border-b border-gray-200 dark:border-slate-700 overflow-x-auto print:hidden">
           <button
            onClick={() => setActiveTab('team')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'team' 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Equipe
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'schedule' 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Escala
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'dashboard' 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            Tabela & Avisos
          </button>
        </div>

        {activeTab === 'team' && (
          <VolunteerManager 
            volunteers={volunteers} 
            onAdd={handleAddVolunteer}
            onRemove={handleRemoveVolunteer} 
          />
        )}
        
        {activeTab === 'schedule' && (
          <Scheduler 
            monthData={monthData} 
            volunteers={volunteers}
            shifts={shifts}
            onShiftUpdate={setShifts}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            monthData={monthData} 
            shifts={shifts} 
            volunteers={volunteers} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { Volunteer, Shift, MonthData } from './types';
import { getSundaysInMonth, getMonthName } from './utils/dateUtils';
import VolunteerManager from './components/VolunteerManager';
import Scheduler from './components/Scheduler';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  // Date State
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // App Title State
  const [appTitle, setAppTitle] = useState(() => {
    return localStorage.getItem('appTitle') || "Voluntários do Domingo";
  });

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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              type="text"
              value={appTitle}
              onChange={(e) => setAppTitle(e.target.value)}
              className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-600 outline-none transition-all px-1 py-0.5 w-full sm:w-auto"
              placeholder="Nome do Grupo"
            />
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1 ml-4">
            <button 
              onClick={() => handleMonthChange(-1)}
              className="p-1 hover:bg-white rounded shadow-sm transition-all text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="font-semibold text-gray-700 min-w-[120px] text-center hidden sm:block">
              {getMonthName(monthData.month)} {monthData.year}
            </span>
            <span className="font-semibold text-gray-700 text-sm sm:hidden">
              {getMonthName(monthData.month).substring(0, 3)}/{monthData.year.toString().substring(2)}
            </span>
            <button 
              onClick={() => handleMonthChange(1)}
              className="p-1 hover:bg-white rounded shadow-sm transition-all text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-4 mb-8 border-b border-gray-200 overflow-x-auto print:hidden">
           <button
            onClick={() => setActiveTab('team')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'team' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Equipe
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'schedule' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Escala
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'dashboard' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
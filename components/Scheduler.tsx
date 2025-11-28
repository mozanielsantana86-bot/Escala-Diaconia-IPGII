import React, { useState, useMemo } from 'react';
import { Volunteer, Shift, MonthData } from '../types';
import { formatDatePTBR } from '../utils/dateUtils';

interface Props {
  monthData: MonthData;
  volunteers: Volunteer[];
  shifts: Shift[];
  onShiftUpdate: (shifts: Shift[]) => void;
}

const Scheduler: React.FC<Props> = ({ monthData, volunteers, shifts, onShiftUpdate }) => {
  const [selectedShift, setSelectedShift] = useState<{ date: string, time: '09:00' | '18:00' } | null>(null);

  const minShifts = monthData.sundays.length === 4 ? 2 : 3;

  // Calculate stats per volunteer
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    volunteers.forEach(v => counts[v.id] = 0);
    
    shifts.forEach(s => {
      s.volunteerIds.forEach(vid => {
        if (counts[vid] !== undefined) counts[vid]++;
      });
    });

    return Object.entries(counts).map(([id, count]) => ({
      volunteerId: id,
      count,
      status: count >= minShifts ? 'ok' as const : 'pending' as const
    }));
  }, [shifts, volunteers, minShifts]);

  const getShiftForSlot = (date: string, time: '09:00' | '18:00') => {
    return shifts.find(s => s.date === date && s.time === time) || { id: '', date, time, volunteerIds: [] };
  };

  const handleToggleVolunteer = (volunteerId: string, date: string, time: '09:00' | '18:00') => {
    const existingShiftIndex = shifts.findIndex(s => s.date === date && s.time === time);
    let newShifts = [...shifts];

    if (existingShiftIndex >= 0) {
      const shift = { ...newShifts[existingShiftIndex] };
      if (shift.volunteerIds.includes(volunteerId)) {
        shift.volunteerIds = shift.volunteerIds.filter(id => id !== volunteerId);
      } else {
        if (shift.volunteerIds.length >= 3) return; // Max capacity
        shift.volunteerIds = [...shift.volunteerIds, volunteerId];
      }
      newShifts[existingShiftIndex] = shift;
    } else {
      newShifts.push({
        id: `${date}-${time}`,
        date,
        time,
        volunteerIds: [volunteerId]
      });
    }
    onShiftUpdate(newShifts);
  };

  const getSpecialSlotInfo = (sundayIndex: number, time: string, slotIndex: number) => {
    // 1st Sunday (Index 0) -> Ceia at 18:00 (Apply to ALL slots)
    if (sundayIndex === 0 && time === '18:00') {
      return { label: 'Ceia', placeholder: 'Disponível (Ceia)' };
    }

    // 3rd Sunday (Index 2) -> Ceia at 09:00 (Apply to ALL slots)
    if (sundayIndex === 2 && time === '09:00') {
      return { label: 'Ceia (08:00)', placeholder: 'Disponível (Ceia)' };
    }

    // Standard Morning Slots -> 08:00 arrival (Only apply to FIRST slot)
    if (time === '09:00' && slotIndex === 0) {
      return { label: '08:00', placeholder: 'Disponível (08:00)' };
    }

    return null;
  };

  return (
    <div className="space-y-8">
      
      {/* Stats Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">Meta Mensal: Mínimo de {minShifts} plantões</h3>
        <div className="flex flex-wrap gap-2">
          {volunteers.map(vol => {
            const stat = stats.find(s => s.volunteerId === vol.id);
            const count = stat?.count || 0;
            const isOk = count >= minShifts;
            
            return (
              <div key={vol.id} className={`text-xs px-2 py-1 rounded-full border ${isOk ? 'bg-green-100 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                {vol.name}: {count}/{minShifts}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monthData.sundays.map((date, sundayIndex) => (
          <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 capitalize">{formatDatePTBR(date)}</h3>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Domingo</span>
            </div>
            
            <div className="p-4 space-y-4">
              {(['09:00', '18:00'] as const).map(time => {
                const shift = getShiftForSlot(date, time);
                const currentVolunteers = shift.volunteerIds.map(id => volunteers.find(v => v.id === id)).filter(Boolean) as Volunteer[];
                const isFull = currentVolunteers.length >= 3;
                
                return (
                  <div key={time} className="border rounded-lg p-3 hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{time}</span>
                        <span className={`text-xs font-medium ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                          {currentVolunteers.length}/3 Voluntários
                        </span>
                      </div>
                      {!isFull && (
                        <button 
                          onClick={() => setSelectedShift({ date, time })}
                          className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        >
                          + Adicionar
                        </button>
                      )}
                    </div>

                    {/* Slots Visual */}
                    <div className="space-y-2">
                      {[0, 1, 2].map((idx) => {
                        const vol = currentVolunteers[idx];
                        const specialInfo = getSpecialSlotInfo(sundayIndex, time, idx);
                        const defaultPlaceholder = time === '09:00' ? 'Disponível (08:30)' : 'Disponível (17:30)';

                        if (vol) {
                          return (
                            <div key={vol.id} className="flex justify-between items-center text-sm bg-gray-800 text-white p-2 rounded shadow-sm border border-gray-700 relative overflow-hidden">
                              {specialInfo && (
                                <div className="absolute top-0 right-0 bg-yellow-500 text-yellow-900 text-[9px] px-1 font-bold">
                                  {specialInfo.label}
                                </div>
                              )}
                              <span className="truncate font-medium">{vol.name}</span>
                              <button 
                                onClick={() => handleToggleVolunteer(vol.id, date, time)}
                                className="text-red-300 hover:text-red-200 p-1 hover:bg-gray-700 rounded transition-colors"
                                title="Remover da escala"
                              >
                                ×
                              </button>
                            </div>
                          );
                        } else {
                          return (
                            <div key={idx} className={`h-9 border border-dashed rounded flex items-center justify-center text-xs ${specialInfo ? 'bg-yellow-50 border-yellow-300 text-yellow-700 font-medium' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                              {specialInfo ? specialInfo.placeholder : defaultPlaceholder}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selection Modal */}
      {selectedShift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Escalar para {formatDatePTBR(selectedShift.date)} às {selectedShift.time}
              </h3>
              <button onClick={() => setSelectedShift(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-500 text-sm mb-4">Selecione um voluntário para adicionar a este plantão.</p>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {volunteers.map(vol => {
                const currentShift = getShiftForSlot(selectedShift.date, selectedShift.time);
                const isSelected = currentShift.volunteerIds.includes(vol.id);
                const isFull = currentShift.volunteerIds.length >= 3;
                
                return (
                  <button
                    key={vol.id}
                    disabled={isSelected || (isFull && !isSelected)}
                    onClick={() => {
                      handleToggleVolunteer(vol.id, selectedShift.date, selectedShift.time);
                      if (currentShift.volunteerIds.length + 1 >= 3) {
                          setSelectedShift(null); // Close if full after add
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex justify-between items-center
                      ${isSelected 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'hover:bg-gray-50 border-gray-200 text-gray-700'
                      }
                      ${(isFull && !isSelected) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <span className="font-medium">{vol.name}</span>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>
             <div className="mt-4 pt-4 border-t text-right">
                <button 
                    onClick={() => setSelectedShift(null)}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                >
                    Fechar
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
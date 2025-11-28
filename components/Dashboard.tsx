import React, { useState, useEffect } from 'react';
import { Volunteer, Shift, MonthData } from '../types';
import { formatDatePTBR } from '../utils/dateUtils';
import { generateAnnouncement, generateIndividualMessage } from '../services/geminiService';

interface Props {
  monthData: MonthData;
  shifts: Shift[];
  volunteers: Volunteer[];
}

const Dashboard: React.FC<Props> = ({ monthData, shifts, volunteers }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  
  // State for Information Field
  const [infoText, setInfoText] = useState(() => localStorage.getItem('dashboardInfo') || '');

  useEffect(() => {
    localStorage.setItem('dashboardInfo', infoText);
  }, [infoText]);

  const getShiftInfo = (date: string, time: '09:00' | '18:00') => {
    const shift = shifts.find(s => s.date === date && s.time === time);
    if (!shift) return [];
    return shift.volunteerIds.map(id => volunteers.find(v => v.id === id)).filter(Boolean) as Volunteer[];
  };

  const handleGenerateGroupMsg = async (date: string, time: '09:00' | '18:00') => {
    const vols = getShiftInfo(date, time);
    if (vols.length === 0) return;

    setLoadingId(`${date}-${time}`);
    const msg = await generateAnnouncement(
      formatDatePTBR(date), 
      time, 
      vols.map(v => v.name)
    );
    setLoadingId(null);
    setGeneratedText(msg);
  };

  const handleIndividualWhatsapp = async (vol: Volunteer, date: string, time: '09:00' | '18:00') => {
    setLoadingId(`ind-${vol.id}-${date}-${time}`);
    const msg = await generateIndividualMessage(vol.name, formatDatePTBR(date), time);
    setLoadingId(null);
    
    const url = `https://wa.me/${vol.phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page { margin: 1cm; }
          body { -webkit-print-color-adjust: exact; background-color: white !important; color: black !important; }
          .no-print { display: none !important; }
          /* Reset dark mode for print */
          .dark * {
            background-color: white !important;
            color: black !important;
            border-color: #e5e7eb !important;
          }
        }
      `}</style>

      {/* Modal for Generated Text */}
      {generatedText && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in print:hidden">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Mensagem Gerada (IA)</h3>
            <textarea 
              className="w-full h-48 p-4 border border-gray-700 dark:border-slate-600 rounded-lg bg-gray-900 text-gray-100 text-sm mb-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono"
              value={generatedText}
              readOnly
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setGeneratedText(null)}
                className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedText);
                  alert('Copiado para a área de transferência!');
                  setGeneratedText(null);
                }}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info & Print Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-end justify-between print:hidden transition-colors duration-300">
        <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Informações / Aviso da Escala
            </label>
            <input
                type="text"
                value={infoText}
                onChange={(e) => setInfoText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors"
                placeholder="Ex: Escala sujeita a alterações. Favor chegar 15min antes."
            />
        </div>
        <button
            onClick={() => window.print()}
            className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center gap-2 shrink-0 transition-colors"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Gerar PDF
        </button>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escala de Voluntários</h2>
        {infoText && (
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-800 font-medium">{infoText}</p>
            </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 print:border-none print:shadow-none transition-colors duration-300">
        <table className="w-full text-sm text-left text-gray-600 dark:text-slate-300">
          <thead className="text-xs text-gray-700 dark:text-slate-200 uppercase bg-gray-100 dark:bg-slate-900 border-b dark:border-slate-700 print:bg-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold print:py-2">Data</th>
              <th className="px-6 py-4 font-bold text-center bg-blue-50/50 dark:bg-blue-900/20 w-1/3 print:bg-blue-50 print:py-2">Manhã (09:00)</th>
              <th className="px-6 py-4 font-bold text-center bg-indigo-50/50 dark:bg-indigo-900/20 w-1/3 print:bg-indigo-50 print:py-2">Noite (18:00)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700 print:divide-gray-300">
            {monthData.sundays.map(date => {
              const morningVols = getShiftInfo(date, '09:00');
              const eveningVols = getShiftInfo(date, '18:00');

              return (
                <tr key={date} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors print:break-inside-avoid">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap print:py-2">
                    {formatDatePTBR(date)}
                  </td>
                  {/* Morning Slot */}
                  <td className="px-6 py-4 border-l dark:border-slate-700 align-top print:py-2">
                    <div className="flex flex-col gap-2">
                      {morningVols.map(v => (
                        <div key={v.id} className="flex items-center justify-between bg-white dark:bg-slate-700 border dark:border-slate-600 px-2 py-1 rounded shadow-sm group print:shadow-none print:border-gray-200 transition-colors">
                          <span className="print:font-medium text-gray-900 dark:text-slate-100">{v.name}</span>
                          <button 
                            onClick={() => handleIndividualWhatsapp(v, date, '09:00')}
                            disabled={!!loadingId}
                            className="text-green-500 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                            title="Enviar WhatsApp Individual"
                          >
                            {loadingId === `ind-${v.id}-${date}-09:00` ? '...' : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            )}
                          </button>
                        </div>
                      ))}
                      {eveningVols.length === 3 && (
                        <button 
                          onClick={() => handleGenerateGroupMsg(date, '18:00')}
                          disabled={!!loadingId}
                          className="mt-2 text-xs bg-indigo-600 text-white px-2 py-1.5 rounded hover:bg-indigo-700 w-full flex justify-center items-center gap-1 print:hidden"
                        >
                           {loadingId === `${date}-18:00` ? 'Gerando...' : 'Gerar Aviso Grupo (IA)'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
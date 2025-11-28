import React, { useState, useEffect } from 'react';
import { Volunteer } from '../types';

interface Props {
  volunteers: Volunteer[];
  onAdd: (volunteer: Volunteer) => void;
  onRemove: (id: string) => void;
}

const VolunteerManager: React.FC<Props> = ({ volunteers, onAdd, onRemove }) => {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  
  // Section Title State
  const [sectionTitle, setSectionTitle] = useState(() => {
    return localStorage.getItem('teamSectionTitle') || "Equipe de Voluntários";
  });

  useEffect(() => {
    localStorage.setItem('teamSectionTitle', sectionTitle);
  }, [sectionTitle]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    const newVolunteer: Volunteer = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone.replace(/\D/g, '')
    };

    onAdd(newVolunteer);
    setNewName('');
    setNewPhone('');
  };

  const handleRemoveClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este integrante? Todas as escalas dele serão perdidas.')) {
      onRemove(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Section - Editable Title */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <input 
            type="text"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="text-3xl font-bold text-gray-900 text-center bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-600 outline-none transition-all px-2 py-1"
            placeholder="Nome da Seção"
          />
        </div>
        <p className="text-gray-500 max-w-xl mx-auto">
          Gerencie os integrantes do grupo. Adicione novos participantes ou remova aqueles que não fazem mais parte da equipe.
        </p>
      </div>

      {/* Add Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Novo Cadastro</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              placeholder="Ex: João Silva"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              type="tel"
              placeholder="Ex: 11999999999"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Cadastrar
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Integrantes Cadastrados ({volunteers.length})</h3>
        </div>

        {volunteers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Nenhum voluntário cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {volunteers.map(vol => (
              <div key={vol.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                    {vol.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{vol.name}</h4>
                    <p className="text-sm text-gray-500">{vol.phone || 'Sem telefone'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveClick(vol.id)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 border-2 border-gray-200 hover:border-red-200 rounded-lg transition-all shrink-0"
                  title="Remover integrante"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerManager;
import React, { useState, useEffect } from 'react';
import { Volunteer } from '../types';

interface Props {
  volunteers: Volunteer[];
  onAdd: (volunteer: Volunteer) => void;
  onRemove: (id: string) => void;
  onUpdate: (volunteer: Volunteer) => void;
}

const VolunteerManager: React.FC<Props> = ({ volunteers, onAdd, onRemove, onUpdate }) => {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Section Title State
  const [sectionTitle, setSectionTitle] = useState(() => {
    return localStorage.getItem('teamSectionTitle') || "Diáconos";
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

  const startEdit = (volunteer: Volunteer) => {
    setEditingId(volunteer.id);
    setNewName(volunteer.name);
    setNewPhone(volunteer.phone);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewName('');
    setNewPhone('');
  };

  const handleUpdate = () => {
    if (!newName.trim() || !editingId) return;

    const updatedVolunteer: Volunteer = {
        id: editingId,
        name: newName,
        phone: newPhone.replace(/\D/g, '')
    };
    
    onUpdate(updatedVolunteer);
    cancelEdit();
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
            className="text-3xl font-bold text-gray-900 dark:text-white text-center bg-transparent border-b-2 border-transparent hover:border-gray-300 dark:hover:border-slate-600 focus:border-indigo-600 outline-none transition-all px-2 py-1"
            placeholder="Nome da Seção"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${editingId ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingId ? 'Editar Integrante' : 'Novo Cadastro'}
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nome Completo</label>
            <input
              type="text"
              placeholder="Ex: João Silva"
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">WhatsApp</label>
            <input
              type="tel"
              placeholder="Ex: 11999999999"
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            {editingId ? (
                <>
                    <button
                        onClick={handleUpdate}
                        disabled={!newName.trim()}
                        className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        Salvar
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                </>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Integrantes Cadastrados ({volunteers.length})</h3>
        </div>

        {volunteers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 transition-colors duration-300">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Nenhum voluntário cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {volunteers.map(vol => (
              <div key={vol.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0">
                    {vol.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{vol.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{vol.phone || 'Sem telefone'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => startEdit(vol)}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 rounded-lg transition-all shrink-0"
                        title="Editar integrante"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleRemoveClick(vol.id)}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 rounded-lg transition-all shrink-0"
                        title="Remover integrante"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerManager;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGraduation } from '../context/GraduationContext';
import { Calendar, MapPin, Clock, Plus, Trash2, Edit2, CheckCircle2, Timer } from 'lucide-react';

export const Events: React.FC = () => {
  const { user, events, addEvent, deleteEvent } = useGraduation();
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', time: '', location: '', status: 'em breve' as const });

  const handleAdd = () => {
    if (newEvent.name && newEvent.date) {
      addEvent(newEvent);
      setIsAdding(false);
      setNewEvent({ name: '', date: '', time: '', location: '', status: 'em breve' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Eventos</h1>
        <p className="text-slate-500 text-sm">Calendário da formatura</p>
      </header>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Nenhum evento cadastrado</p>
          </div>
        ) : (
          events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">{event.name}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  event.status === 'confirmado' ? 'bg-green-100 text-green-700' : 
                  event.status === 'em breve' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                }`}>
                  {event.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium">{event.time}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium truncate">{event.location}</span>
                </div>
              </div>

              {user?.isAdmin && (
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="absolute bottom-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Action Button (Admin) */}
      {user?.isAdmin && (
        <button
          onClick={() => setIsAdding(true)}
          className="fixed bottom-28 right-6 bg-blue-600 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all z-50"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Novo Evento</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Nome</label>
                  <input
                    type="text"
                    placeholder="Ex: Reunião de Comissão"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Data</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Hora</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Local</label>
                  <input
                    type="text"
                    placeholder="Ex: Sala 4 ou Zoom"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Status</label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="em breve">Em breve</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!newEvent.name || !newEvent.date}
                    className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

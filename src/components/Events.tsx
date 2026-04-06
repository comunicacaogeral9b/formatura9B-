/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGraduation } from '../context/GraduationContext';
import { Calendar, MapPin, Clock, Plus, Trash2, Edit2, CheckCircle2, Timer } from 'lucide-react';

export const Events: React.FC = () => {
  const { user, events, addEvent, deleteEvent, updateEvent } = useGraduation();
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', time: '', location: '', status: 'em breve' as const });

  // Countdown logic for the next event
  const nextEvent = events.find(e => e.status === 'confirmado') || events[0];
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number }>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!nextEvent?.date) return;

    const timer = setInterval(() => {
      const target = new Date(`${nextEvent.date}T${nextEvent.time || '00:00'}`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  const handleAdd = () => {
    if (newEvent.name && newEvent.date) {
      addEvent(newEvent);
      setIsAdding(false);
      setNewEvent({ name: '', date: '', time: '', location: '', status: 'em breve' });
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-24 p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Eventos</h1>
          <p className="text-slate-400 text-sm">Fique por dentro de tudo</p>
        </div>
        {user?.isAdmin && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </header>

      {/* Countdown Card */}
      {nextEvent && (
        <div className="bg-slate-800 rounded-3xl p-6 shadow-xl text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Timer className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-4">Contagem Regressiva</h3>
            <h2 className="text-xl font-bold mb-6">{nextEvent.name}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold">{timeLeft.days}</p>
                <p className="text-[10px] text-blue-200 uppercase">Dias</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold">{timeLeft.hours}</p>
                <p className="text-[10px] text-blue-200 uppercase">Horas</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold">{timeLeft.minutes}</p>
                <p className="text-[10px] text-blue-200 uppercase">Minutos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Form (Modal-like) */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
            <h2 className="text-xl font-bold text-slate-800 mb-6">Novo Evento</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do Evento"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                placeholder="Local"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-semibold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all"
                >
                  Criar Evento
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 relative group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  event.status === 'confirmado' ? 'bg-green-100 text-green-600' :
                  event.status === 'em breve' ? 'bg-blue-100 text-blue-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{event.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      event.status === 'confirmado' ? 'bg-green-500/10 text-green-600' :
                      event.status === 'em breve' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
              {user?.isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

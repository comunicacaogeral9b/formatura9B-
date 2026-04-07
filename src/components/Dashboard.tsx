/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGraduation } from '../context/GraduationContext';
import { Bell, TrendingUp, Calendar, Info, ChevronRight, Plus, Trash2, X, Share2, Check, Users } from 'lucide-react';

interface DashboardProps {
  setTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setTab }) => {
  const { user, finance, events, notices, addNotice, deleteNotice, notifications, clearNotifications } = useGraduation();
  const [newNoticeText, setNewNoticeText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleShare = () => {
    const shareUrl = window.location.origin.includes('ais-dev') 
      ? 'https://ais-pre-zhdu5dfcmv4jaj6snygnep-383897109104.us-east1.run.app'
      : window.location.href;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert(`Copie este link para a turma: ${shareUrl}`);
    });
  };

  // Sort events by date and find the closest one in the future
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextEvent = sortedEvents.find(e => new Date(e.date) >= new Date()) || sortedEvents[0];
  
  const totalBalance = finance.sales + finance.studentContributions - finance.expenses;

  const handleAddNotice = () => {
    if (newNoticeText.trim()) {
      addNotice(newNoticeText);
      setNewNoticeText('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 p-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
            <img 
              src="https://i.ibb.co/9HWjWXMH/1775578752644.jpg" 
              alt="Logo Turma"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-slate-500 text-sm font-medium">Olá, {user?.name || 'Visitante'} 👋</h2>
            <h1 className="text-2xl font-bold text-slate-900">Portal da Formatura</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className={`p-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-white text-slate-400 hover:text-blue-600'}`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setShowNotifications(true)}
            className="bg-white p-3 rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 transition-all relative"
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg">Notificações</h3>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Bell className="w-8 h-8" />
                    </div>
                    <p className="text-slate-400 text-sm">Nenhuma novidade por enquanto.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 p-2 rounded-lg ${
                          notif.type === 'event' ? 'bg-blue-100 text-blue-600' :
                          notif.type === 'notice' ? 'bg-amber-100 text-amber-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {notif.type === 'event' ? <Calendar className="w-4 h-4" /> :
                           notif.type === 'notice' ? <Info className="w-4 h-4" /> :
                           <TrendingUp className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block uppercase font-medium">
                            {formatTimeAgo(notif.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                  <button
                    onClick={() => {
                      clearNotifications();
                      setShowNotifications(false);
                    }}
                    className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Marcar todas como lidas
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Balance Card - Dark Green */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full bg-[#004d4d] rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-emerald-100/70 text-sm font-medium mb-1">Saldo Total Arrecadado</h3>
            <p className="text-4xl font-bold tracking-tight">
              R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-6 flex items-center gap-2 text-emerald-100/60 text-xs bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Atualizado em tempo real</span>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Next Event Section */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-slate-800 font-bold text-lg">Próximo Evento</h3>
            <button onClick={() => setTab('events')} className="text-blue-600 text-sm font-semibold">Ver todos</button>
          </div>
          {nextEvent ? (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{nextEvent.name}</h4>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(nextEvent.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {nextEvent.time}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  nextEvent.status === 'confirmado' ? 'bg-green-100 text-green-700' : 
                  nextEvent.status === 'em breve' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                }`}>
                  {nextEvent.status}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">Nenhum evento agendado</p>
            </div>
          )}
        </section>

        {/* Notices Wall */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-slate-800 font-bold text-lg">Avisos Recentes</h3>
          </div>

          {user?.isAdmin && (
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                placeholder="Postar um novo aviso..."
                value={newNoticeText}
                onChange={(e) => setNewNoticeText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddNotice}
                disabled={!newNoticeText.trim()}
                className="bg-blue-600 text-white p-3 rounded-2xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            {notices.length === 0 ? (
              <p className="text-slate-400 text-sm italic text-center py-4">Nenhum aviso no mural.</p>
            ) : (
              notices.map((notice) => (
                <div key={notice.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group relative">
                  <p className="text-slate-700 text-sm leading-relaxed pr-8">{notice.text}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                      {formatTimeAgo(notice.date)}
                    </span>
                    {user?.isAdmin && (
                      <button
                        onClick={() => deleteNotice(notice.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

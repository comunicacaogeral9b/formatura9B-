/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGraduation } from '../context/GraduationContext';
import { Bell, TrendingUp, Calendar, Info, ChevronRight, Plus, Trash2, X, Share2, Check, Users } from 'lucide-react';

interface DashboardProps {
  setTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setTab }) => {
  const { user, finance, events, notices, addNotice, deleteNotice } = useGraduation();
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [newNoticeText, setNewNoticeText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    // Try to get the current URL, but fallback to the shared one if needed
    const shareUrl = window.location.origin.includes('ais-dev') 
      ? 'https://ais-pre-zhdu5dfcmv4jaj6snygnep-383897109104.us-east1.run.app'
      : window.location.href;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback if clipboard API fails
      alert(`Copie este link para a turma: ${shareUrl}`);
    });
  };

  const nextEvent = events.find(e => e.status === 'confirmado') || events[0];
  const totalBalance = finance.sales + finance.studentContributions - finance.expenses;

  const handleAddNotice = () => {
    if (newNoticeText.trim()) {
      addNotice(newNoticeText);
      setNewNoticeText('');
      setIsAddingNotice(false);
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
    <div className="min-h-screen bg-blue-50 pb-24 p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-slate-400 text-sm font-medium">Olá, {user?.role === 'admin' ? 'Administrador' : 'Aluno'} 👋</h2>
          <h1 className="text-2xl font-bold text-slate-800">Formatura 9°B</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className={`p-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-white text-slate-400 hover:text-blue-600'}`}
          >
            {copied ? <Check className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
            {copied && <span className="text-xs font-bold">Copiado!</span>}
          </button>
          <button className="bg-white p-3 rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 transition-all">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {/* Finance Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTab('finance')}
          className="w-full bg-white rounded-3xl p-6 shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-slate-400 text-sm font-medium">Saldo Arrecadado</h3>
              <p className="text-2xl font-bold text-slate-800">
                R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600 transition-all" />
        </motion.button>

        {/* Next Event Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTab('events')}
          className="w-full bg-white rounded-3xl p-6 shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-4 rounded-2xl text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-slate-400 text-sm font-medium">Próximo Evento</h3>
              <p className="text-lg font-bold text-slate-800">{nextEvent?.name || 'Nenhum evento'}</p>
              <p className="text-slate-400 text-xs">{nextEvent?.date ? new Date(nextEvent.date).toLocaleDateString('pt-BR') : ''}</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-purple-600 transition-all" />
        </motion.button>

        {/* Notices Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-4 rounded-2xl text-amber-600">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-slate-800 font-bold">Avisos Recentes</h3>
            </div>
            {user?.isAdmin && (
              <button
                onClick={() => setIsAddingNotice(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {notices.length === 0 ? (
              <p className="text-slate-400 text-sm italic text-center py-4">Nenhum aviso no momento.</p>
            ) : (
              notices.map((notice) => (
                <div key={notice.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group relative">
                  <p className="text-slate-600 text-sm pr-6">{notice.text}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{formatTimeAgo(notice.date)}</span>
                  {user?.isAdmin && (
                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Notice Modal */}
      <AnimatePresence>
        {isAddingNotice && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Novo Aviso</h2>
                <button onClick={() => setIsAddingNotice(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <textarea
                  placeholder="Digite o aviso aqui..."
                  value={newNoticeText}
                  onChange={(e) => setNewNoticeText(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  onClick={handleAddNotice}
                  disabled={!newNoticeText.trim()}
                  className="w-full bg-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  Publicar Aviso
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {user?.isAdmin && (
        <div className="mt-8 bg-slate-800 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <p className="text-sm font-medium">Modo Administrador Ativo</p>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

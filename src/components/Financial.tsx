/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGraduation } from '../context/GraduationContext';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, Save, TrendingUp } from 'lucide-react';

export const Financial: React.FC = () => {
  const { user, finance, updateStudentContributions, dailyRecords } = useGraduation();
  const [newContribution, setNewContribution] = useState(finance.studentContributions.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const amount = parseFloat(newContribution);
    if (!isNaN(amount)) {
      updateStudentContributions(amount);
      setIsEditing(false);
    }
  };

  const totalBalance = finance.sales + finance.studentContributions - finance.expenses;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
        <p className="text-slate-500 text-sm">Controle de caixa da formatura</p>
      </header>

      <div className="space-y-6">
        {/* Resumo Geral - Destaque Visual */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-widest">Total em Caixa</h3>
            <p className="text-5xl font-black text-slate-900 tracking-tighter">
              <span className="text-2xl font-bold mr-1 text-slate-400">R$</span>
              {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Saldo Positivo
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50/50 rounded-full -ml-16 -mb-16 blur-3xl" />
        </motion.div>

        {/* Detalhamento */}
        <div className="grid grid-cols-1 gap-4">
          {/* Vendas */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-500 text-xs font-bold uppercase">Vendas (Loja)</h4>
                <p className="text-xl font-bold text-slate-900">
                  R$ {finance.sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Despesas */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                <ArrowDownRight className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-500 text-xs font-bold uppercase">Despesas (Saídas)</h4>
                <p className="text-xl font-bold text-slate-900">
                  R$ {finance.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Contribuição Alunos */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-slate-500 text-xs font-bold uppercase">Contribuição Alunos</h4>
                  <p className="text-xl font-bold text-slate-900">
                    R$ {finance.studentContributions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              {user?.isAdmin && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                >
                  <Plus className={`w-5 h-5 transition-transform ${isEditing ? 'rotate-45' : ''}`} />
                </button>
              )}
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-slate-50 space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                      <input
                        type="number"
                        value={newContribution}
                        onChange={(e) => setNewContribution(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSave}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Atualizar Valor
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Histórico Simplificado */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Últimas Movimentações
          </h3>
          <div className="space-y-3">
            {dailyRecords.length === 0 ? (
              <p className="text-slate-400 text-sm italic text-center py-4">Nenhuma movimentação.</p>
            ) : (
              [...dailyRecords].reverse().slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${record.expense > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {record.expense > 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {record.expense > 0 ? 'Saída' : 'Entrada (Venda)'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm font-black ${record.expense > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {record.expense > 0 ? `- R$ ${record.expense.toFixed(2)}` : `+ R$ ${record.salesAmount.toFixed(2)}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

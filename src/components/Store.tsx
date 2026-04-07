/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGraduation } from '../context/GraduationContext';
import { TrendingUp, Save, CheckCircle2, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, Trash2 } from 'lucide-react';

export const Store: React.FC = () => {
  const { user, addDailyRecord, dailyRecords, finance, deleteDailyRecord } = useGraduation();
  
  const [dailyExpense, setDailyExpense] = useState('');
  const [dailySales, setDailySales] = useState('');
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'sales'>('all');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveDaily = () => {
    const expense = parseFloat(dailyExpense) || 0;
    const sales = parseFloat(dailySales) || 0;
    
    if (expense > 0 || sales > 0) {
      addDailyRecord({
        date: dailyDate,
        expense: expense,
        salesAmount: sales,
      });
      setDailyExpense('');
      setDailySales('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const filteredRecords = dailyRecords.filter(record => {
    if (filterType === 'all') return true;
    if (filterType === 'expense') return record.expense > 0;
    if (filterType === 'sales') return record.salesAmount > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-blue-50 pb-24 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Loja da Turma</h1>
        <p className="text-slate-400 text-sm">Controle de vendas e gastos</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center text-green-600 mb-4">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Vendas</h3>
          <p className="text-lg font-bold text-slate-800">
            R$ {finance.sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="bg-red-100 w-10 h-10 rounded-xl flex items-center justify-center text-red-600 mb-4">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Despesas</h3>
          <p className="text-lg font-bold text-slate-800">
            R$ {finance.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Admin: Daily Records Input */}
      {user?.isAdmin && (
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-800 font-bold">Novo Registro</h3>
              <p className="text-slate-400 text-xs">Insira os valores do dia</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Data
              </label>
              <input
                type="date"
                value={dailyDate}
                onChange={(e) => setDailyDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Vendas ($)
                </label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={dailySales}
                  onChange={(e) => setDailySales(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Gasto ($)
                </label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={dailyExpense}
                  onChange={(e) => setDailyExpense(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveDaily}
            className="w-full bg-slate-800 text-white font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-all relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2 text-green-400"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Salvo!
                </motion.div>
              ) : (
                <motion.div
                  key="save"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Salvar Registro
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      )}

      {/* Daily Records History with Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-800 font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Histórico
          </h3>
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Gastos
            </button>
            <button
              onClick={() => setFilterType('sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'sales' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Vendas
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm italic">Nenhum registro.</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${record.expense > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {record.expense > 0 ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">
                        {record.expense > 0 ? `Gasto: R$ ${record.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : `Venda: R$ ${record.salesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </p>
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {user?.isAdmin && (
                  <button
                    onClick={() => deleteDailyRecord(record.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Excluir registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

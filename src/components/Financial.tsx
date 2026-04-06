/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGraduation } from '../context/GraduationContext';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, Save } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-blue-50 pb-24 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Financeiro</h1>
        <p className="text-slate-400 text-sm">Resumo financeiro da formatura</p>
      </header>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
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

        {/* Total Balance Card */}
        <div className="bg-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl" />
          <div className="absolute -left-4 -bottom-4 bg-blue-500/20 w-32 h-32 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-blue-300 text-sm font-medium mb-2">Saldo Total em Caixa</h3>
            <p className="text-4xl font-bold">
              R$ {(finance.sales + finance.studentContributions - finance.expenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              Atualizado em tempo real
            </div>
          </div>
        </div>

        {/* Admin Only: Student Contributions */}
        {user?.isAdmin && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-slate-800 font-bold">Contribuição dos Alunos</h3>
                  <p className="text-slate-400 text-xs">Visível apenas para ADM</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                  <input
                    type="number"
                    value={newContribution}
                    onChange={(e) => setNewContribution(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Salvar Alteração
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                <p className="text-2xl font-bold text-slate-800">
                  R$ {finance.studentContributions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                  ADMIN
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transaction History from Daily Records */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-800 font-bold mb-4">Últimas Movimentações</h3>
          <div className="space-y-4">
            {dailyRecords.length === 0 ? (
              <p className="text-slate-400 text-sm italic text-center py-4">Nenhuma movimentação registrada.</p>
            ) : (
              [...dailyRecords].reverse().slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${record.expense > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {record.expense > 0 ? <ArrowDownRight className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {record.expense > 0 ? 'Gasto Registrado' : 'Venda Registrada'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${record.expense > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {record.expense > 0 ? `- R$ ${record.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : `+ R$ ${record.salesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
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

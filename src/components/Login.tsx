/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGraduation } from '../context/GraduationContext';
import { JellyfishIcon } from './JellyfishIcon';
import { Key, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useGraduation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError('Por favor, insira o código de convite');
      return;
    }
    
    const success = login(code);
    if (!success) {
      setError('Código inválido. Verifique com o representante.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center"
      >
        <div className="bg-slate-800 p-4 rounded-2xl mb-6">
          <JellyfishIcon className="w-12 h-12 text-blue-300" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Formatura 9°B</h1>
        <p className="text-slate-500 text-center mb-8">Insira o código de convite da turma para acessar.</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Código de Convite"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              className={`w-full bg-slate-50 border ${error ? 'border-red-300' : 'border-slate-100'} rounded-2xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase`}
            />
          </div>
          {error && <p className="text-red-500 text-sm ml-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-slate-800 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Acessar Portal
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Dica: O código da turma é único para todos os alunos.</p>
        </div>
      </motion.div>
    </div>
  );
};

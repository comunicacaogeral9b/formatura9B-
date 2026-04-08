/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGraduation } from '../context/GraduationContext';
import { Key, ArrowRight, User as UserIcon } from 'lucide-react';

export const Login: React.FC = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useGraduation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError('Por favor, insira o código de convite');
      return;
    }
    if (!name) {
      setError('Por favor, insira seu nome');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await login(code, name);
      if (!success) {
        setError('Código inválido. Verifique com o representante.');
      }
    } catch (err) {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 flex flex-col items-center border border-slate-100"
      >
        <div className="mb-8">
          <div className="bg-slate-100 p-1 rounded-[2.5rem] shadow-lg shadow-slate-200 overflow-hidden w-24 h-24 flex items-center justify-center border-4 border-white">
            <img 
              src="https://i.ibb.co/9HWjWXMH/1775578752644.jpg" 
              alt="Logo Formatura"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Portal 9°B</h1>
        <p className="text-slate-500 text-center mb-10 text-sm leading-relaxed">Identifique-se e insira o código da turma para acessar o portal da formatura.</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative group">
            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Seu Nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] py-4 pl-14 pr-5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="relative group">
            <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Código de Convite"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              className={`w-full bg-slate-50 border ${error.includes('Código') ? 'border-red-300' : 'border-slate-100'} rounded-[1.25rem] py-4 pl-14 pr-5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase`}
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-xs font-bold ml-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-5 rounded-[1.25rem] shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
          >
            Entrar no Portal
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Formatura 2026 • 9° Ano B</p>
        </div>
      </motion.div>
    </div>
  );
};

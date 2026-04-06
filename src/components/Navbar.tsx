/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, DollarSign, Calendar, ShoppingBag, Users, LogOut } from 'lucide-react';
import { useGraduation } from '../context/GraduationContext';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
  const { logout } = useGraduation();

  const tabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'finance', icon: DollarSign, label: 'Financeiro' },
    { id: 'events', icon: Calendar, label: 'Eventos' },
    { id: 'store', icon: ShoppingBag, label: 'Loja' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between shadow-2xl z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-100' : ''}`} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
      <button
        onClick={logout}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-500 transition-all"
      >
        <LogOut className="w-6 h-6" />
        <span className="text-[10px] font-medium">Sair</span>
      </button>
    </div>
  );
};

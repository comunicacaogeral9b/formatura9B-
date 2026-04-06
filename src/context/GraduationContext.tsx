/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Event, Product, FinanceData, DailyRecord, Notice } from '../types';

interface GraduationContextType {
  user: User | null;
  login: (code: string) => boolean;
  logout: () => void;
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  dailyRecords: DailyRecord[];
  addDailyRecord: (record: Omit<DailyRecord, 'id'>) => void;
  notices: Notice[];
  addNotice: (text: string) => void;
  deleteNotice: (id: string) => void;
  finance: FinanceData;
  studentContributions: number;
  updateStudentContributions: (amount: number) => void;
}

const GraduationContext = createContext<GraduationContextType | undefined>(undefined);

const ADMIN_CODE = 'ADM9B';
const CLASS_CODE = 'TURMA9B';

export const GraduationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([
    { id: '1', name: 'Festa dos 100 Dias', date: '2026-05-15', time: '19:00', location: 'Salão de Festas Central', status: 'confirmado' },
    { id: '2', name: 'Churrasco da Turma', date: '2026-07-10', time: '12:00', location: 'Chácara Recanto', status: 'em breve' },
  ]);
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Camiseta 9°B', price: 45.00, quantity: 50 },
    { id: '2', name: 'Caneca Personalizada', price: 25.00, quantity: 30 },
  ]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [notices, setNotices] = useState<Notice[]>([
    { id: '1', text: 'Reunião de pais agendada para o próximo sábado às 14h.', date: new Date().toISOString() },
    { id: '2', text: 'Novos produtos disponíveis na loja da turma!', date: new Date(Date.now() - 86400000).toISOString() },
  ]);
  const [studentContributions, setStudentContributions] = useState<number>(1500.00);

  const login = (code: string) => {
    const normalizedCode = code.toUpperCase().trim();
    if (normalizedCode === ADMIN_CODE) {
      setUser({ code: normalizedCode, isAdmin: true, role: 'admin' });
      return true;
    } else if (normalizedCode === CLASS_CODE) {
      setUser({ code: normalizedCode, isAdmin: false, role: 'student' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const addEvent = (event: Omit<Event, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addDailyRecord = (record: Omit<DailyRecord, 'id'>) => {
    setDailyRecords(prev => [...prev, { ...record, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const addNotice = (text: string) => {
    setNotices(prev => [{ id: Math.random().toString(36).substr(2, 9), text, date: new Date().toISOString() }, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const updateStudentContributions = (amount: number) => {
    setStudentContributions(amount);
  };

  // Derived Finance Data with useMemo for guaranteed reactivity
  const finance: FinanceData = useMemo(() => ({
    expenses: dailyRecords.reduce((acc, curr) => acc + curr.expense, 0),
    sales: dailyRecords.reduce((acc, curr) => acc + curr.salesAmount, 0),
    studentContributions: studentContributions,
  }), [dailyRecords, studentContributions]);

  return (
    <GraduationContext.Provider value={{
      user, login, logout,
      events, addEvent, updateEvent, deleteEvent,
      products, addProduct, updateProduct, deleteProduct,
      dailyRecords, addDailyRecord,
      notices, addNotice, deleteNotice,
      finance,
      studentContributions, updateStudentContributions
    }}>
      {children}
    </GraduationContext.Provider>
  );
};

export const useGraduation = () => {
  const context = useContext(GraduationContext);
  if (context === undefined) {
    throw new Error('useGraduation must be used within a GraduationProvider');
  }
  return context;
};

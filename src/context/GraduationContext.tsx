/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Event, Product, FinanceData, DailyRecord, Notice, Notification } from '../types';

interface GraduationContextType {
  user: User | null;
  login: (code: string, name: string) => boolean;
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
  deleteDailyRecord: (id: string) => void;
  notices: Notice[];
  addNotice: (text: string) => void;
  deleteNotice: (id: string) => void;
  finance: FinanceData;
  studentContributions: number;
  updateStudentContributions: (amount: number) => void;
  notifications: Notification[];
  clearNotifications: () => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    setNotifications(prev => [
      {
        id: Math.random().toString(36).substr(2, 9),
        title,
        message,
        date: new Date().toISOString(),
        type
      },
      ...prev
    ]);
  };

  const login = (code: string, name: string) => {
    const normalizedCode = code.toUpperCase().trim();
    if (normalizedCode === ADMIN_CODE) {
      setUser({ code: normalizedCode, name: name || 'Administrador', isAdmin: true, role: 'admin' });
      return true;
    } else if (normalizedCode === CLASS_CODE) {
      setUser({ code: normalizedCode, name: name || 'Aluno', isAdmin: false, role: 'student' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
    setEvents(prev => [...prev, newEvent]);
    addNotification('Novo Evento', `O evento "${event.name}" foi adicionado.`, 'event');
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
    const event = events.find(e => e.id === id);
    if (event) {
      addNotification('Evento Atualizado', `O evento "${event.name}" foi modificado.`, 'event');
    }
  };

  const deleteEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (event) {
      addNotification('Evento Removido', `O evento "${event.name}" foi cancelado/removido.`, 'event');
    }
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
    if (record.salesAmount > 0) {
      addNotification('Nova Venda', `Uma nova venda de R$ ${record.salesAmount.toLocaleString('pt-BR')} foi registrada.`, 'finance');
    }
  };

  const deleteDailyRecord = (id: string) => {
    setDailyRecords(prev => prev.filter(r => r.id !== id));
  };

  const addNotice = (text: string) => {
    setNotices(prev => [{ id: Math.random().toString(36).substr(2, 9), text, date: new Date().toISOString() }, ...prev]);
    addNotification('Novo Aviso', text, 'notice');
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const updateStudentContributions = (amount: number) => {
    setStudentContributions(amount);
    addNotification('Finanças Atualizadas', 'O valor das contribuições dos alunos foi atualizado.', 'finance');
  };

  const clearNotifications = () => setNotifications([]);

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
      dailyRecords, addDailyRecord, deleteDailyRecord,
      notices, addNotice, deleteNotice,
      finance,
      studentContributions, updateStudentContributions,
      notifications, clearNotifications
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

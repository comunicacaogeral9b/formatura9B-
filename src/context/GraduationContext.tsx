/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Event, Product, FinanceData, DailyRecord, Notice, Notification } from '../types';
import { db, auth } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface GraduationContextType {
  user: User | null;
  login: (code: string, name: string) => Promise<boolean>;
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
  isAuthReady: boolean;
}

const GraduationContext = createContext<GraduationContextType | undefined>(undefined);

const ADMIN_CODE = 'ADM9B';
const CLASS_CODE = 'TURMA9B';

export const GraduationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('graduation_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [studentContributions, setStudentContributions] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setIsAuthReady(true);
      } else {
        setIsAuthReady(false);
        // If we have a local user but no firebase user, try to sign in anonymously
        if (user) {
          signInAnonymously(auth).catch(err => console.error("Auto sign-in failed", err));
        }
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Real-time listeners
  useEffect(() => {
    if (!isAuthReady) return;

    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'events'));

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    const unsubRecords = onSnapshot(collection(db, 'dailyRecords'), (snapshot) => {
      setDailyRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyRecord)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'dailyRecords'));

    const unsubNotices = onSnapshot(query(collection(db, 'notices'), orderBy('date', 'desc')), (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'notices'));

    const unsubConfig = onSnapshot(doc(db, 'config', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setStudentContributions(snapshot.data().studentContributions || 0);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/global'));

    const unsubNotifications = onSnapshot(query(collection(db, 'notifications'), orderBy('date', 'desc'), limit(20)), (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'notifications'));

    return () => {
      unsubEvents();
      unsubProducts();
      unsubRecords();
      unsubNotices();
      unsubConfig();
      unsubNotifications();
    };
  }, [isAuthReady]);

  const addNotification = async (title: string, message: string, type: Notification['type']) => {
    if (!user?.isAdmin) return;
    try {
      await addDoc(collection(db, 'notifications'), {
        title,
        message,
        date: new Date().toISOString(),
        type
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'notifications');
    }
  };

  const login = async (code: string, name: string) => {
    const normalizedCode = code.toUpperCase().trim();
    let newUser: User | null = null;

    if (normalizedCode === ADMIN_CODE) {
      newUser = { code: normalizedCode, name: name || 'Administrador', isAdmin: true, role: 'admin' };
    } else if (normalizedCode === CLASS_CODE) {
      newUser = { code: normalizedCode, name: name || 'Aluno', isAdmin: false, role: 'student' };
    }

    if (newUser) {
      try {
        await signInAnonymously(auth);
        setUser(newUser);
        localStorage.setItem('graduation_user', JSON.stringify(newUser));
        return true;
      } catch (error) {
        console.error("Login failed", error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    auth.signOut();
    setUser(null);
    localStorage.removeItem('graduation_user');
  };

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      await addDoc(collection(db, 'events'), event);
      addNotification('Novo Evento', `O evento "${event.name}" foi adicionado.`, 'event');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'events');
    }
  };

  const updateEvent = async (id: string, updatedEvent: Partial<Event>) => {
    try {
      await updateDoc(doc(db, 'events', id), updatedEvent);
      const event = events.find(e => e.id === id);
      if (event) {
        addNotification('Evento Atualizado', `O evento "${event.name}" foi modificado.`, 'event');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${id}`);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const event = events.find(e => e.id === id);
      await deleteDoc(doc(db, 'events', id));
      if (event) {
        addNotification('Evento Removido', `O evento "${event.name}" foi cancelado/removido.`, 'event');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), updatedProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const addDailyRecord = async (record: Omit<DailyRecord, 'id'>) => {
    try {
      await addDoc(collection(db, 'dailyRecords'), record);
      if (record.salesAmount > 0) {
        addNotification('Nova Venda', `Uma nova venda de R$ ${record.salesAmount.toLocaleString('pt-BR')} foi registrada.`, 'finance');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'dailyRecords');
    }
  };

  const deleteDailyRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'dailyRecords', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `dailyRecords/${id}`);
    }
  };

  const addNotice = async (text: string) => {
    try {
      await addDoc(collection(db, 'notices'), { text, date: new Date().toISOString() });
      addNotification('Novo Aviso', text, 'notice');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'notices');
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notices', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notices/${id}`);
    }
  };

  const updateStudentContributions = async (amount: number) => {
    try {
      await setDoc(doc(db, 'config', 'global'), { studentContributions: amount }, { merge: true });
      addNotification('Finanças Atualizadas', 'O valor das contribuições dos alunos foi atualizado.', 'finance');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/global');
    }
  };

  const clearNotifications = () => {
    // In a real app, we might want to mark them as read per user
    // For now, we'll just leave them in Firestore as they are shared
  };

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
      notifications, clearNotifications,
      isAuthReady
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

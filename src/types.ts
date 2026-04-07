/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  code: string;
  name: string;
  isAdmin: boolean;
  role: 'admin' | 'student';
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  status: 'confirmado' | 'em breve' | 'cancelado';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface FinanceData {
  expenses: number;
  sales: number;
  studentContributions: number;
}

export interface Notice {
  id: string;
  text: string;
  date: string;
}

export interface DailyRecord {
  id: string;
  date: string;
  expense: number;
  salesAmount: number;
  observation?: string;
}

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
}

export type UserRole = 'viewer' | 'admin';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Mock data generator
const generateMockTransactions = (): Transaction[] => {
  const categories = {
    expense: ['Food', 'Shopping', 'Travel', 'Entertainment', 'Bills', 'Healthcare', 'Transportation'],
    income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other Income']
  };

  const transactions: Transaction[] = [
    { id: '1', date: '2026-04-05', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { id: '2', date: '2026-04-04', amount: 85.50, category: 'Food', type: 'expense', description: 'Grocery shopping' },
    { id: '3', date: '2026-04-03', amount: 1200, category: 'Bills', type: 'expense', description: 'Rent payment' },
    { id: '4', date: '2026-04-02', amount: 45.00, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
    { id: '5', date: '2026-04-01', amount: 500, category: 'Freelance', type: 'income', description: 'Website project' },
    { id: '6', date: '2026-03-31', amount: 120.75, category: 'Shopping', type: 'expense', description: 'Clothing' },
    { id: '7', date: '2026-03-30', amount: 67.25, category: 'Food', type: 'expense', description: 'Restaurant dinner' },
    { id: '8', date: '2026-03-29', amount: 200, category: 'Investment', type: 'income', description: 'Stock dividend' },
    { id: '9', date: '2026-03-28', amount: 95.00, category: 'Transportation', type: 'expense', description: 'Gas and parking' },
    { id: '10', date: '2026-03-27', amount: 250, category: 'Healthcare', type: 'expense', description: 'Doctor visit' },
    { id: '11', date: '2026-03-26', amount: 42.50, category: 'Food', type: 'expense', description: 'Coffee and snacks' },
    { id: '12', date: '2026-03-25', amount: 380.00, category: 'Travel', type: 'expense', description: 'Flight booking' },
    { id: '13', date: '2026-03-24', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { id: '14', date: '2026-03-23', amount: 150.00, category: 'Entertainment', type: 'expense', description: 'Concert tickets' },
    { id: '15', date: '2026-03-22', amount: 78.90, category: 'Food', type: 'expense', description: 'Grocery shopping' },
    { id: '16', date: '2026-03-21', amount: 65.00, category: 'Shopping', type: 'expense', description: 'Electronics' },
    { id: '17', date: '2026-03-20', amount: 1000, category: 'Bonus', type: 'income', description: 'Performance bonus' },
    { id: '18', date: '2026-03-19', amount: 110.00, category: 'Bills', type: 'expense', description: 'Internet and utilities' },
    { id: '19', date: '2026-03-18', amount: 55.25, category: 'Food', type: 'expense', description: 'Lunch meetings' },
    { id: '20', date: '2026-03-17', amount: 89.00, category: 'Transportation', type: 'expense', description: 'Uber rides' },
  ];

  return transactions;
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions());
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, ...updatedFields } : t
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        userRole,
        setUserRole,
        theme,
        setTheme,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

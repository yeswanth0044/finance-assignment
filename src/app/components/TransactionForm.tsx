import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance, Transaction } from '../context/FinanceContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TransactionFormProps {
  onClose: () => void;
  transaction?: Transaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, transaction }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    amount: transaction?.amount?.toString() || '',
    category: transaction?.category || '',
    type: transaction?.type || 'expense' as 'income' | 'expense',
    description: transaction?.description || '',
  });

  const expenseCategories = ['Food', 'Shopping', 'Travel', 'Entertainment', 'Bills', 'Healthcare', 'Transportation'];
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other Income'];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      return;
    }

    const transactionData = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description,
    };

    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData({ ...formData, type, category: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <Label htmlFor="type">Type</Label>
            <div className="flex gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-colors ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-colors ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="mt-1.5"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {transaction ? 'Update' : 'Add'} Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

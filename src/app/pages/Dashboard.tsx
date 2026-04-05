import { useState, useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { SummaryCard } from '../components/SummaryCard';
import { TransactionForm } from '../components/TransactionForm';
import { Button } from '../components/ui/button';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  const { transactions, userRole } = useFinance();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;

    return {
      balance,
      totalIncome,
      totalExpenses,
    };
  }, [transactions]);

  // Prepare data for line chart (balance over time)
  const lineChartData = useMemo(() => {
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let runningBalance = 0;
    const data: Array<{ date: string; balance: number; uniqueKey: string }> = [];
    
    sortedTransactions.forEach((t, index) => {
      runningBalance += t.type === 'income' ? t.amount : -t.amount;
      const dateStr = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      data.push({
        date: dateStr,
        balance: runningBalance,
        uniqueKey: `${t.date}-${index}`, // Unique key combining date and index
      });
    });

    // Group by date and keep only the last entry for each date
    const dateMap = new Map<string, { date: string; balance: number; uniqueKey: string }>();
    data.forEach(item => {
      dateMap.set(item.date, item);
    });

    return Array.from(dateMap.values()).slice(-15); // Last 15 unique dates
  }, [transactions]);

  // Prepare data for pie chart (expenses by category)
  const pieChartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  // Top insights
  const insights = useMemo(() => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const topCategory = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      topSpendingCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      savingsRate: summary.totalIncome > 0 
        ? ((summary.balance / summary.totalIncome) * 100).toFixed(1) 
        : '0',
    };
  }, [transactions, summary]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        {userRole === 'admin' && (
          <Button
            onClick={() => setShowTransactionForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          value={`$${summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Wallet}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <SummaryCard
          title="Total Income"
          value={`$${summary.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <SummaryCard
          title="Total Expenses"
          value={`$${summary.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Top Spending Category</h3>
          {insights.topSpendingCategory ? (
            <div>
              <p className="text-2xl font-semibold text-gray-900">{insights.topSpendingCategory.name}</p>
              <p className="text-lg text-gray-600 mt-1">
                ${insights.topSpendingCategory.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No expense data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Savings Rate</h3>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{insights.savingsRate}%</p>
            <p className="text-sm text-gray-600 mt-1">Of total income saved</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Balance Over Time</h3>
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Expenses by Category</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <a href="/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </a>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No transactions yet
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm onClose={() => setShowTransactionForm(false)} />
      )}
    </div>
  );
};
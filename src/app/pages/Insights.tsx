import { useMemo } from 'react';
import { TrendingUp, TrendingDown, PieChart, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Insights = () => {
  const { transactions } = useFinance();

  // Calculate insights
  const insights = useMemo(() => {
    // Total income and expenses
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Expenses by category
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const topSpendingCategory = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])[0];

    // Income by category
    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const topIncomeSource = Object.entries(incomeByCategory)
      .sort((a, b) => b[1] - a[1])[0];

    // Average transaction amounts
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const avgIncome = incomeTransactions.length > 0
      ? incomeTransactions.reduce((sum, t) => sum + t.amount, 0) / incomeTransactions.length
      : 0;

    const avgExpense = expenseTransactions.length > 0
      ? expenseTransactions.reduce((sum, t) => sum + t.amount, 0) / expenseTransactions.length
      : 0;

    // Savings rate
    const savingsRate = totalIncome > 0 
      ? ((totalIncome - totalExpenses) / totalIncome) * 100 
      : 0;

    // Monthly breakdown
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    // Spending trend
    const last7Days = transactions.filter(t => {
      const date = new Date(t.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo && t.type === 'expense';
    });

    const last7DaysTotal = last7Days.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      topSpendingCategory: topSpendingCategory ? { name: topSpendingCategory[0], amount: topSpendingCategory[1] } : null,
      topIncomeSource: topIncomeSource ? { name: topIncomeSource[0], amount: topIncomeSource[1] } : null,
      avgIncome,
      avgExpense,
      savingsRate,
      monthlyData,
      last7DaysSpending: last7DaysTotal,
      expensesByCategory,
    };
  }, [transactions]);

  // Prepare chart data
  const monthlyChartData = useMemo(() => {
    return Object.entries(insights.monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    }));
  }, [insights.monthlyData]);

  const categoryChartData = useMemo(() => {
    return Object.entries(insights.expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [insights.expensesByCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Financial Insights</h1>
        <p className="text-sm text-gray-600 mt-1">Deep dive into your financial patterns and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-blue-100 rounded-lg p-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Net Balance</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${insights.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs mt-2 ${insights.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {insights.balance >= 0 ? 'Positive balance' : 'Negative balance'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
          <p className="text-2xl font-semibold text-gray-900">
            {insights.savingsRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-2">Of total income</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-green-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg. Income</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${insights.avgIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-2">Per transaction</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-red-100 rounded-lg p-3">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg. Expense</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${insights.avgExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-2">Per transaction</p>
        </div>
      </div>

      {/* Category Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 rounded-lg p-2">
              <PieChart className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Top Spending Category</h3>
          </div>
          {insights.topSpendingCategory ? (
            <div>
              <p className="text-2xl font-semibold text-gray-900 mb-2">
                {insights.topSpendingCategory.name}
              </p>
              <p className="text-lg text-gray-600 mb-3">
                ${insights.topSpendingCategory.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-700">
                  This category represents{' '}
                  {((insights.topSpendingCategory.amount / insights.totalExpenses) * 100).toFixed(1)}%
                  {' '}of your total expenses
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No expense data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 rounded-lg p-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Top Income Source</h3>
          </div>
          {insights.topIncomeSource ? (
            <div>
              <p className="text-2xl font-semibold text-gray-900 mb-2">
                {insights.topIncomeSource.name}
              </p>
              <p className="text-lg text-gray-600 mb-3">
                ${insights.topIncomeSource.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  This source represents{' '}
                  {((insights.topIncomeSource.amount / insights.totalIncome) * 100).toFixed(1)}%
                  {' '}of your total income
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No income data available</p>
          )}
        </div>
      </div>

      {/* Recent Spending Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 rounded-lg p-2">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Last 7 Days Spending</h3>
        </div>
        <p className="text-3xl font-semibold text-gray-900 mb-2">
          ${insights.last7DaysSpending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-gray-600">
          Average daily spending: ${(insights.last7DaysSpending / 7).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Income vs Expenses</h3>
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
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
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Top 5 Expense Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 5 Expense Categories</h3>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Health Summary</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Savings Rate:</span>{' '}
                {insights.savingsRate >= 20 ? (
                  <span className="text-green-600">Excellent! You're saving over 20% of your income.</span>
                ) : insights.savingsRate >= 10 ? (
                  <span className="text-blue-600">Good! You're saving {insights.savingsRate.toFixed(1)}% of your income.</span>
                ) : insights.savingsRate > 0 ? (
                  <span className="text-orange-600">Consider increasing your savings rate. Currently at {insights.savingsRate.toFixed(1)}%.</span>
                ) : (
                  <span className="text-red-600">Warning: Your expenses exceed your income.</span>
                )}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Balance:</span>{' '}
                {insights.balance >= 0 ? (
                  <span className="text-green-600">You have a positive balance of ${insights.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.</span>
                ) : (
                  <span className="text-red-600">You have a deficit of ${Math.abs(insights.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

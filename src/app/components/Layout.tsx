import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Receipt, TrendingUp, Settings as SettingsIcon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Layout = () => {
  const location = useLocation();
  const { userRole } = useFinance();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Insights', path: '/insights', icon: TrendingUp },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Finance Dashboard</span>
              </div>
              
              <div className="hidden md:flex gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-xs text-gray-600">Role:</span>
                <span className="ml-2 text-sm font-medium text-gray-900 capitalize">{userRole}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex justify-around px-4 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

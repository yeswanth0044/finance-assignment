import { Shield, User, Moon, Sun } from 'lucide-react';
import { useFinance, UserRole } from '../context/FinanceContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';

export const Settings = () => {
  const { userRole, setUserRole, theme, setTheme } = useFinance();

  const handleRoleChange = (role: string) => {
    setUserRole(role as UserRole);
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Role Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 rounded-lg p-3">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Role Management</h2>
            <p className="text-sm text-gray-600 mb-6">
              Switch between different roles to see how the application behaves with different permission levels.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Role
                </label>
                <Select value={userRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className={`p-4 rounded-lg border-2 transition-all ${
                  userRole === 'viewer' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Viewer</h3>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View all transactions</li>
                    <li>• Access dashboard and insights</li>
                    <li>• Filter and search data</li>
                    <li>• <span className="text-red-600">Cannot add, edit, or delete</span></li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg border-2 transition-all ${
                  userRole === 'admin' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Admin</h3>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• All viewer permissions</li>
                    <li>• Add new transactions</li>
                    <li>• Edit existing transactions</li>
                    <li>• Delete transactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 rounded-lg p-3">
            {theme === 'dark' ? (
              <Moon className="w-6 h-6 text-purple-600" />
            ) : (
              <Sun className="w-6 h-6 text-purple-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Appearance</h2>
            <p className="text-sm text-gray-600 mb-6">
              Customize how the application looks and feels.
            </p>

            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={handleThemeToggle}
              />
            </div>

            {theme === 'dark' && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Dark mode is currently set but not fully implemented in this demo. 
                  The preference is saved and can be used to apply dark theme styles throughout the application.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

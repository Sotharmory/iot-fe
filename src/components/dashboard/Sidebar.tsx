import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Unlock, 
  Settings, 
  FileText, 
  Wifi, 
  Users, 
  LogIn,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

export function Sidebar({ 
  activeTab, 
  onTabChange, 
  user, 
  onLogout 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    {
      id: 'unlock',
      label: 'Mở Khóa Cửa',
      icon: Unlock,
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 'manage',
      label: 'Quản Lý Hệ Thống',
      icon: Settings,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'logs',
      label: 'Nhật Ký Truy Cập',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'esp32',
      label: 'ESP32 Ngoại Tuyến',
      icon: Wifi,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'guests',
      label: 'Quản Lý Người Dùng',
      icon: Users,
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'guest-login',
      label: 'Đăng Nhập Khách',
      icon: LogIn,
      color: 'from-gray-500 to-slate-600'
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-800">IoT Smart Lock</h1>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.username}
              </p>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs mt-1">
                Admin
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title={isCollapsed ? tab.label : undefined}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {tab.label}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={onLogout}
          variant="outline"
          size={isCollapsed ? "sm" : "default"}
          className={`${isCollapsed ? 'w-8 h-8 p-0' : 'w-full'} hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors`}
          title={isCollapsed ? "Đăng Xuất" : undefined}
        >
          <LogOut className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2'}`} />
          {!isCollapsed && "Đăng Xuất"}
        </Button>
      </div>
    </div>
  );
}

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Unlock, 
  Settings, 
  FileText, 
  Wifi, 
  Users, 
  LogIn,
  LogOut
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
}

export function NavigationTabs({ 
  activeTab, 
  onTabChange, 
  user, 
  onLogout, 
  children 
}: NavigationTabsProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* User Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">IoT Smart Lock System</h1>
                  <p className="text-sm text-gray-600">Chào mừng, {user.username}</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                Admin
              </Badge>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-8">
          {/* Enhanced Navigation Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-transparent">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
                        data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.color} data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105
                        data-[state=inactive]:bg-white/50 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:shadow-md
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

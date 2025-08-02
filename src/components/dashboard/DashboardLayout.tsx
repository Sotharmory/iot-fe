import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
}

export function DashboardLayout({ 
  activeTab, 
  onTabChange, 
  user, 
  onLogout, 
  children 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        onLogout={onLogout}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle(activeTab)}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {getPageDescription(activeTab)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function getPageTitle(activeTab: string): string {
  switch (activeTab) {
    case 'unlock':
      return 'Mở Khóa Cửa';
    case 'manage':
      return 'Quản Lý Hệ Thống';
    case 'logs':
      return 'Nhật Ký Truy Cập';
    case 'esp32':
      return 'ESP32 Ngoại Tuyến';
    case 'guests':
      return 'Quản Lý Người Dùng';
    case 'guest-login':
      return 'Đăng Nhập Khách';
    default:
      return 'Dashboard';
  }
}

function getPageDescription(activeTab: string): string {
  switch (activeTab) {
    case 'unlock':
      return 'Mở khóa cửa bằng mã PIN hoặc thẻ NFC';
    case 'manage':
      return 'Quản lý mã PIN và thẻ NFC trong hệ thống';
    case 'logs':
      return 'Xem lịch sử truy cập và hoạt động hệ thống';
    case 'esp32':
      return 'Quản lý thiết bị ESP32 khi mất kết nối';
    case 'guests':
      return 'Quản lý tài khoản và quyền truy cập người dùng';
    case 'guest-login':
      return 'Đăng nhập dành cho khách';
    default:
      return 'Hệ thống quản lý khóa thông minh';
  }
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { LoginForm } from './LoginForm';
import { GuestDashboard } from './GuestDashboard';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { UnlockTab } from './components/dashboard/UnlockTab';
import { ManageTab } from './components/dashboard/ManageTab';
import { LogsTab } from './components/dashboard/LogsTab';
import { ToastProvider } from './components/ToastProvider';
import { Skeleton } from './components/ui/skeleton';

const API_URL = 'http://165.232.169.151:3000/api';
console.log('API_URL constant loaded:', API_URL);

// Helper function to get auth headers with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

type Code = { code: string; type: string; expires_at: string };
type Card = { id: string; enrolled_at: string };
type Log = { method: string; code: string; time: string; success: boolean; user_name?: string; user_id?: number };

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <ToastProvider />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <LoginForm />
        </div>
      </>
    );
  }

  return (
    <>
      <ToastProvider />
      <AuthenticatedApp user={user} />
    </>
  );
}

function AuthenticatedApp({ user }: { user: any }) {
  const { logout } = useAuth();
  
  // Show different dashboards based on user type
  if (user.type === 'guest') {
    return <GuestDashboard />;
  }
  
  // Admin dashboard with existing functionality
  const [code, setCode] = useState('');
  const [ttl, setTtl] = useState(300);
  const [type, setType] = useState('otp');
  const [nfcId, setNfcId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('unlock');

  const [codes, setCodes] = useState<Code[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [logPage, setLogPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const LOG_LIMIT = 20;
  
  // Log sorting and filtering state
  const [logSortBy, setLogSortBy] = useState('time');
  const [logSortOrder, setLogSortOrder] = useState('desc');
  const [logFilterBy, setLogFilterBy] = useState('');
  const [logFilterValue, setLogFilterValue] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  const showMessage = (message: string) => {
    if (message.includes('✅')) {
      toast.success(message.replace('✅ ', ''));
    } else if (message.includes('❌')) {
      toast.error(message.replace('❌ ', ''));
    } else if (message.includes('🔓')) {
      toast.success(message.replace('🔓 ', ''));
    } else {
      toast.info(message);
    }
  };

  const handleCreateCode = async () => {
    if (!code || code.length !== 6) {
      showMessage('❌ Vui lòng nhập mã 6 chữ số hợp lệ');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/create-code`, { code, ttlSeconds: Number(ttl), type }, getAuthHeaders());
      showMessage(`✅ Mã ${res.data.code} đã được tạo thành công!`);
      setCode('');
      fetchActive();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showMessage(`❌ ${err.response?.data?.error || 'Lỗi khi tạo mã'}`);
      } else {
        showMessage('❌ Lỗi khi tạo mã');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCode = async (codeToDelete?: string) => {
    const codeToUse = codeToDelete || code;
    if (!codeToUse) {
      showMessage('❌ Vui lòng nhập mã cần xóa');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/delete-code`, { code: codeToUse }, getAuthHeaders());
      showMessage(`✅ ${res.data.message}`);
      if (!codeToDelete) setCode('');
      fetchActive();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showMessage(`❌ ${err.response?.data?.error || 'Lỗi khi xóa mã'}`);
      } else {
        showMessage('❌ Lỗi khi xóa mã');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!code) {
      showMessage('❌ Vui lòng nhập mã để mở khóa');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/unlock`, { code }, getAuthHeaders());
      showMessage(`🔓 Đã mở khóa bằng ${res.data.method === 'nfc' ? 'thẻ NFC' : 'mã số'}`);
      setCode('');
      fetchLogs(logPage);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showMessage(`❌ ${err.response?.data?.error || 'Mở khóa thất bại'}`);
      } else {
        showMessage('❌ Mở khóa thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const body = nfcId ? { id: nfcId } : {};
      const res = await axios.post(`${API_URL}/enroll`, body, getAuthHeaders());
      showMessage(`✅ ${res.data.message || `Thẻ ${res.data.id} đã được đăng ký`}`);
      setNfcId('');
      fetchActive();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showMessage(`❌ ${err.response?.data?.error || 'Đăng ký thẻ thất bại'}`);
      } else {
        showMessage('❌ Đăng ký thẻ thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisenroll = async (cardId?: string) => {
    const idToUse = cardId || nfcId;
    if (!idToUse) {
      showMessage('❌ Vui lòng nhập ID thẻ cần hủy đăng ký');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/disenroll`, { id: idToUse }, getAuthHeaders());
      showMessage(`✅ ${res.data.message}`);
      if (!cardId) setNfcId('');
      fetchActive();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showMessage(`❌ ${err.response?.data?.error || 'Hủy đăng ký thất bại'}`);
      } else {
        showMessage('❌ Hủy đăng ký thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActive = async () => {
    try {
      const [passRes, nfcRes] = await Promise.all([
        axios.get(`${API_URL}/active-passwords`, getAuthHeaders()),
        axios.get(`${API_URL}/active-nfc-cards`, getAuthHeaders()),
      ]);
      setCodes(passRes.data);
      setCards(nfcRes.data);
    } catch (err) {
      console.error('Error fetching active items');
    }
  };

  const fetchLogs = async (page: number, resetLogs = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: LOG_LIMIT.toString(),
        sortBy: logSortBy,
        sortOrder: logSortOrder
      });
      
      if (logFilterBy && logFilterValue) {
        params.append('filterBy', logFilterBy);
        params.append('filterValue', logFilterValue);
      }
      
      if (dateRangeStart) {
        params.append('startDate', dateRangeStart);
      }
      
      if (dateRangeEnd) {
        params.append('endDate', dateRangeEnd);
      }
      
      const res = await axios.get(`${API_URL}/logs?${params.toString()}`, getAuthHeaders());
      
      if (page === 1 || resetLogs) {
        setLogs(res.data.logs || res.data);
        setTotalLogs(res.data.total || res.data.length);
      } else {
        setLogs(prev => [...prev, ...(res.data.logs || res.data)]);
      }
    } catch (err) {
      console.error('Lỗi khi tải logs:', err);
    }
  };

  const handleLogSortChange = (newSortBy: string) => {
    if (newSortBy === logSortBy) {
      setLogSortOrder(logSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setLogSortBy(newSortBy);
      setLogSortOrder('desc');
    }
    setLogPage(1);
  };

  const handleLogFilterChange = (filterBy: string, filterValue: string) => {
    setLogFilterBy(filterBy);
    setLogFilterValue(filterValue);
    setLogPage(1);
  };

  const clearLogFilter = () => {
    setLogFilterBy('');
    setLogFilterValue('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setLogPage(1);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setDateRangeStart(start);
    setDateRangeEnd(end);
    setLogPage(1);
  };

  const loadMoreLogs = () => {
    const nextPage = logPage + 1;
    setLogPage(nextPage);
    fetchLogs(nextPage);
  };

  const copyCodeToInput = (codeValue: string) => {
    setCode(codeValue);
    showMessage(`📋 Đã sao chép mã ${codeValue} vào ô nhập`);
  };

  const copyCardIdToInput = (cardId: string) => {
    setNfcId(cardId);
    showMessage(`📋 Đã sao chép ID thẻ ${cardId} vào ô nhập NFC`);
  };

  const deleteAllCodes = async () => {
    if (codes.length === 0) return;
    
    setIsLoading(true);
    try {
      const deletePromises = codes.map(c => 
        axios.post(`${API_URL}/delete-code`, { code: c.code }, getAuthHeaders())
      );
      await Promise.all(deletePromises);
      showMessage(`✅ Đã xóa tất cả ${codes.length} mã thành công`);
      fetchActive();
    } catch (err) {
      showMessage('❌ Có lỗi khi xóa một số mã');
      fetchActive();
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllCards = async () => {
    if (cards.length === 0) return;
    
    setIsLoading(true);
    try {
      const deletePromises = cards.map(c => 
        axios.post(`${API_URL}/disenroll`, { id: c.id }, getAuthHeaders())
      );
      await Promise.all(deletePromises);
      showMessage(`✅ Đã hủy đăng ký tất cả ${cards.length} thẻ thành công`);
      fetchActive();
    } catch (err) {
      showMessage('❌ Có lỗi khi hủy đăng ký một số thẻ');
      fetchActive();
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch logs when sorting/filtering changes
  useEffect(() => {
    fetchLogs(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logSortBy, logSortOrder, logFilterBy, logFilterValue, dateRangeStart, dateRangeEnd]);

  useEffect(() => {
    const socket = io('http://165.232.169.151:3000');
    fetchActive();
    fetchLogs(logPage);
    
    socket.on('password-update', fetchActive);
    socket.on('nfc-update', fetchActive);
    socket.on('log-update', () => {
      console.log('Có thao tác mở khóa mới');
    });
    socket.on('new-log', (log) => {
      setLogs(prev => [log, ...prev.slice(0, 99)]);
    });

    socket.on('nfc-detected', (data) => {
      showMessage(`🏷️ NFC Card detected: ${data.nfcId}`);
    });

    socket.on('pin-entered', (data) => {
      showMessage(`🔢 PIN entered on ESP32: ${data.pin}`);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={user}
      onLogout={logout}
    >
      {activeTab === 'unlock' && (
        <UnlockTab
          code={code}
          setCode={setCode}
          isLoading={isLoading}
          onUnlock={handleUnlock}
        />
      )}

      {activeTab === 'manage' && (
        <ManageTab
          code={code}
          setCode={setCode}
          ttl={ttl}
          setTtl={setTtl}
          type={type}
          setType={setType}
          codes={codes}
          isLoading={isLoading}
          onCreateCode={handleCreateCode}
          onDeleteCode={handleDeleteCode}
          onCopyCode={copyCodeToInput}
          nfcId={nfcId}
          setNfcId={setNfcId}
          cards={cards}
          onEnroll={handleEnroll}
          onDisenroll={handleDisenroll}
          onCopyCardId={copyCardIdToInput}
          onDeleteAllCodes={deleteAllCodes}
          onDeleteAllCards={deleteAllCards}
        />
      )}

      {activeTab === 'logs' && (
        <LogsTab
          logs={logs}
          totalLogs={totalLogs}
          logSortBy={logSortBy}
          logSortOrder={logSortOrder}
          logFilterBy={logFilterBy}
          dateRangeStart={dateRangeStart}
          dateRangeEnd={dateRangeEnd}
          onSortChange={handleLogSortChange}
          onFilterChange={handleLogFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onClearFilter={clearLogFilter}
          onLoadMore={loadMoreLogs}
        />
      )}

      {activeTab === 'esp32' && (
        <div className="text-center py-12">
          <p className="text-gray-500">ESP32 Management - Coming Soon</p>
        </div>
      )}

      {activeTab === 'guests' && (
        <div className="text-center py-12">
          <p className="text-gray-500">Guest Management - Coming Soon</p>
        </div>
      )}

      {activeTab === 'guest-login' && (
        <div className="text-center py-12">
          <p className="text-gray-500">Guest Login - Coming Soon</p>
        </div>
      )}
    </DashboardLayout>
  );
}

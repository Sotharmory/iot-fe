import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Key, CreditCard, Copy, Trash2, Plus, Settings, Clock, Hash } from 'lucide-react';

type Code = { code: string; type: string; expires_at: string };
type Card = { id: string; enrolled_at: string };

interface ManageTabProps {
  // Code management
  code: string;
  setCode: (code: string) => void;
  ttl: number;
  setTtl: (ttl: number) => void;
  type: string;
  setType: (type: string) => void;
  codes: Code[];
  isLoading: boolean;
  onCreateCode: () => void;
  onDeleteCode: (code?: string) => void;
  onCopyCode: (code: string) => void;
  
  // NFC management
  nfcId: string;
  setNfcId: (id: string) => void;
  cards: Card[];
  onEnroll: () => void;
  onDisenroll: (id?: string) => void;
  onCopyCardId: (id: string) => void;
  onDeleteAllCodes: () => void;
  onDeleteAllCards: () => void;
}

export function ManageTab({
  code, setCode, ttl, setTtl, type, setType, codes, isLoading,
  onCreateCode, onDeleteCode, onCopyCode,
  nfcId, setNfcId, cards, onEnroll, onDisenroll, onCopyCardId,
  onDeleteAllCodes, onDeleteAllCards
}: ManageTabProps) {

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-8">
      {/* Code Management Section */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Quản Lý Mã Truy Cập
          </CardTitle>
          <CardDescription>
            Tạo và quản lý mã PIN cho hệ thống
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code-input" className="text-sm font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Mã PIN 6 Chữ Số
              </Label>
              <Input
                id="code-input"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                className="text-center font-mono text-lg h-12"
                maxLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ttl-input" className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Thời Gian (giây)
              </Label>
              <Input
                id="ttl-input"
                type="number"
                value={ttl}
                onChange={(e) => setTtl(Number(e.target.value))}
                className="h-12"
                min="60"
                max="86400"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Loại Mã
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="otp">🔄 OTP (Một lần)</SelectItem>
                  <SelectItem value="static">🔒 Static (Vĩnh viễn)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={onCreateCode}
              disabled={isLoading || !code || code.length !== 6}
              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Đang Tạo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Tạo Mã Mới
                </div>
              )}
            </Button>
            
            <Button 
              onClick={() => onDeleteCode()}
              disabled={isLoading || !code}
              variant="destructive"
              className="flex-1 h-12 font-semibold"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa Mã
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <div className="space-y-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 mb-2">
                💡 Hướng Dẫn
              </Badge>
              <p className="text-sm text-blue-800 font-medium">
                <strong>OTP:</strong> Tự động hết hạn sau thời gian đã đặt và chỉ sử dụng được một lần.
              </p>
              <p className="text-sm text-blue-800 font-medium">
                <strong>Static:</strong> Tồn tại vĩnh viễn cho đến khi bạn xóa thủ công.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFC Management Section */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quản Lý Thẻ NFC
          </CardTitle>
          <CardDescription>
            Đăng ký và quản lý thẻ NFC cho hệ thống
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nfc-input" className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              ID Thẻ NFC (Tùy Chọn)
            </Label>
            <Input
              id="nfc-input"
              type="text"
              placeholder="Để trống để kích hoạt ESP32 quét thẻ tự động"
              value={nfcId}
              onChange={(e) => setNfcId(e.target.value)}
              className="h-12"
            />
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">💡</Badge>
              Bỏ trống ID để ESP32 tự động đọc thẻ khi bạn nhấn "Đăng Ký Thẻ"
            </p>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={onEnroll}
              disabled={isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Đăng Ký Thẻ NFC
            </Button>
            
            <Button 
              onClick={() => onDisenroll()}
              disabled={isLoading || !nfcId}
              variant="destructive"
              className="flex-1 h-12 font-semibold"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hủy Đăng Ký
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Items Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Codes */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-green-600" />
                <div>
                  <CardTitle className="text-lg">Mã Đang Hoạt Động</CardTitle>
                  <CardDescription>Tổng cộng: {codes.length} mã</CardDescription>
                </div>
              </div>
              {codes.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa Tất Cả
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa tất cả mã</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc muốn xóa tất cả {codes.length} mã đang hoạt động? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={onDeleteAllCodes} className="bg-red-600 hover:bg-red-700">
                        Xóa Tất Cả
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {codes.length > 0 ? (
              <div className="space-y-3">
                {codes.map((c) => (
                  <div key={c.code} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-lg font-bold text-blue-600">{c.code}</code>
                          <Badge variant={c.type === 'otp' ? 'default' : 'secondary'}>
                            {c.type === 'otp' ? '🔄 OTP' : '🔒 Static'}
                          </Badge>
                          {isExpired(c.expires_at) && (
                            <Badge variant="destructive">Hết hạn</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Hết hạn: {formatDate(c.expires_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCopyCode(c.code)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa mã</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc muốn xóa mã <strong>{c.code}</strong>?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDeleteCode(c.code)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Key className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">Chưa có mã nào</p>
                <p className="text-gray-400 text-sm">Tạo mã mới ở phía trên</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active NFC Cards */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-purple-600" />
                <div>
                  <CardTitle className="text-lg">Thẻ NFC Đã Đăng Ký</CardTitle>
                  <CardDescription>Tổng cộng: {cards.length} thẻ</CardDescription>
                </div>
              </div>
              {cards.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hủy Tất Cả
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận hủy tất cả thẻ</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc muốn hủy đăng ký tất cả {cards.length} thẻ NFC? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={onDeleteAllCards} className="bg-red-600 hover:bg-red-700">
                        Hủy Tất Cả
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {cards.length > 0 ? (
              <div className="space-y-3">
                {cards.map((c) => (
                  <div key={c.id} className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <code className="text-lg font-bold text-purple-600 mb-2 block">{c.id}</code>
                        <p className="text-sm text-gray-600">
                          Đăng ký: {formatDate(c.enrolled_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCopyCardId(c.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận hủy thẻ</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc muốn hủy đăng ký thẻ <strong>{c.id}</strong>?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDisenroll(c.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hủy Đăng Ký
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">Chưa có thẻ nào</p>
                <p className="text-gray-400 text-sm">Đăng ký thẻ mới ở phía trên</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

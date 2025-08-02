import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Unlock, KeyRound, CreditCard } from 'lucide-react';

interface UnlockTabProps {
  code: string;
  setCode: (code: string) => void;
  isLoading: boolean;
  onUnlock: () => void;
}

export function UnlockTab({ code, setCode, isLoading, onUnlock }: UnlockTabProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <Unlock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mở Khóa Cửa Thông Minh
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Nhập mã PIN hoặc quét thẻ NFC để mở khóa
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="unlock-code" className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Nhập mã 6 chữ số hoặc ID thẻ NFC
            </Label>
            <div className="relative">
              <Input
                id="unlock-code"
                type="text"
                placeholder="Ví dụ: 123456"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                className="text-center text-xl font-mono h-14 border-2 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                maxLength={6}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <KeyRound className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  💡 Mẹo
                </Badge>
              </div>
              <p className="text-sm text-blue-700 font-medium">
                Sử dụng mã OTP hoặc mã tĩnh đã tạo, hoặc quét thẻ NFC trên ESP32
              </p>
            </div>
          </div>

          <Button 
            onClick={onUnlock}
            disabled={isLoading || !code}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Đang Xử Lý...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Unlock className="w-6 h-6" />
                Mở Khóa Cửa
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

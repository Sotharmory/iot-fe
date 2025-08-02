import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, ArrowUpDown, Filter, Calendar, CheckCircle, XCircle, User, Settings } from 'lucide-react';

type Log = { 
  method: string; 
  code: string; 
  time: string; 
  success: boolean; 
  user_name?: string; 
  user_id?: number 
};

interface LogsTabProps {
  logs: Log[];
  totalLogs: number;
  logSortBy: string;
  logSortOrder: string;
  logFilterBy: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  onSortChange: (sortBy: string) => void;
  onFilterChange: (filterBy: string, filterValue: string) => void;
  onDateRangeChange: (start: string, end: string) => void;
  onClearFilter: () => void;
  onLoadMore: () => void;
}

export function LogsTab({
  logs,
  totalLogs,
  logSortBy,
  logSortOrder,
  logFilterBy,
  dateRangeStart,
  dateRangeEnd,
  onSortChange,
  onFilterChange,
  onDateRangeChange,
  onClearFilter,
  onLoadMore
}: LogsTabProps) {
  const [filterValue, setFilterValue] = useState('');

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'nfc':
        return '💳';
      case 'pin':
        return '🔐';
      case 'code':
        return '🔢';
      default:
        return '🔑';
    }
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800 border-green-300">
        <CheckCircle className="w-3 h-3 mr-1" />
        Thành công
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Thất bại
      </Badge>
    );
  };

  const handleFilterSubmit = () => {
    if (logFilterBy && filterValue) {
      onFilterChange(logFilterBy, filterValue);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Nhật Ký Truy Cập Hệ Thống
          </CardTitle>
          <CardDescription className="text-lg">
            Theo dõi tất cả hoạt động mở khóa và truy cập
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Control Panel */}
          <div className="space-y-4">
            {/* Sort and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border shadow-sm">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Sắp Xếp Theo
                </Label>
                <Select value={logSortBy} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">⏰ Thời Gian</SelectItem>
                    <SelectItem value="date">📅 Ngày</SelectItem>
                    <SelectItem value="user_name">👤 Tên Người Dùng</SelectItem>
                    <SelectItem value="method">🔧 Phương Thức</SelectItem>
                    <SelectItem value="success">🎯 Trạng Thái</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Thứ Tự</Label>
                <Button
                  variant="outline"
                  onClick={() => onSortChange(logSortBy)}
                  className="w-full justify-center"
                >
                  {logSortOrder === 'asc' ? '↑ Tăng Dần' : '↓ Giảm Dần'}
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Lọc Theo
                </Label>
                <Select value={logFilterBy || undefined} onValueChange={(value) => onFilterChange(value || '', '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Không Lọc --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="method">🔧 Phương Thức</SelectItem>
                    <SelectItem value="success">🎯 Trạng Thái</SelectItem>
                    <SelectItem value="user_name">👤 Tên Người Dùng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Hành Động</Label>
                <Button
                  onClick={onClearFilter}
                  variant="outline"
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Xóa Bộ Lọc
                </Button>
              </div>
            </div>

            {/* Filter Value Input */}
            {logFilterBy && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-semibold text-green-800">
                      Giá Trị Lọc cho {logFilterBy === 'method' ? 'Phương Thức' : 
                                       logFilterBy === 'success' ? 'Trạng Thái' : 'Tên Người Dùng'}
                    </Label>
                    <Input
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      placeholder={
                        logFilterBy === 'method' ? 'nfc, pin, code' :
                        logFilterBy === 'success' ? 'true, false' :
                        'Tên người dùng...'
                      }
                      className="bg-white"
                    />
                  </div>
                  <Button onClick={handleFilterSubmit} className="bg-green-600 hover:bg-green-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Áp Dụng
                  </Button>
                </div>
              </div>
            )}

            {/* Date Range Filter */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-orange-200">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Lọc Theo Khoảng Thời Gian
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Từ ngày</Label>
                    <Input
                      type="datetime-local"
                      value={dateRangeStart}
                      onChange={(e) => onDateRangeChange(e.target.value, dateRangeEnd)}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Đến ngày</Label>
                    <Input
                      type="datetime-local"
                      value={dateRangeEnd}
                      onChange={(e) => onDateRangeChange(dateRangeStart, e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Info */}
            {totalLogs > 0 && (
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  📊 Hiển thị {logs.length} / {totalLogs} nhật ký
                </Badge>
              </div>
            )}
          </div>

          {/* Logs Table */}
          {logs.length > 0 ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Thời Gian</TableHead>
                      <TableHead className="font-semibold">Phương Thức</TableHead>
                      <TableHead className="font-semibold">Mã/ID</TableHead>
                      <TableHead className="font-semibold">Người Dùng</TableHead>
                      <TableHead className="font-semibold">Trạng Thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-mono text-sm">
                          {formatDateTime(log.time)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getMethodIcon(log.method)}</span>
                            <Badge variant="outline" className="capitalize">
                              {log.method}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {log.code}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {log.user_name || `User #${log.user_id || 'Unknown'}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(log.success)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Load More Button */}
              {logs.length < totalLogs && (
                <div className="text-center">
                  <Button onClick={onLoadMore} variant="outline" className="px-8">
                    Tải Thêm Nhật Ký
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Chưa có nhật ký nào</h3>
              <p className="text-gray-400">Các hoạt động mở khóa sẽ được ghi lại ở đây</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

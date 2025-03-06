import React, { useState, useMemo } from 'react';
import { FileText, AlertCircle, CheckCircle, Clock, File, Info, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface LogEntry {
  id: string;
  documentName: string;
  documentType: 'invoice' | 'document';
  timestamp: Date;
  status: 'pending' | 'validated' | 'rejected' | 'uploaded' | 'failed';
  category?: string;
  validationReason?: string;
}

interface RecentLogsProps {
  logs: LogEntry[];
}

type SortField = 'documentName' | 'documentType' | 'timestamp' | 'status' | null;
type SortOrder = 'asc' | 'desc' | null;

const RecentLogs: React.FC<RecentLogsProps> = ({
  logs
}) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedLogs = useMemo(() => {
    let result = [...logs];
    
    if (statusFilter !== 'all') {
      result = result.filter(log => log.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      result = result.filter(log => log.documentType === typeFilter);
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    if (dateFilter === 'today') {
      result = result.filter(log => {
        const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
        return timestamp >= today;
      });
    } else if (dateFilter === 'yesterday') {
      result = result.filter(log => {
        const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
        return timestamp >= yesterday && timestamp < today;
      });
    } else if (dateFilter === 'lastWeek') {
      result = result.filter(log => {
        const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
        return timestamp >= lastWeek;
      });
    } else if (dateFilter === 'lastMonth') {
      result = result.filter(log => {
        const timestamp = log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp);
        return timestamp >= lastMonth;
      });
    }
    
    if (sortField && sortOrder) {
      result.sort((a, b) => {
        if (sortField === 'timestamp') {
          const aTimestamp = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
          const bTimestamp = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
          return sortOrder === 'asc' ? aTimestamp.getTime() - bTimestamp.getTime() : bTimestamp.getTime() - aTimestamp.getTime();
        }
        
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
    }
    
    return result;
  }, [logs, sortField, sortOrder, statusFilter, typeFilter, dateFilter]);

  const renderStatus = (status: LogEntry['status'], reason?: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>;
      case 'validated':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>;
      case 'uploaded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Uploaded
          </Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ArrowUp className="ml-1 h-3 w-3 inline" /> : <ArrowDown className="ml-1 h-3 w-3 inline" />;
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>View the status of your recent document uploads</CardDescription>
        </div>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("flex gap-1 items-center", (statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && "bg-primary/10 border-primary/50 text-primary")}>
              <Filter className="h-4 w-4" />
              Filters
              {(statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {[statusFilter !== 'all' ? 1 : 0, typeFilter !== 'all' ? 1 : 0, dateFilter !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
                </Badge>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Uploads</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="validated">Validated</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="uploaded">Uploaded</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="lastWeek">Last 7 Days</SelectItem>
                    <SelectItem value="lastMonth">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={resetFilters}>Clear filters</Button>
                <Button size="sm" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('documentName')}>
                Document {renderSortIcon('documentName')}
              </TableHead>
              <TableHead className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('documentType')}>
                Type {renderSortIcon('documentType')}
              </TableHead>
              <TableHead className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('timestamp')}>
                Uploaded {renderSortIcon('timestamp')}
              </TableHead>
              <TableHead className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedLogs.length === 0 ? <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Info className="h-8 w-8 mb-2" />
                    <p>No uploads found</p>
                    <p className="text-sm">
                      {statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all' ? 'Try adjusting your filters' : 'Use the Upload button to get started'}
                    </p>
                  </div>
                </TableCell>
              </TableRow> : filteredAndSortedLogs.map(log => <TableRow key={log.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {log.documentType === 'invoice' ? <FileText className="h-4 w-4 text-muted-foreground" /> : <File className="h-4 w-4 text-muted-foreground" />}
                      <span className="truncate max-w-[240px]">{log.documentName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(log.documentType === 'invoice' ? "bg-purple-50 text-purple-700 hover:bg-purple-50" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-50")}>
                      {log.documentType === 'invoice' ? 'Invoice' : log.category || 'Document'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{renderStatus(log.status, log.validationReason)}</TableCell>
                  <TableCell>
                    {log.status === 'rejected' && log.validationReason && <span className="text-sm text-muted-foreground">{log.validationReason}</span>}
                    {log.status === 'validated' && <span className="text-sm text-muted-foreground">Sent to Continia</span>}
                  </TableCell>
                </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentLogs;

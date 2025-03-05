
import React from 'react';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  File, 
  Info
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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

const RecentLogs: React.FC<RecentLogsProps> = ({ logs }) => {
  // Function to render status badge with appropriate color and icon
  const renderStatus = (status: LogEntry['status'], reason?: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'validated':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'uploaded':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Uploaded
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Function to format date to readable format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>View the status of your recent document uploads</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Info className="h-8 w-8 mb-2" />
                    <p>No recent uploads found</p>
                    <p className="text-sm">Use the Upload button to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {log.documentType === 'invoice' ? (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <File className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="truncate max-w-[240px]">{log.documentName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      log.documentType === 'invoice' 
                        ? "bg-purple-50 text-purple-700 hover:bg-purple-50"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-50"
                    )}>
                      {log.documentType === 'invoice' ? 'Invoice' : log.category || 'Document'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{renderStatus(log.status, log.validationReason)}</TableCell>
                  <TableCell>
                    {log.status === 'rejected' && log.validationReason && (
                      <span className="text-sm text-muted-foreground">{log.validationReason}</span>
                    )}
                    {log.status === 'validated' && (
                      <span className="text-sm text-muted-foreground">Sent to Continia</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentLogs;

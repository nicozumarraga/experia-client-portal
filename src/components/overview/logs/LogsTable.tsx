import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LogEntry } from '../types';
import { FileText } from 'lucide-react';

interface LogsTableProps {
  logs: LogEntry[];
  sortField: string | null;
  sortOrder: string | null;
  handleSort: (field: any) => void;
  formatDate: (date: Date) => string;
}

const LogsTable: React.FC<LogsTableProps> = ({
  logs,
  sortField,
  sortOrder,
  handleSort,
  formatDate
}) => {
  // Status badge variants
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'validated':
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated':
      case 'accepted':
      case 'uploaded':
        return <span className="mr-1 text-green-600">✓</span>;
      case 'rejected':
      case 'failed':
        return <span className="mr-1 text-red-600">⊗</span>;
      default:
        return null;
    }
  };

  // Format document type with badge
  const formatDocumentType = (type: string, category?: string) => {
    if (!category) {
      return type === 'invoice' ? 'Invoice' : 'Document';
    }

    return (
      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
        {category}
      </Badge>
    );
  };

  return (
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
              No documents found
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => (
            <TableRow key={log.id} className="border-t">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-gray-400" />
                  {log.documentName}
                </div>
              </TableCell>
              <TableCell>
                {formatDocumentType(log.documentType, log.category)}
              </TableCell>
              <TableCell>{formatDate(log.timestamp)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("capitalize font-medium", getStatusVariant(log.status))}
                >
                  {getStatusIcon(log.status)} {log.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {log.validationReason}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default LogsTable;

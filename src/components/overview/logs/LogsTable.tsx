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
  handleSort: (field: 'documentName' | 'documentType' | 'timestamp' | 'status' | 'validationReason') => void;
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


  // Format document type with badge
  const formatDocumentType = (type: string, category?: string) => {
    if (type === 'invoice') {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Invoice
        </Badge>
      );
    }

    // Color mapping for different document categories
    if (category) {
      // Each category gets its own color
      const categoryColors: Record<string, string> = {
        'Correspondence': 'bg-blue-50 text-blue-700 border-blue-200',
        'Contracts': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Tax Documents': 'bg-cyan-50 text-cyan-700 border-cyan-200',
        'Financial Statements': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Receipts': 'bg-teal-50 text-teal-700 border-teal-200',
        'Legal Documents': 'bg-slate-50 text-slate-700 border-slate-200',
        'Reports': 'bg-sky-50 text-sky-700 border-sky-200'
      };

      // Use the mapped color or default to a generic blue for unknown categories
      const colorClass = categoryColors[category] || 'bg-blue-50 text-blue-700 border-blue-200';

      return (
        <Badge variant="outline" className={colorClass}>
          {category}
        </Badge>
      );
    }

    // Fallback for document without category
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        Document
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer hover:text-gray-900"
            onClick={() => handleSort('documentName')}
          >
            Document
            {sortField === 'documentName' && (
              <span className="ml-1">
                {sortOrder === 'desc' && '↓'}
                {sortOrder === 'asc' && '↑'}
              </span>
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:text-gray-900"
            onClick={() => handleSort('documentType')}
          >
            Type
            {sortField === 'documentType' && (
              <span className="ml-1">
                {sortOrder === 'desc' && '↓'}
                {sortOrder === 'asc' && '↑'}
              </span>
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:text-gray-900"
            onClick={() => handleSort('timestamp')}
          >
            Uploaded
            {sortField === 'timestamp' && (
              <span className="ml-1">
                {sortOrder === 'desc' && '↓'}
                {sortOrder === 'asc' && '↑'}
              </span>
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:text-gray-900"
            onClick={() => handleSort('status')}
          >
            Status
            {sortField === 'status' && (
              <span className="ml-1">
                {sortOrder === 'desc' && '↓'}
                {sortOrder === 'asc' && '↑'}
              </span>
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:text-gray-900"
            onClick={() => handleSort('validationReason')}
          >
            Details
            {sortField === 'validationReason' && (
              <span className="ml-1">
                {sortOrder === 'desc' && '↓'}
                {sortOrder === 'asc' && '↑'}
              </span>
            )}
          </TableHead>
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
                {log.status}
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


import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, FileText, Clock, AlertCircle, Upload } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/providers/AuthContext';
import RecentLogs from '@/components/overview/RecentLogs';
import InvoiceUploadModal from '@/components/uploads/InvoiceUploadModal';
import DocumentUploadModal from '@/components/uploads/DocumentUploadModal';
import { useRecentLogsStore } from '@/stores/RecentLogsStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUploadModals } from '@/hooks/use-upload-modals';

const Index = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { logs, isLoading: logsLoading, fetchLogs } = useRecentLogsStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated, fetchLogs]);

  const summaryData = useMemo(() => {
    if (!logs.length) return { total: 0, pending: 0, failed: 0 };

    return {
      total: logs.length,
      pending: logs.filter(log => log.status === 'pending').length,
      failed: logs.filter(log => log.status === 'failed' || log.status === 'rejected').length
    };
  }, [logs]);

  if (authLoading || logsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const EmptyState = () => (
    <div className="text-center py-12 space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Upload className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium">No documents yet</h3>
      <p className="text-muted-foreground">Upload your first documents to get started</p>
      <div className="pt-4 flex justify-center gap-3">
        <Button
          onClick={() => useUploadModals.getState().openInvoiceUpload()}
          variant="outline"
        >
          Upload Invoice
        </Button>
        <Button
          onClick={() => useUploadModals.getState().openDocumentUpload()}
        >
          Upload Document
        </Button>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold tracking-tight">
          Welcome, {user?.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{summaryData.total}</p>
              </div>
              <FileText className="h-6 w-6 text-[#182561]" />
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{summaryData.pending}</p>
              </div>
              <Clock className="h-6 w-6 text-[#182561]" />
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{summaryData.failed}</p>
              </div>
              <AlertCircle className="h-6 w-6 text-[#182561]" />
            </CardContent>
          </Card>
        </div>

        {logs.length > 0 ? (
          <RecentLogs logs={logs} />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Modals */}
      <InvoiceUploadModal />
      <DocumentUploadModal />
    </AppLayout>
  );
};

export default Index;

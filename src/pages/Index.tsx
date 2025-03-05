
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/providers/AuthContext';
import RecentLogs from '@/components/overview/RecentLogs';
import InvoiceUploadModal from '@/components/uploads/InvoiceUploadModal';
import DocumentUploadModal from '@/components/uploads/DocumentUploadModal';
import { useRecentLogsStore } from '@/stores/RecentLogsStore';

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
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          View and manage your document uploads
        </p>
        
        <RecentLogs logs={logs} />
      </div>
      
      {/* Modals */}
      <InvoiceUploadModal />
      <DocumentUploadModal />
    </AppLayout>
  );
};

export default Index;

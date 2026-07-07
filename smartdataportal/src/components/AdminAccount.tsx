import { useState } from 'react';
import AdminAccountList from './AdminAccountList';
import AdminAccountForm from './AdminAccountForm';

interface AdminAccountProps {
  onShowToast?: (msg: string) => void;
}

export default function AdminAccount({ onShowToast }: AdminAccountProps) {
  const [view, setView] = useState<'list' | 'create'>('list');

  if (view === 'create') {
    return <AdminAccountForm onShowToast={onShowToast} onBack={() => setView('list')} />;
  }

  return <AdminAccountList onShowToast={onShowToast} onCreate={() => setView('create')} />;
}

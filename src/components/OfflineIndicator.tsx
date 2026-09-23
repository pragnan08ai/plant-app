import React from 'react';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-xs">
      <WifiOff className="w-4 h-4 animate-pulse text-amber-200" />
      <span>Offline Mode — All plant data is safely saved in local storage.</span>
    </div>
  );
};

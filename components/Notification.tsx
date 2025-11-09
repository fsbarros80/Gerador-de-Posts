import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { CheckIcon, InfoIcon, WarningIcon } from './icons/ActionIcons';

export type NotificationType = 'success' | 'info' | 'error';

interface NotificationState {
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let visibilityTimer: ReturnType<typeof setTimeout>;
    let cleanupTimer: ReturnType<typeof setTimeout>;

    if (notification) {
      setIsVisible(true);
      visibilityTimer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      cleanupTimer = setTimeout(() => {
        setNotification(null);
      }, 3500); // Permite tempo para a animação de fade-out
    }

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(cleanupTimer);
    };
  }, [notification]);

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
  }, []);

  const icons: { [key in NotificationType]: React.ReactNode } = {
    success: <CheckIcon className="h-6 w-6 text-green-300" />,
    info: <InfoIcon className="h-6 w-6 text-blue-300" />,
    error: <WarningIcon className="h-6 w-6 text-red-300" />,
  };
  
  const bgColors: { [key in NotificationType]: string } = {
    success: 'bg-green-600/80 border-green-500/50',
    info: 'bg-blue-600/80 border-blue-500/50',
    error: 'bg-red-600/80 border-red-500/50'
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {notification && (
            <div
              className={`
                pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl
                shadow-2xl ring-1 ring-black/10 backdrop-blur-lg border
                transform-gpu transition-all duration-300 ease-in-out
                ${bgColors[notification.type]}
                ${isVisible ? 'translate-y-0 opacity-100 sm:translate-x-0' : 'translate-y-4 opacity-0 sm:translate-y-0 sm:translate-x-4'}
              `}
            >
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">{icons[notification.type]}</div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{notification.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

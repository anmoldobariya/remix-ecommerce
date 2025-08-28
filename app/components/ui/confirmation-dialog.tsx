import { useState, createContext, useContext, ReactNode } from 'react';
import { Button } from './button';
import { XIcon } from 'lucide-react';

interface ConfirmationDialogContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationDialogContext = createContext<ConfirmationDialogContextType | null>(null);

export function useConfirmation() {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationDialogProvider');
  }
  return context;
}

interface ConfirmationDialogProviderProps {
  children: ReactNode;
}

export function ConfirmationDialogProvider({ children }: ConfirmationDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = (confirmOptions: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(confirmOptions);
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
    }
    cleanup();
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
    }
    cleanup();
  };

  const cleanup = () => {
    setOptions(null);
    setResolvePromise(null);
  };

  const getVariantStyles = () => {
    switch (options?.variant) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          iconBg: 'bg-red-100',
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          iconBg: 'bg-yellow-100',
        };
      default:
        return {
          icon: 'ℹ️',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          iconBg: 'bg-blue-100',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <ConfirmationDialogContext.Provider value={{ confirm }}>
      {children}

      {isOpen && options && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center mr-3`}>
                      <span className="text-lg">{styles.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {options.title || 'Confirm Action'}
                    </h3>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {options.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                  >
                    {options.cancelText || 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className={`w-full sm:w-auto ${styles.confirmButton}`}
                  >
                    {options.confirmText || 'Confirm'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmationDialogContext.Provider>
  );
}

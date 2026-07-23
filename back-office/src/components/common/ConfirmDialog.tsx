import React from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'warning' | 'error' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  severity = 'warning',
}) => {
  const getIcon = () => {
    const iconClass = "h-5 w-5";
    switch (severity) {
      case 'error':
        return <ErrorOutlineIcon className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <WarningAmberIcon className={`${iconClass} text-amber-500`} />;
      case 'info':
        return <InfoIcon className={`${iconClass} text-blue-500`} />;
      default:
        return <WarningAmberIcon className={`${iconClass} text-amber-500`} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent
        className="
          !max-w-md
          gap-0
          overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white
          p-0
          shadow-lg
          [&>button]:hidden
        "
      >
        <div className="flex min-h-0 flex-col">
          <DialogHeader className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 lg:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  {getIcon()}
                  {title}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4">
            <div className="text-base leading-relaxed text-slate-700">{message}</div>
          </div>

          <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-white px-5 py-4 lg:px-6">
            <div className="flex justify-end gap-2">
              <Button onClick={onCancel} variant="outline" className="rounded-xl">
                {cancelLabel}
              </Button>
              <Button onClick={onConfirm} className="rounded-xl">
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
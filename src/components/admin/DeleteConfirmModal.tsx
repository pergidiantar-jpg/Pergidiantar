import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmItemName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmItemName,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              {message}
            </p>
            {confirmItemName && (
              <div className="mt-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200 text-xs font-mono font-semibold text-neutral-800">
                {confirmItemName}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-3.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="py-2 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Data Secara Penuh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

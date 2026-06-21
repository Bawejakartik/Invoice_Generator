// components/ConfirmDeleteModal.jsx

import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      {/* Modal card — stopPropagation so clicking inside doesn't close it */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm mx-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl dark:shadow-black/50 p-6 transition-colors duration-300 animate-[scaleIn_0.18s_ease-out]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-red-600 dark:text-red-400" />
        </div>

        {/* Text */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
          Delete this client?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          You're about to permanently delete{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {clientName}
          </span>
          . This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm ${
              isDeleting
                ? "bg-red-300 dark:bg-red-800 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:shadow-md hover:shadow-red-200 dark:hover:shadow-red-900/40"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete Client"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmDeleteModal;

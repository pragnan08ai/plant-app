import React from 'react';
import { Plus, Sparkles, Sprout } from 'lucide-react';

interface EmptyStateProps {
  onOpenAddModal: () => void;
  onLoadSamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenAddModal,
  onLoadSamples,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-emerald-900/10 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
      
      {/* Botanical Illustration */}
      <div className="mx-auto w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl shadow-inner mb-6">
        <span role="img" aria-label="Plants" className="animate-bounce duration-1000">
          🪴
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        No plants in your garden yet
      </h2>
      
      <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
        Keep your houseplants thriving without the stress. Add your plants once and let Plant Tracker remind you when it's time to water!
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-emerald-700 hover:bg-emerald-800 transition active:scale-95 shadow-sm shadow-emerald-900/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Your First Plant</span>
        </button>

        <button
          onClick={onLoadSamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Load Starter Plants</span>
        </button>
      </div>

      <p className="mt-6 text-[11px] text-slate-400">
        Saved automatically to your browser's local storage. No account required.
      </p>
    </div>
  );
};

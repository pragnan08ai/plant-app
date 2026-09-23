import React from 'react';
import { Plus, Droplets, Sparkles, CheckCheck } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  totalCount: number;
  dueCount: number;
  healthyCount: number;
  onOpenAddModal: () => void;
  onWaterAllDue?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  dueCount,
  healthyCount,
  onOpenAddModal,
  onWaterAllDue,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/15 flex-shrink-0">
              <span className="text-xl sm:text-2xl" role="img" aria-label="Sprout">
                🌿
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-950">
                  Plant Tracker
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Care Schedule
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Simple zero-friction watering for busy plant parents
              </p>
            </div>
          </div>

          {/* Actions & Summary */}
          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap sm:flex-nowrap">
            <PWAInstallButton />

            {/* Quick bulk water all button if plants are due */}
            {dueCount > 0 && onWaterAllDue && (
              <button
                onClick={onWaterAllDue}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 transition active:scale-95 shadow-xs"
                title="Mark all due and overdue plants as watered today"
              >
                <Droplets className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Water Due ({dueCount})</span>
              </button>
            )}

            {/* Add Plant Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition shadow-sm shadow-emerald-900/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Plant</span>
            </button>
          </div>

        </div>

        {/* Quick summary status chips */}
        {totalCount > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs overflow-x-auto no-scrollbar">
            <span className="text-slate-500 font-medium whitespace-nowrap">Status:</span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <span>{totalCount}</span> plants total
            </span>

            {dueCount > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-semibold border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>{dueCount}</span> need water
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-medium border border-emerald-200">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                All watered & happy!
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
              <span>{healthyCount}</span> on schedule
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

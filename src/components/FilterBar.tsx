import React from 'react';
import { FilterOption, SortOption } from '../types/plant';
import { Search, Filter, ArrowUpDown, X, Droplets, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFilter: FilterOption;
  onFilterChange: (f: FilterOption) => void;
  selectedRoom: string;
  onRoomChange: (r: string) => void;
  availableRooms: string[];
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  dueCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedRoom,
  onRoomChange,
  availableRooms,
  sortBy,
  onSortChange,
  dueCount,
  totalCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Top row: Search input + Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search plants or room (e.g. Monstera, Bedroom)..."
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer"
          >
            <option value="urgency">Urgency (Needs water first)</option>
            <option value="name">Plant Name (A - Z)</option>
            <option value="room">Room / Location</option>
            <option value="frequency">Watering Frequency</option>
          </select>
        </div>
      </div>

      {/* Second row: Filter Tabs & Room Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        
        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => onFilterChange('needs_water')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedFilter === 'needs_water'
                ? 'bg-rose-600 text-white shadow-xs'
                : dueCount > 0
                ? 'text-rose-700 hover:bg-rose-50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span>Needs Water ({dueCount})</span>
          </button>

          <button
            onClick={() => onFilterChange('healthy')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedFilter === 'healthy'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>On Schedule</span>
          </button>
        </div>

        {/* Room Filter Pills */}
        {availableRooms.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Room:</span>
            <button
              onClick={() => onRoomChange('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedRoom === 'all'
                  ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Rooms
            </button>
            {availableRooms.map((room) => (
              <button
                key={room}
                onClick={() => onRoomChange(room)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                  selectedRoom === room
                    ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

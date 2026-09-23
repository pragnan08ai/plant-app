import React, { useState } from 'react';
import { Plant } from '../types/plant';
import { calculatePlantStatus, formatDisplayDate } from '../utils/dateUtils';
import { MapPin, Droplets, Check, Calendar, Edit3, Trash2, Clock, AlertTriangle } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onWater: (plantId: string) => void;
  onEdit: (plant: Plant) => void;
  onDelete: (plantId: string) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onWater,
  onEdit,
  onDelete,
}) => {
  const [isWateringAnimation, setIsWateringAnimation] = useState(false);
  const status = calculatePlantStatus(plant);

  const handleWaterClick = () => {
    setIsWateringAnimation(true);
    onWater(plant.id);
    setTimeout(() => {
      setIsWateringAnimation(false);
    }, 900);
  };

  const isWateredToday = status.state === 'watered_today';

  // Badge visual treatment based on spec
  // Subtle red/orange for overdue/due/never watered, green for watered/upcoming
  let badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let badgeIcon = <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />;

  if (status.state === 'overdue') {
    badgeStyles = 'bg-rose-50 text-rose-800 border-rose-200';
    badgeIcon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
  } else if (status.state === 'due_today') {
    badgeStyles = 'bg-amber-50 text-amber-900 border-amber-300';
    badgeIcon = <Clock className="w-3.5 h-3.5 text-amber-600" />;
  } else if (status.state === 'never_watered') {
    badgeStyles = 'bg-rose-50 text-rose-800 border-rose-200';
    badgeIcon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
  } else if (status.state === 'watered_today') {
    badgeStyles = 'bg-emerald-100/80 text-emerald-900 border-emerald-300 font-medium';
    badgeIcon = <Droplets className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600" />;
  }

  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md p-4 sm:p-5 ${
        status.isWaterDue
          ? 'border-amber-200/90 hover:border-amber-300 ring-1 ring-amber-100/50'
          : 'border-slate-200/80 hover:border-emerald-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        {/* Left Column: Plant Info & Status */}
        <div className="space-y-2.5 flex-1 min-w-0">
          
          {/* Header Row: Name & Quick Actions */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              {plant.name}
            </h2>

            {/* Quick edit & delete buttons */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(plant)}
                aria-label={`Edit ${plant.name}`}
                className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                title="Edit plant details"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(plant.id)}
                aria-label={`Delete ${plant.name}`}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Remove plant"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Location & Frequency Row */}
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-slate-600 gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{plant.location}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Water every {plant.waterEveryDays} {plant.waterEveryDays === 1 ? 'day' : 'days'}</span>
            </span>
          </div>

          {/* Status Badge */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyles}`}
            >
              {badgeIcon}
              <span>
                {status.state === 'watered_today' && 'Status: Watered today!'}
                {status.state === 'never_watered' && 'Status: Needs Water (Never watered)'}
                {status.state === 'due_today' && `Status: Due today (Last: ${formatDisplayDate(plant.lastWateredDate)})`}
                {status.state === 'overdue' && `Status: Overdue (Last: ${formatDisplayDate(plant.lastWateredDate)})`}
                {status.state === 'upcoming' && `Status: Good (Last: ${formatDisplayDate(plant.lastWateredDate)})`}
              </span>
            </div>

            {/* Next due date indicator when not overdue */}
            {status.state === 'upcoming' && (
              <span className="text-xs text-slate-500">
                Next: {status.nextDueDateString}
              </span>
            )}
          </div>

          {/* Schedule Progress Bar */}
          <div className="pt-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  status.isWaterDue
                    ? 'bg-rose-500'
                    : isWateredToday
                    ? 'bg-emerald-500'
                    : 'bg-emerald-400'
                }`}
                style={{
                  width: `${status.progressPercent}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
              <span>Last: {formatDisplayDate(plant.lastWateredDate)}</span>
              <span>
                {status.isWaterDue
                  ? 'Watering due'
                  : `${status.daysRemaining} days left`}
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Prominent Water Action Button */}
        <div className="sm:self-center flex sm:flex-col items-center justify-end sm:justify-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            onClick={handleWaterClick}
            disabled={isWateringAnimation}
            className={`w-full sm:w-auto min-w-[124px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95 shadow-xs ${
              isWateredToday
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                : status.isWaterDue
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/20'
                : 'bg-emerald-600/90 hover:bg-emerald-700 text-white'
            } ${isWateringAnimation ? 'ring-4 ring-emerald-300 animate-pulse' : ''}`}
            title="Mark as watered today"
          >
            {isWateringAnimation ? (
              <>
                <Droplets className="w-4 h-4 text-emerald-400 animate-bounce fill-current" />
                <span className="font-semibold">Watered! 💧</span>
              </>
            ) : isWateredToday ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Watered</span>
              </>
            ) : (
              <>
                <Droplets className="w-4 h-4 fill-white/80" />
                <span className="font-semibold">Water</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
};

import React, { useState, useEffect } from 'react';
import { Plant } from '../types/plant';
import { getTodayDateString, formatDateToString } from '../utils/dateUtils';
import { ROOM_PRESETS } from '../utils/storage';
import { X, Edit3, AlertCircle } from 'lucide-react';

interface EditPlantModalProps {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Plant) => void;
}

export const EditPlantModal: React.FC<EditPlantModalProps> = ({
  plant,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [waterEveryDays, setWaterEveryDays] = useState('7');
  const [lastWateredDate, setLastWateredDate] = useState<string>('');
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
    waterEveryDays?: string;
  }>({});

  useEffect(() => {
    if (plant && isOpen) {
      setName(plant.name);
      setLocation(plant.location);
      setWaterEveryDays(String(plant.waterEveryDays));
      setLastWateredDate(plant.lastWateredDate || '');
      setErrors({});
    }
  }, [plant, isOpen]);

  if (!isOpen || !plant) return null;

  const validate = (): boolean => {
    const newErrors: { name?: string; location?: string; waterEveryDays?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Plant name is required.';
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required.';
    }

    const freqNum = Number(waterEveryDays);
    if (!waterEveryDays.trim() || isNaN(freqNum) || !Number.isInteger(freqNum) || freqNum < 1) {
      newErrors.waterEveryDays = 'Schedule must be an integer of at least 1 day.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...plant,
      name: name.trim(),
      location: location.trim(),
      waterEveryDays: parseInt(waterEveryDays, 10),
      lastWateredDate: lastWateredDate.trim() ? lastWateredDate.trim() : null,
    });

    onClose();
  };

  const handleSetYesterday = () => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    setLastWateredDate(formatDateToString(y));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-emerald-900/10 my-8 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Edit Plant Details</h2>
              <p className="text-xs text-slate-500">Update schedule, location, or name</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          
          {/* Name */}
          <div>
            <label htmlFor="edit-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Plant Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="edit-location" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-location"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                errors.location
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {ROOM_PRESETS.slice(0, 5).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setLocation(r);
                    if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
                  }}
                  className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                >
                  {r}
                </button>
              ))}
            </div>
            {errors.location && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.location}</span>
              </p>
            )}
          </div>

          {/* Watering Frequency */}
          <div>
            <label htmlFor="edit-frequency" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Watering Frequency (Every N Days) <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="edit-frequency"
                type="number"
                min="1"
                step="1"
                value={waterEveryDays}
                onChange={(e) => {
                  setWaterEveryDays(e.target.value);
                  if (errors.waterEveryDays) setErrors((prev) => ({ ...prev, waterEveryDays: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                  errors.waterEveryDays
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              />
              <span className="absolute right-3.5 text-xs text-slate-400 font-medium pointer-events-none">
                days
              </span>
            </div>
            {errors.waterEveryDays && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.waterEveryDays}</span>
              </p>
            )}
          </div>

          {/* Last Watered Date */}
          <div>
            <label htmlFor="edit-last-watered" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Last Watered Date
            </label>
            <div className="flex gap-2">
              <input
                id="edit-last-watered"
                type="date"
                value={lastWateredDate}
                onChange={(e) => setLastWateredDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
              <button
                type="button"
                onClick={() => setLastWateredDate(getTodayDateString())}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition whitespace-nowrap"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleSetYesterday}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition whitespace-nowrap"
              >
                Yesterday
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank if this plant has never been watered.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition shadow-sm shadow-emerald-900/20"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

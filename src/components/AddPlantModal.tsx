import React, { useState, useEffect, useRef } from 'react';
import { Plant } from '../types/plant';
import { getTodayDateString } from '../utils/dateUtils';
import { PLANT_PRESETS, ROOM_PRESETS } from '../utils/storage';
import { X, Sprout, MapPin, Calendar, Check, AlertCircle, Sparkles } from 'lucide-react';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: Omit<Plant, 'id'>) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onAddPlant,
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [waterEveryDays, setWaterEveryDays] = useState<string>('7');
  const [wateredTodayInitial, setWateredTodayInitial] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
    waterEveryDays?: string;
  }>({});

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setLocation('');
      setWaterEveryDays('7');
      setWateredTodayInitial(true);
      setErrors({});
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { name?: string; location?: string; waterEveryDays?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Plant name is required.';
    }

    if (!location.trim()) {
      newErrors.location = 'Room or spot location is required.';
    }

    const freqNum = Number(waterEveryDays);
    if (!waterEveryDays.trim() || isNaN(freqNum) || !Number.isInteger(freqNum) || freqNum < 1) {
      newErrors.waterEveryDays = 'Watering frequency must be an integer of 1 day or more.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const freq = parseInt(waterEveryDays, 10);
    const lastWateredDate = wateredTodayInitial ? getTodayDateString() : null;

    onAddPlant({
      name: name.trim(),
      location: location.trim(),
      waterEveryDays: freq,
      lastWateredDate,
    });

    onClose();
  };

  const handleSelectPreset = (preset: typeof PLANT_PRESETS[0]) => {
    setName(preset.name);
    setLocation(preset.location);
    setWaterEveryDays(String(preset.waterEveryDays));
    setErrors({});
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
              <Sprout className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New Plant</h2>
              <p className="text-xs text-slate-500">Track watering schedule and stay on top of care</p>
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

        {/* Quick Presets for Busy Parents */}
        <div className="mt-4 p-3 bg-emerald-50/70 rounded-xl border border-emerald-100/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick Presets:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PLANT_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-emerald-100/70 text-slate-700 hover:text-emerald-900 border border-emerald-200/60 transition shadow-2xs"
              >
                {preset.emoji} {preset.name} ({preset.waterEveryDays}d)
              </button>
            ))}
          </div>
        </div>

        {/* Add Plant Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          
          {/* Plant Name Input */}
          <div>
            <label htmlFor="plant-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Plant Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="plant-name"
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. Monstera, Snake Plant, Basil"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
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

          {/* Location Input */}
          <div>
            <label htmlFor="plant-location" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Room / Location <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="plant-location"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
                }}
                placeholder="e.g. Living Room, Bedroom windowsill"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                  errors.location
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              />
            </div>
            {/* Quick room suggestion chips */}
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

          {/* Watering Frequency Input */}
          <div>
            <label htmlFor="plant-frequency" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Watering Schedule (Every N Days) <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="plant-frequency"
                type="number"
                min="1"
                step="1"
                value={waterEveryDays}
                onChange={(e) => {
                  setWaterEveryDays(e.target.value);
                  if (errors.waterEveryDays) setErrors((prev) => ({ ...prev, waterEveryDays: undefined }));
                }}
                placeholder="7"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                  errors.waterEveryDays
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
                }`}
              />
              <span className="absolute right-3.5 text-xs text-slate-400 font-medium pointer-events-none">
                days
              </span>
            </div>
            {/* Quick frequency chips */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[3, 5, 7, 10, 14, 21].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setWaterEveryDays(String(days));
                    if (errors.waterEveryDays) setErrors((prev) => ({ ...prev, waterEveryDays: undefined }));
                  }}
                  className={`px-2 py-0.5 text-xs rounded-md border transition ${
                    waterEveryDays === String(days)
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Every {days}d
                </button>
              ))}
            </div>
            {errors.waterEveryDays && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.waterEveryDays}</span>
              </p>
            )}
          </div>

          {/* Initial Watering Status */}
          <div className="pt-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Initial Status
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWateredTodayInitial(true)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                  wateredTodayInitial
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    wateredTodayInitial
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {wateredTodayInitial && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Watered today</p>
                  <p className="text-[10px] text-slate-500">Reset cycle from today</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setWateredTodayInitial(false)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                  !wateredTodayInitial
                    ? 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    !wateredTodayInitial
                      ? 'border-amber-600 bg-amber-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {!wateredTodayInitial && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Needs water now</p>
                  <p className="text-[10px] text-slate-500">Mark overdue immediately</p>
                </div>
              </button>
            </div>
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
              Add Plant
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

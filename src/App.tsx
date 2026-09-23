/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plant, FilterOption, SortOption } from './types/plant';
import { getPlants, savePlants, INITIAL_SAMPLE_PLANTS } from './utils/storage';
import { getTodayDateString, calculatePlantStatus } from './utils/dateUtils';
import { Header } from './components/Header';
import { PlantCard } from './components/PlantCard';
import { AddPlantModal } from './components/AddPlantModal';
import { EditPlantModal } from './components/EditPlantModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Check, Droplets, RefreshCw, Sprout, AlertCircle, Heart } from 'lucide-react';

export default function App() {
  const [plants, setPlants] = useState<Plant[]>(() => getPlants());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [deletingPlant, setDeletingPlant] = useState<Plant | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('urgency');

  // Flash notification toast
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const showToast = (message: string) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  };

  // Keep localStorage synchronized whenever plants state changes
  useEffect(() => {
    savePlants(plants);
  }, [plants]);

  // Derived plant metrics
  const { dueCount, healthyCount, availableRooms } = useMemo(() => {
    let due = 0;
    let healthy = 0;
    const roomSet = new Set<string>();

    plants.forEach((p) => {
      if (p.location && p.location.trim()) {
        roomSet.add(p.location.trim());
      }
      const st = calculatePlantStatus(p);
      if (st.isWaterDue) {
        due += 1;
      } else {
        healthy += 1;
      }
    });

    return {
      dueCount: due,
      healthyCount: healthy,
      availableRooms: Array.from(roomSet).sort(),
    };
  }, [plants]);

  // Filtered and Sorted Plant List
  const displayedPlants = useMemo(() => {
    let result = [...plants];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (selectedFilter === 'needs_water') {
      result = result.filter((p) => calculatePlantStatus(p).isWaterDue);
    } else if (selectedFilter === 'healthy') {
      result = result.filter((p) => !calculatePlantStatus(p).isWaterDue);
    }

    // 3. Room Filter
    if (selectedRoom !== 'all') {
      result = result.filter((p) => p.location.trim() === selectedRoom);
    }

    // 4. Sorting
    result.sort((a, b) => {
      const statusA = calculatePlantStatus(a);
      const statusB = calculatePlantStatus(b);

      if (sortBy === 'urgency') {
        // High priority: due first
        if (statusA.isWaterDue && !statusB.isWaterDue) return -1;
        if (!statusA.isWaterDue && statusB.isWaterDue) return 1;

        if (statusA.isWaterDue && statusB.isWaterDue) {
          // If both due, higher overdue days first
          return statusB.daysOverdue - statusA.daysOverdue;
        }

        // If neither is due, upcoming sooner first
        return statusA.daysRemaining - statusB.daysRemaining;
      }

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === 'room') {
        return a.location.localeCompare(b.location);
      }

      if (sortBy === 'frequency') {
        return a.waterEveryDays - b.waterEveryDays;
      }

      return 0;
    });

    return result;
  }, [plants, searchQuery, selectedFilter, selectedRoom, sortBy]);

  // Water single plant action
  const handleWaterPlant = (plantId: string) => {
    const today = getTodayDateString();
    setPlants((prev) =>
      prev.map((plant) => {
        if (plant.id === plantId) {
          return {
            ...plant,
            lastWateredDate: today,
          };
        }
        return plant;
      })
    );

    const target = plants.find((p) => p.id === plantId);
    showToast(`💧 ${target?.name || 'Plant'} marked as watered today!`);
  };

  // Bulk water all due plants
  const handleWaterAllDue = () => {
    const today = getTodayDateString();
    let count = 0;

    setPlants((prev) =>
      prev.map((p) => {
        if (calculatePlantStatus(p).isWaterDue) {
          count++;
          return { ...p, lastWateredDate: today };
        }
        return p;
      })
    );

    showToast(`🎉 Watered all ${count} due plants!`);
  };

  // Add new plant
  const handleAddPlant = (newPlantData: Omit<Plant, 'id'>) => {
    const newPlant: Plant = {
      ...newPlantData,
      id: `plant_${Date.now()}`,
    };

    setPlants((prev) => [newPlant, ...prev]);
    showToast(`🌿 Added ${newPlant.name} to tracker!`);
  };

  // Save edited plant
  const handleSaveEditPlant = (updatedPlant: Plant) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
    );
    showToast(`✓ Updated ${updatedPlant.name}`);
  };

  // Delete plant
  const handleConfirmDelete = () => {
    if (!deletingPlant) return;
    const plantName = deletingPlant.name;
    setPlants((prev) => prev.filter((p) => p.id !== deletingPlant.id));
    setDeletingPlant(null);
    showToast(`Removed ${plantName}`);
  };

  // Load starter pack
  const handleLoadSamples = () => {
    setPlants(INITIAL_SAMPLE_PLANTS);
    showToast('🌱 Loaded starter plant collection!');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] flex flex-col text-slate-800">
      
      {/* App Header */}
      <Header
        totalCount={plants.length}
        dueCount={dueCount}
        healthyCount={healthyCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onWaterAllDue={dueCount > 0 ? handleWaterAllDue : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {plants.length === 0 ? (
          // Empty State when user has no plants
          <EmptyState
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onLoadSamples={handleLoadSamples}
          />
        ) : (
          <>
            {/* Filter and Search Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
              availableRooms={availableRooms}
              sortBy={sortBy}
              onSortChange={setSortBy}
              dueCount={dueCount}
              totalCount={plants.length}
            />

            {/* Plants List */}
            {displayedPlants.length === 0 ? (
              // Filter produced no matches
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-base font-semibold text-slate-800">
                  No plants match your current filter
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try clearing your search query or switching your status filter to see all plants.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                    setSelectedRoom('all');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
                {displayedPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    onWater={handleWaterPlant}
                    onEdit={(p) => setEditingPlant(p)}
                    onDelete={() => setDeletingPlant(plant)}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* App Footer */}
      <footer className="mt-auto py-6 border-t border-emerald-950/5 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Houseplant Water Tracker • Data saved in local browser storage</span>
          </div>

          <div className="flex items-center gap-3">
            {plants.length > 0 && (
              <button
                onClick={handleLoadSamples}
                className="text-xs text-slate-500 hover:text-emerald-700 hover:underline transition"
              >
                Reset to Sample Plants
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlant={handleAddPlant}
      />

      {/* Edit Plant Modal */}
      <EditPlantModal
        plant={editingPlant}
        isOpen={!!editingPlant}
        onClose={() => setEditingPlant(null)}
        onSave={handleSaveEditPlant}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        plant={deletingPlant}
        isOpen={!!deletingPlant}
        onClose={() => setDeletingPlant(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}

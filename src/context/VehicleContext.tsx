import React, { createContext, useContext, useState, useEffect } from 'react';
import { SelectedVehicle } from '../types/index.ts';

interface VehicleContextType {
  selectedVehicle: SelectedVehicle | null;
  setSelectedVehicle: (vehicle: SelectedVehicle | null) => void;
  clearVehicle: () => void;
  isSelectorModalOpen: boolean;
  openSelectorModal: () => void;
  closeSelectorModal: () => void;
}

const VEHICLE_STORAGE_KEY = 'custom_car_mats_vehicle';

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicle, setSelectedVehicleState] = useState<SelectedVehicle | null>(() => {
    try {
      const stored = localStorage.getItem(VEHICLE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);

  const setSelectedVehicle = (vehicle: SelectedVehicle | null) => {
    setSelectedVehicleState(vehicle);
    if (vehicle) {
      localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicle));
    } else {
      localStorage.removeItem(VEHICLE_STORAGE_KEY);
    }
  };

  const clearVehicle = () => {
    setSelectedVehicle(null);
  };

  const openSelectorModal = () => setIsSelectorModalOpen(true);
  const closeSelectorModal = () => setIsSelectorModalOpen(false);

  return (
    <VehicleContext.Provider
      value={{
        selectedVehicle,
        setSelectedVehicle,
        clearVehicle,
        isSelectorModalOpen,
        openSelectorModal,
        closeSelectorModal
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
}

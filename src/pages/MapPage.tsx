import { useState } from 'react';
import MapView from '../components/MapView';

export default function MapPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{lat: number; lng: number} | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setShowAddModal(true);
  };

  return (
    <div className="h-[calc(100vh-8rem)]" dir="rtl">
      <MapView onAddClick={handleMapClick} />
      {showAddModal && selectedCoords && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">إضافة جهاز</h2>
            <p className="mb-2">خط العرض: {selectedCoords.lat.toFixed(6)}</p>
            <p className="mb-4">خط الطول: {selectedCoords.lng.toFixed(6)}</p>
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="bg-blue-600 text-white px-4 py-2 rounded">
                إضافة
              </button>
              <button onClick={() => setShowAddModal(false)} className="bg-gray-300 px-4 py-2 rounded">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

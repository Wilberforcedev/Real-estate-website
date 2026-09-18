import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Plus, 
  RefreshCw,
  BedDouble,
  Image as ImageIcon
} from 'lucide-react';
import { Room, Resident, Language, ThemeMode } from '../types';
import { getTranslation } from '../i18n';
import { WING_PHOTOS } from '../data/mockData';

interface RoomManagementProps {
  rooms: Room[];
  residents: Resident[];
  language: Language;
  theme?: ThemeMode;
  onUpdateRoomStatus: (roomId: string, newStatus: Room['status']) => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({
  rooms,
  residents,
  language,
  theme = 'light',
  onUpdateRoomStatus
}) => {
  const t = getTranslation(language);
  const [selectedWing, setSelectedWing] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredRooms = rooms.filter(r => {
    const matchesWing = selectedWing === 'ALL' || r.wing === selectedWing;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesWing && matchesStatus;
  });

  const isNight = theme === 'night';

  const getStatusBadge = (status: Room['status']) => {
    switch (status) {
      case 'occupied':
        return <span className={`${isNight ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-900 border-emerald-300'} border text-[10px] font-black px-2 py-0.5 rounded-full`}>{t.occupied}</span>;
      case 'available':
        return <span className={`${isNight ? 'bg-blue-950 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-900 border-blue-300'} border text-[10px] font-black px-2 py-0.5 rounded-full`}>{t.vacant}</span>;
      case 'reserved':
        return <span className={`${isNight ? 'bg-purple-950 text-purple-300 border-purple-700' : 'bg-purple-100 text-purple-900 border-purple-300'} border text-[10px] font-black px-2 py-0.5 rounded-full`}>{t.reserved}</span>;
      case 'cleaning':
        return <span className={`${isNight ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-900 border-amber-300'} border text-[10px] font-black px-2 py-0.5 rounded-full`}>{t.cleaning}</span>;
    }
  };

  const getTypeLabel = (type: Room['type']) => {
    switch (type) {
      case 'single': return 'Einzelzimmer Standard';
      case 'double': return 'Zweibettzimmer';
      case 'suite': return 'Attika-Residenz Suite';
      case 'dementia_care': return 'Beschützendes Demenz-Zimmer';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Building Wings Showcase Cards with High Quality Facility Photos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(WING_PHOTOS).map(([wingName, photoUrl]) => {
          const wingRooms = rooms.filter(r => r.wing === wingName);
          const occupiedCount = wingRooms.filter(r => r.status === 'occupied').length;
          const totalCount = wingRooms.length;
          const isSelected = selectedWing === wingName;

          return (
            <div
              key={wingName}
              onClick={() => setSelectedWing(isSelected ? 'ALL' : wingName)}
              className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all group ${
                isSelected 
                  ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md' 
                  : isNight 
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 hover:shadow-sm'
              }`}
            >
              <div className="h-28 overflow-hidden relative">
                <img
                  src={photoUrl}
                  alt={wingName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                  <h3 className="font-serif font-bold text-sm tracking-wide flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    {wingName}
                  </h3>
                  <span className="text-[10px] bg-slate-900/80 backdrop-blur-xs font-mono font-bold px-2 py-0.5 rounded-full border border-slate-700">
                    {occupiedCount}/{totalCount} Belegt
                  </span>
                </div>
              </div>
              <div className={`p-3 text-xs flex items-center justify-between ${isNight ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                <span className="font-medium text-[11px]">Klick zum Filtern</span>
                <span className={`font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {isSelected ? '✓ Aktiv Filter' : 'Auswählen'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Filter Bar */}
      <div className={`p-4 rounded-2xl border transition-colors ${
        isNight 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 shadow-2xs text-slate-900'
      } flex flex-col md:flex-row items-center justify-between gap-4`}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {/* Wing Selector */}
          <div className={`flex items-center gap-1 p-1 rounded-xl text-xs ${isNight ? 'bg-slate-950 border border-slate-800' : 'bg-slate-100'}`}>
            <button
              onClick={() => setSelectedWing('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedWing === 'ALL' 
                  ? (isNight ? 'bg-slate-800 text-white shadow-2xs' : 'bg-white text-slate-900 shadow-2xs') 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Alle Trakt-Gebäude
            </button>
            <button
              onClick={() => setSelectedWing('Haus Säntis')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedWing === 'Haus Säntis' 
                  ? (isNight ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-white text-[#5C6B4E] shadow-2xs') 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Haus Säntis
            </button>
            <button
              onClick={() => setSelectedWing('Haus Matterhorn')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedWing === 'Haus Matterhorn' 
                  ? (isNight ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-white text-[#5C6B4E] shadow-2xs') 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Haus Matterhorn
            </button>
            <button
              onClick={() => setSelectedWing('Residenz Eiger')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedWing === 'Residenz Eiger' 
                  ? (isNight ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-white text-[#5C6B4E] shadow-2xs') 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Residenz Eiger
            </button>
          </div>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`border text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none ${
              isNight 
                ? 'bg-slate-950 border-slate-800 text-slate-200' 
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <option value="ALL">Alle Belegungs-Status</option>
            <option value="occupied">Belegt</option>
            <option value="available">Frei (Verfügbar)</option>
            <option value="reserved">Reserviert</option>
            <option value="cleaning">Reinigung</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-semibold">
          Zeige <strong>{filteredRooms.length}</strong> Zimmer
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredRooms.map(room => {
          const resident = residents.find(r => r.id === room.residentId);
          return (
            <div
              key={room.id}
              className={`rounded-2xl border shadow-2xs transition-all flex flex-col justify-between overflow-hidden ${
                isNight 
                  ? 'bg-slate-900 border-slate-800 text-slate-100' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Room Image Preview Header */}
              {room.imageUrl && (
                <div className="relative h-32 overflow-hidden bg-slate-950">
                  <img
                    src={room.imageUrl}
                    alt={`Zimmer ${room.number}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <span className="bg-slate-900/90 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border border-slate-700">
                      Zimmer {room.number}
                    </span>
                    {getStatusBadge(room.status)}
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] text-white font-semibold flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                    Etage {room.floor} • {getTypeLabel(room.type)}
                  </div>
                </div>
              )}

              <div className="p-4 space-y-3">
                {/* Fallback Header if no image */}
                {!room.imageUrl && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg">
                          Zimmer {room.number}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Etage {room.floor}
                        </span>
                      </div>
                      {getStatusBadge(room.status)}
                    </div>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      {room.wing} • {getTypeLabel(room.type)}
                    </p>
                  </div>
                )}

                <p className="text-xs font-semibold text-slate-400">
                  Trakt: <strong className={isNight ? 'text-slate-200' : 'text-slate-800'}>{room.wing}</strong>
                </p>

                {/* Resident info if occupied */}
                {room.status === 'occupied' && resident && (
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                    isNight ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <img
                      src={resident.photoUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl object-cover border border-slate-300 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`font-bold text-xs truncate ${isNight ? 'text-white' : 'text-slate-900'}`}>
                        {resident.firstName} {resident.lastName}
                      </p>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 border border-amber-800 px-1.5 py-0.2 rounded">
                        BESA {resident.besaLevel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Room Features */}
                <div className="flex flex-wrap gap-1">
                  {room.features.map((feat, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                        isNight ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Status Toggle Footer */}
              <div className={`p-3 border-t flex items-center justify-between text-xs ${
                isNight ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
              }`}>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Tagessatz:</span>
                  <span className="font-bold text-emerald-400">CHF {room.pricePerDayCHF.toFixed(2)}</span>
                </div>

                <select
                  value={room.status}
                  onChange={(e) => onUpdateRoomStatus(room.id, e.target.value as Room['status'])}
                  className={`font-bold text-[11px] px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                    isNight 
                      ? 'bg-slate-800 text-slate-200 border-slate-700' 
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  <option value="occupied">Belegt</option>
                  <option value="available">Frei</option>
                  <option value="reserved">Reserviert</option>
                  <option value="cleaning">Reinigung</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

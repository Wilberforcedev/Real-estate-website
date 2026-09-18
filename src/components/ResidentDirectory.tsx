import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Building2, 
  Activity, 
  Phone, 
  Mail, 
  UserCheck, 
  ShieldCheck, 
  Stethoscope, 
  Pill, 
  Calendar, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  ChevronRight,
  Heart,
  X,
  Edit2
} from 'lucide-react';
import { Resident, CareLogEntry, MedicationItem, CareCategory, BesaLevel, Language, ThemeMode } from '../types';
import { getTranslation } from '../i18n';

interface ResidentDirectoryProps {
  residents: Resident[];
  careLogs: CareLogEntry[];
  medications: MedicationItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCantonFilter: string;
  language: Language;
  theme?: ThemeMode;
  onOpenAddResident: () => void;
  onAddCareLog: (log: Omit<CareLogEntry, 'id'>) => void;
  onOpenAiAssistant: () => void;
}

export const ResidentDirectory: React.FC<ResidentDirectoryProps> = ({
  residents,
  careLogs,
  medications,
  searchQuery,
  setSearchQuery,
  selectedCantonFilter,
  language,
  theme = 'light',
  onOpenAddResident,
  onAddCareLog,
  onOpenAiAssistant
}) => {
  const t = getTranslation(language);
  const isNight = theme === 'night';
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCareCategory, setSelectedCareCategory] = useState<string>('ALL');
  const [selectedBesaFilter, setSelectedBesaFilter] = useState<string>('ALL');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'meds' | 'journal' | 'besa'>('info');

  // New Care Log Form state inside modal
  const [newLogText, setNewLogText] = useState('');
  const [newLogCategory, setNewLogCategory] = useState<'medical' | 'vital' | 'incident' | 'activity' | 'hygiene'>('medical');
  const [newLogSeverity, setNewLogSeverity] = useState<'normal' | 'attention' | 'urgent'>('normal');

  // Filter residents logic
  const filteredResidents = residents.filter(r => {
    const matchesSearch = 
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ahvNumber.includes(searchQuery) ||
      r.roomNumber.includes(searchQuery) ||
      r.insuranceCompany.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCanton = selectedCantonFilter === 'ALL' || r.canton === selectedCantonFilter;
    const matchesCategory = selectedCareCategory === 'ALL' || r.careCategory === selectedCareCategory;
    const matchesBesa = selectedBesaFilter === 'ALL' || r.besaLevel === Number(selectedBesaFilter);

    return matchesSearch && matchesCanton && matchesCategory && matchesBesa;
  });

  const getCareCategoryLabel = (cat: CareCategory) => {
    switch (cat) {
      case 'somatics': return t.somatics;
      case 'dementia': return t.dementia;
      case 'palliative': return 'Palliative Care';
      case 'rehab': return t.rehab;
      case 'assisted_living': return t.assistedLiving;
      default: return cat;
    }
  };

  const handleCreateCareLog = () => {
    if (!selectedResident || !newLogText.trim()) return;
    onAddCareLog({
      residentId: selectedResident.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: newLogCategory,
      staffName: 'Regula Odermatt',
      staffRole: 'Dipl. Pflegefachfrau HF',
      summary: newLogText,
      severity: newLogSeverity
    });
    setNewLogText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {/* Care Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedCareCategory('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedCareCategory === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alle Bereiche
            </button>
            <button
              onClick={() => setSelectedCareCategory('somatics')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedCareCategory === 'somatics' ? 'bg-white text-[#5C6B4E] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Somatik
            </button>
            <button
              onClick={() => setSelectedCareCategory('dementia')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedCareCategory === 'dementia' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demenz
            </button>
            <button
              onClick={() => setSelectedCareCategory('palliative')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedCareCategory === 'palliative' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Palliative
            </button>
          </div>

          {/* BESA Level Selector */}
          <select
            value={selectedBesaFilter}
            onChange={(e) => setSelectedBesaFilter(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">Alle BESA-Stufen</option>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(l => (
              <option key={l} value={l}>BESA Stufe {l}</option>
            ))}
          </select>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-slate-600 transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
              title="Kachelansicht"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-slate-600 transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : ''}`}
              title="Tabellenansicht"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddResident}
            className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Neuer Bewohner</span>
          </button>
        </div>

      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResidents.map(resident => (
            <div
              key={resident.id}
              onClick={() => setSelectedResident(resident)}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-[#5C6B4E] hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group"
            >
              {/* Card Header */}
              <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={resident.photoUrl}
                    alt={`${resident.firstName} ${resident.lastName}`}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#5C6B4E] transition-colors">
                      {resident.firstName} {resident.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Zimmer {resident.roomNumber} • {resident.buildingWing}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      AHV: {resident.ahvNumber}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                    BESA {resident.besaLevel}
                  </span>
                  <span className="text-[10px] font-extrabold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    Kt. {resident.canton}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 text-xs flex-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold text-slate-500">Bereich:</span>
                  <span className="font-bold text-slate-900">{getCareCategoryLabel(resident.careCategory)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold text-slate-500">Krankenkasse:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]">{resident.insuranceCompany}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold text-slate-500">Bezugsperson:</span>
                  <span className="font-medium text-slate-900">{resident.primaryContact.name} ({resident.primaryContact.relation})</span>
                </div>

                {/* Dietary badges */}
                {resident.dietaryNeeds.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {resident.dietaryNeeds.map((diet, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                        {diet}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-600">Tagessatz: <strong>CHF {resident.dailyCostCHF.toFixed(2)}</strong></span>
                <span className="text-[#5C6B4E] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Dossier öffnen <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Bewohner / AHV</th>
                <th className="p-3.5">Zimmer & Trakt</th>
                <th className="p-3.5">BESA-Stufe</th>
                <th className="p-3.5">Kanton & KVG</th>
                <th className="p-3.5">Bezugsperson</th>
                <th className="p-3.5">Hausarzt</th>
                <th className="p-3.5 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map(r => (
                <tr key={r.id} className="hover:bg-emerald-50/40 transition-colors cursor-pointer" onClick={() => setSelectedResident(r)}>
                  <td className="p-3.5 flex items-center gap-3">
                    <img src={r.photoUrl} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <span className="font-bold text-slate-900 block">{r.firstName} {r.lastName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{r.ahvNumber}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium">
                    Rm {r.roomNumber} ({r.buildingWing})
                  </td>
                  <td className="p-3.5">
                    <span className="bg-amber-100 text-amber-900 font-black text-xs px-2 py-0.5 rounded-full">
                      Stufe {r.besaLevel}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800">Kt. {r.canton}</span>
                    <span className="block text-[10px] text-slate-500">{r.insuranceCompany}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-900">{r.primaryContact.name}</span>
                    <span className="block text-[10px] text-slate-500">{r.primaryContact.phone}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-900">{r.doctor.name}</span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button className="text-[#5C6B4E] font-bold hover:underline text-xs">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RESIDENT PROFILE DRAWER / MODAL */}
      {selectedResident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedResident.photoUrl}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-bold text-xl text-white">
                      {selectedResident.firstName} {selectedResident.lastName}
                    </h2>
                    <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                      BESA {selectedResident.besaLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Zimmer {selectedResident.roomNumber} ({selectedResident.buildingWing}) • Eintritt: {selectedResident.entryDate}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    AHV-Nr: {selectedResident.ahvNumber} • Kanton: {selectedResident.canton}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedResident(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setDetailTab('info')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  detailTab === 'info' ? 'border-[#5C6B4E] text-[#5C6B4E]' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Stammdaten & Kontakte</span>
              </button>

              <button
                onClick={() => setDetailTab('meds')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  detailTab === 'meds' ? 'border-[#5C6B4E] text-[#5C6B4E]' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Pill className="w-4 h-4 text-purple-600" />
                <span>Medikamente & Vital</span>
              </button>

              <button
                onClick={() => setDetailTab('journal')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  detailTab === 'journal' ? 'border-[#5C6B4E] text-[#5C6B4E]' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Pflegejournal ({careLogs.filter(l => l.residentId === selectedResident.id).length})</span>
              </button>

              <button
                onClick={() => setDetailTab('besa')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  detailTab === 'besa' ? 'border-[#5C6B4E] text-[#5C6B4E]' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>BESA KI-Analyse</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
              
              {/* TAB 1: STAMMDATEN & KONTAKTE */}
              {detailTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Personal & KVG */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="font-serif font-bold text-sm text-slate-900 border-b pb-2">
                      Versicherung & KVG Tarife
                    </h4>
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Krankenkasse:</span>
                        <span className="font-bold text-slate-900">{selectedResident.insuranceCompany}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Polisen-Nr:</span>
                        <span className="font-mono text-slate-800">{selectedResident.insurancePolicyNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ergänzungsleistungen (EL):</span>
                        <span className={`font-bold ${selectedResident.cantonalSubsidyEligible ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {selectedResident.cantonalSubsidyEligible ? 'Berechtigt (EL)' : 'Privatzahler'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tagessatz gesamt:</span>
                        <span className="font-extrabold text-[#5C6B4E]">CHF {selectedResident.dailyCostCHF.toFixed(2)}</span>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-slate-900 border-b pt-3 pb-2">
                      Ernährung & Allergien
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedResident.dietaryNeeds.map((d, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-lg border border-emerald-200">
                          {d}
                        </span>
                      ))}
                      {selectedResident.allergies.map((a, i) => (
                        <span key={i} className="bg-rose-50 text-rose-800 text-xs px-2.5 py-1 rounded-lg border border-rose-200 font-semibold">
                          Allergie: {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contacts & Doctor */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="font-serif font-bold text-sm text-slate-900 border-b pb-2">
                      Bezugsperson / Vertretung
                    </h4>
                    <div className="text-xs space-y-1.5">
                      <p className="font-bold text-slate-900 text-sm">{selectedResident.primaryContact.name}</p>
                      <p className="text-slate-600">Beziehung: <strong>{selectedResident.primaryContact.relation}</strong></p>
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedResident.primaryContact.phone}
                      </p>
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedResident.primaryContact.email}
                      </p>
                      {selectedResident.primaryContact.isLegalGuardian && (
                        <span className="inline-block bg-blue-100 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded-full mt-1">
                          Vertretungsberechtigt (Beistandschaft)
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-sm text-slate-900 border-b pt-3 pb-2">
                      Behandelnder Hausarzt
                    </h4>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-900">{selectedResident.doctor.name}</p>
                      <p className="text-slate-500">{selectedResident.doctor.praxis} ({selectedResident.doctor.specialty})</p>
                      <p className="text-slate-700 font-medium">Tel: {selectedResident.doctor.phone}</p>
                      {selectedResident.doctor.emergencyPhone && (
                        <p className="text-rose-700 font-bold">Notfall: {selectedResident.doctor.emergencyPhone}</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: MEDIKAMENTE & VITALZEICHEN */}
              {detailTab === 'meds' && (
                <div className="space-y-6">
                  
                  {/* Vitals */}
                  {selectedResident.vitals && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Blutdruck</span>
                        <p className="font-serif font-bold text-lg text-slate-900 mt-0.5">
                          {selectedResident.vitals.bloodPressureSys}/{selectedResident.vitals.bloodPressureDia}
                        </p>
                        <span className="text-[9px] text-slate-400">mmHg</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Puls</span>
                        <p className="font-serif font-bold text-lg text-slate-900 mt-0.5">
                          {selectedResident.vitals.pulse}
                        </p>
                        <span className="text-[9px] text-slate-400">SpM</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Gewicht</span>
                        <p className="font-serif font-bold text-lg text-slate-900 mt-0.5">
                          {selectedResident.vitals.weightKg} kg
                        </p>
                        <span className="text-[9px] text-slate-400">Letzte Wiegung</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Temperatur</span>
                        <p className="font-serif font-bold text-lg text-slate-900 mt-0.5">
                          {selectedResident.vitals.temperatureC} °C
                        </p>
                        <span className="text-[9px] text-slate-400">Axillar</span>
                      </div>
                    </div>
                  )}

                  {/* Medication Table */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <h4 className="font-serif font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
                      <span>Aktueller Verordnungs-Medikationsplan</span>
                      <span className="text-xs text-slate-500 font-normal">Arzt: {selectedResident.doctor.name}</span>
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-700">
                        <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-500">
                          <tr>
                            <th className="p-2.5">Medikament</th>
                            <th className="p-2.5">Dosis</th>
                            <th className="p-2.5 text-center">Morgen</th>
                            <th className="p-2.5 text-center">Mittag</th>
                            <th className="p-2.5 text-center">Abend</th>
                            <th className="p-2.5 text-center">Nacht</th>
                            <th className="p-2.5">Hinweis</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {medications.filter(m => m.residentId === selectedResident.id).map(med => (
                            <tr key={med.id}>
                              <td className="p-2.5 font-bold text-slate-900">{med.name}</td>
                              <td className="p-2.5 font-semibold text-slate-700">{med.dosage}</td>
                              <td className="p-2.5 text-center font-bold text-emerald-700">{med.schedule.morning ? '✓' : '-'}</td>
                              <td className="p-2.5 text-center font-bold text-emerald-700">{med.schedule.noon ? '✓' : '-'}</td>
                              <td className="p-2.5 text-center font-bold text-emerald-700">{med.schedule.evening ? '✓' : '-'}</td>
                              <td className="p-2.5 text-center font-bold text-emerald-700">{med.schedule.night ? '✓' : '-'}</td>
                              <td className="p-2.5 text-slate-500">{med.instructions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: PFLEGEJOURNAL */}
              {detailTab === 'journal' && (
                <div className="space-y-4">
                  
                  {/* Create New Log Input */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-700">
                      Neuer Pflegeeintrag (Pflegejournal)
                    </h4>
                    <textarea
                      rows={2}
                      value={newLogText}
                      onChange={(e) => setNewLogText(e.target.value)}
                      placeholder="Beobachtung, Pflegehandlung oder Befinden erfassen..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C6B4E]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <select
                          value={newLogCategory}
                          onChange={(e: any) => setNewLogCategory(e.target.value)}
                          className="bg-slate-100 text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200"
                        >
                          <option value="medical">Medizinisch</option>
                          <option value="vital">Vitalzeichen</option>
                          <option value="incident">Vorfall</option>
                          <option value="activity">Aktivierung</option>
                          <option value="hygiene">Grundpflege</option>
                        </select>

                        <select
                          value={newLogSeverity}
                          onChange={(e: any) => setNewLogSeverity(e.target.value)}
                          className="bg-slate-100 text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200"
                        >
                          <option value="normal">Normal</option>
                          <option value="attention">Aufmerksamkeit</option>
                          <option value="urgent">Dringend</option>
                        </select>
                      </div>

                      <button
                        onClick={handleCreateCareLog}
                        className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs"
                      >
                        Eintrag speichern
                      </button>
                    </div>
                  </div>

                  {/* Log list */}
                  <div className="space-y-2.5">
                    {careLogs.filter(l => l.residentId === selectedResident.id).map(log => (
                      <div key={log.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{log.summary}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.date} {log.time}</span>
                        </div>
                        {log.details && <p className="text-slate-600 text-[11px]">{log.details}</p>}
                        <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                          <span>Erfasst durch: {log.staffName} ({log.staffRole})</span>
                          <span className="uppercase font-bold text-[9px] bg-slate-100 px-1.5 py-0.5 rounded border">
                            {log.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 4: BESA KI ANALYSE */}
              {detailTab === 'besa' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900">
                        BESA-Stufen KI-Auswertung
                      </h4>
                      <p className="text-xs text-slate-500">
                        Automatische Neubewertung des täglichen Pflegebedarfs nach KVG-Standards
                      </p>
                    </div>
                    <button
                      onClick={onOpenAiAssistant}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>KI Assistent starten</span>
                    </button>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      Aktuelle BESA-Stufe: Stufe {selectedResident.besaLevel}
                    </p>
                    <p>
                      Letzte BESA-Überprüfung durchgeführt vor 4 Monaten. Nächste reguläre Feststellung empfohlen bis Oktober 2026.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  DollarSign, 
  HeartHandshake, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Building2, 
  FileCheck2, 
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Pill,
  BellRing,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  Sliders,
  Scale
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Resident, Room, Lead, CareLogEntry, MedicationItem, Language, ThemeMode } from '../types';
import { getTranslation } from '../i18n';
import { ClinicalComplianceWidget } from './ClinicalComplianceWidget';

interface DashboardOverviewProps {
  residents: Resident[];
  rooms: Room[];
  leads: Lead[];
  careLogs: CareLogEntry[];
  medications: MedicationItem[];
  language: Language;
  theme?: ThemeMode;
  onNavigateTab: (tab: 'dashboard' | 'residents' | 'leads' | 'rooms' | 'billing' | 'roster' | 'ai-assistant') => void;
  onSelectResident: (resident: Resident) => void;
  onOpenAiAssistant: () => void;
  onAddCareLog?: (log: Omit<CareLogEntry, 'id'>) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  residents,
  rooms,
  leads,
  careLogs,
  medications,
  language,
  theme = 'light',
  onNavigateTab,
  onSelectResident,
  onOpenAiAssistant,
  onAddCareLog
}) => {
  const t = getTranslation(language);
  const isNight = theme === 'night';

  // Medication Due Shift State
  const getCurrentShift = (): 'morning' | 'noon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 16) return 'noon';
    if (hour >= 16 && hour < 21) return 'evening';
    return 'night';
  };

  const [selectedShift, setSelectedShift] = useState<'morning' | 'noon' | 'evening' | 'night'>(getCurrentShift);
  const [administeredIds, setAdministeredIds] = useState<string[]>([]);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(false);
  const [radarViewMode, setRadarViewMode] = useState<'capacity' | 'wings'>('capacity');

  // Filter medications due for selected shift
  const activeMedications = medications.filter(m => m.active);
  const dueMedications = activeMedications.filter(
    m => m.schedule[selectedShift] && !administeredIds.includes(m.id)
  );

  // Group due medications by resident
  const dueByResidentMap = new Map<string, { resident: Resident; meds: MedicationItem[] }>();
  dueMedications.forEach(med => {
    const res = residents.find(r => r.id === med.residentId);
    if (res) {
      if (!dueByResidentMap.has(res.id)) {
        dueByResidentMap.set(res.id, { resident: res, meds: [] });
      }
      dueByResidentMap.get(res.id)!.meds.push(med);
    }
  });

  const dueResidentsList = Array.from(dueByResidentMap.values());

  const handleMarkAdministered = (medIds: string[]) => {
    setAdministeredIds(prev => [...prev, ...medIds]);
  };
  const activeResidents = residents.filter(r => r.status === 'active' || r.status === 'temporary');
  const totalBeds = rooms.length;
  const occupiedBeds = rooms.filter(r => r.status === 'occupied').length;
  const occupancyPercentage = Math.round((occupiedBeds / totalBeds) * 100);

  // Average BESA Level
  const totalBesa = activeResidents.reduce((acc, curr) => acc + curr.besaLevel, 0);
  const avgBesa = activeResidents.length ? (totalBesa / activeResidents.length).toFixed(1) : '0';

  // Revenue estimation
  const totalMonthlyRoomBoard = activeResidents.reduce((acc, curr) => acc + (curr.dailyCostCHF * 31), 0);
  const estimatedCantonalContribution = activeResidents.reduce((acc, curr) => acc + (curr.cantonalSubsidyEligible ? 2000 : 800), 0);
  const estimatedKvgContribution = activeResidents.reduce((acc, curr) => acc + (curr.besaLevel * 300), 0);

  // BESA Histogram Data
  const besaDistributionMap: { [key: number]: number } = {};
  for (let i = 1; i <= 12; i++) besaDistributionMap[i] = 0;
  activeResidents.forEach(r => {
    besaDistributionMap[r.besaLevel] = (besaDistributionMap[r.besaLevel] || 0) + 1;
  });
  const besaChartData = Object.keys(besaDistributionMap).map(level => ({
    level: `Stufe ${level}`,
    count: besaDistributionMap[Number(level)]
  }));

  // Revenue Pie Data
  const revenuePieData = [
    { name: 'Eigenanteil / Pension', value: Math.round(totalMonthlyRoomBoard * 0.5), color: '#5C6B4E' },
    { name: 'Kantonsbeitrag (EL)', value: Math.round(estimatedCantonalContribution), color: '#2563EB' },
    { name: 'KVG Krankenkasse', value: Math.round(estimatedKvgContribution), color: '#D97706' },
  ];

  // BESA/RAI Care Level & Resource Allocation Radar Data Calculation
  const calculateRadarData = () => {
    const besaMinutesMap: { [key: number]: number } = {
      1: 20, 2: 40, 3: 60, 4: 80, 5: 100, 6: 120,
      7: 150, 8: 180, 9: 210, 10: 240, 11: 270, 12: 300
    };

    let totalCareMinutes = 0;
    activeResidents.forEach(r => {
      totalCareMinutes += besaMinutesMap[r.besaLevel] || 60;
    });

    const totalActive = activeResidents.length || 1;

    // Dimension 1: Grundpflege & Hygiene
    const grundpflegeDemand = Math.min(100, Math.round(activeResidents.reduce((acc, r) => acc + r.besaLevel * 7.5, 0) / totalActive));
    
    // Dimension 2: Behandlungspflege & Meds
    const medicalMedsCount = activeMedications.length;
    const behandlungsDemand = Math.min(100, Math.round((activeResidents.filter(r => r.besaLevel >= 6).length * 12 + medicalMedsCount * 3) / totalActive * 8));

    // Dimension 3: Kognition & Demenz
    const dementiaCount = activeResidents.filter(r => r.careCategory === 'dementia').length;
    const kognitionDemand = Math.min(100, Math.round((dementiaCount * 30 + activeResidents.filter(r => r.besaLevel >= 8).length * 10) / totalActive * 7.5));

    // Dimension 4: Ernährung & Vitalia
    const specialDietsCount = activeResidents.filter(r => r.dietaryNeeds.length > 0).length;
    const ernaehrungDemand = Math.min(100, Math.round((specialDietsCount * 18 + activeResidents.length * 6) / totalActive * 6));

    // Dimension 5: Nachtwache & Sicherheit
    const nightMedsCount = activeMedications.filter(m => m.schedule.night).length;
    const nachtwacheDemand = Math.min(100, Math.round((nightMedsCount * 18 + activeResidents.filter(r => r.besaLevel >= 7).length * 12) / totalActive * 6.5));

    // Dimension 6: Mobilisation & Sozio
    const rehabCount = activeResidents.filter(r => r.careCategory === 'rehab' || r.careCategory === 'assisted_living').length;
    const sozioDemand = Math.min(100, Math.round((rehabCount * 22 + activeResidents.filter(r => r.besaLevel <= 5).length * 10) / totalActive * 7));

    const wingSantis = activeResidents.filter(r => r.buildingWing === 'Haus Säntis');
    const wingMatterhorn = activeResidents.filter(r => r.buildingWing === 'Haus Matterhorn');
    const wingEiger = activeResidents.filter(r => r.buildingWing === 'Residenz Eiger');

    const calcWingScore = (residentsList: Resident[], factor: number) => {
      if (!residentsList.length) return 25;
      const avg = residentsList.reduce((a, b) => a + b.besaLevel, 0) / residentsList.length;
      return Math.min(100, Math.round(avg * factor * 11));
    };

    const capacityData = [
      { domain: 'Grundpflege & ADL', Bedarf: grundpflegeDemand, Kapazitaet: 85, Santis: 0, Matterhorn: 0, Eiger: 0, fullMark: 100 },
      { domain: 'Behandlungspflege', Bedarf: behandlungsDemand, Kapazitaet: 78, Santis: 0, Matterhorn: 0, Eiger: 0, fullMark: 100 },
      { domain: 'Kognition & Demenz', Bedarf: kognitionDemand, Kapazitaet: 70, Santis: 0, Matterhorn: 0, Eiger: 0, fullMark: 100 },
      { domain: 'Ernährung & Vitalia', Bedarf: ernaehrungDemand, Kapazitaet: 90, Santis: 0, Matterhorn: 0, Eiger: 0, fullMark: 100 },
      { domain: 'Nachtwache & Sicherheit', Bedarf: nachtwacheDemand, Kapazitaet: 80, Santis: 0, Matterhorn: 0, Eiger: 0, fullMark: 100 },
      { domain: 'Mobilisation & Sozio', Bedarf: sozioDemand, Kapazitaet: 88, Santis: 0, Matterhorn: 0, Eiger: 0, fullMark: 100 },
    ];

    const wingsData = [
      { domain: 'Grundpflege & ADL', Bedarf: 0, Kapazitaet: 0, Santis: calcWingScore(wingSantis, 1.1), Matterhorn: calcWingScore(wingMatterhorn, 1.3), Eiger: calcWingScore(wingEiger, 0.8), fullMark: 100 },
      { domain: 'Behandlungspflege', Bedarf: 0, Kapazitaet: 0, Santis: calcWingScore(wingSantis, 1.0), Matterhorn: calcWingScore(wingMatterhorn, 1.4), Eiger: calcWingScore(wingEiger, 0.7), fullMark: 100 },
      { domain: 'Kognition & Demenz', Bedarf: 0, Kapazitaet: 0, Santis: calcWingScore(wingSantis, 0.8), Matterhorn: calcWingScore(wingMatterhorn, 1.6), Eiger: calcWingScore(wingEiger, 0.6), fullMark: 100 },
      { domain: 'Ernährung & Vitalia', Bedarf: 0, Kapazitaet: 0, Santis: calcWingScore(wingSantis, 1.0), Matterhorn: calcWingScore(wingMatterhorn, 1.1), Eiger: calcWingScore(wingEiger, 0.9), fullMark: 100 },
      { domain: 'Nachtwache & Sicherheit', Bedarf: 0, Kapazitaet: 0, Santis: calcWingScore(wingSantis, 0.9), Matterhorn: calcWingScore(wingMatterhorn, 1.3), Eiger: calcWingScore(wingEiger, 0.8), fullMark: 100 },
      { domain: 'Mobilisation & Sozio', Bedarf: 0, Kapazitaet: 0, Santis: calcWingScore(wingSantis, 1.2), Matterhorn: calcWingScore(wingMatterhorn, 0.8), Eiger: calcWingScore(wingEiger, 1.3), fullMark: 100 },
    ];

    return {
      totalCareMinutes,
      requiredFte: (totalCareMinutes / 420).toFixed(1),
      data: radarViewMode === 'capacity' ? capacityData : wingsData
    };
  };

  const radarMetrics = calculateRadarData();

  // Urgent / Attention Care logs
  const urgentLogs = careLogs.filter(l => l.severity === 'attention' || l.severity === 'urgent');

  return (
    <div className="space-y-6">
      
      {/* Top Swiss Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              🇨🇭 Schweiz KVB Standard
            </span>
            <span className="text-emerald-400 text-xs font-semibold">Residenz Alpina • Cantons ZH, BE, LU, SG</span>
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
            Alters- & Pflegeheim Tagesübersicht
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Willkommen im SanoCare Cockpit. <strong>{activeResidents.length} Bewohner</strong> betreut in <strong>{occupiedBeds}/{totalBeds} Zimmern</strong> ({occupancyPercentage}% Belegung). Durchschnittliche BESA-Pflegestufe: <strong>Stufe {avgBesa}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAiAssistant}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>KI-Pflegebericht & BESA</span>
          </button>
        </div>
      </div>

      {/* MEDICATION DUE NOTIFICATION BANNER */}
      {!isBannerDismissed && (
        <div className={`rounded-2xl border transition-all shadow-xs overflow-hidden ${
          dueMedications.length > 0 
            ? 'bg-amber-50/90 border-amber-300 text-slate-900' 
            : 'bg-emerald-50/80 border-emerald-200 text-slate-900'
        }`}>
          {/* Header Row */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/60">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                dueMedications.length > 0 ? 'bg-amber-500 text-white shadow-sm animate-pulse' : 'bg-emerald-600 text-white'
              }`}>
                {dueMedications.length > 0 ? <Pill className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    dueMedications.length > 0 ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {dueMedications.length > 0 ? t.medicationNotice : t.medicationRoundDone}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {selectedShift === 'morning' && t.morningShift}
                    {selectedShift === 'noon' && t.noonShift}
                    {selectedShift === 'evening' && t.eveningShift}
                    {selectedShift === 'night' && t.nightShift}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900 mt-0.5 flex items-center gap-2">
                  {dueMedications.length > 0 
                    ? `${dueMedications.length} ${t.medsPending}` 
                    : t.allMedsAdministered}
                </h3>
              </div>
            </div>

            {/* Shift Filter & Banner Controls */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
              {/* Shift Selector */}
              <div className="flex items-center bg-white/80 border border-slate-200 rounded-xl p-1 gap-1 text-xs">
                {(['morning', 'noon', 'evening', 'night'] as const).map((shift) => (
                  <button
                    key={shift}
                    onClick={() => {
                      setSelectedShift(shift);
                      setIsBannerCollapsed(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                      selectedShift === shift
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {shift === 'morning' && t.morning}
                    {shift === 'noon' && t.noon}
                    {shift === 'evening' && t.evening}
                    {shift === 'night' && t.night}
                  </button>
                ))}
              </div>

              {dueMedications.length > 0 && (
                <button
                  onClick={() => setIsBannerCollapsed(!isBannerCollapsed)}
                  className="p-2 text-slate-600 hover:text-slate-900 bg-white/80 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
                  title={isBannerCollapsed ? 'Details anzeigen' : 'Einklappen'}
                >
                  {isBannerCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => setIsBannerDismissed(true)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
                title="Banner ausblenden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed Resident Medication List */}
          {dueMedications.length > 0 && !isBannerCollapsed && (
            <div className="p-4 sm:p-5 bg-white/60 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dueResidentsList.map(({ resident, meds }) => (
                  <div
                    key={resident.id}
                    className="p-3.5 bg-white rounded-xl border border-amber-200/90 shadow-2xs flex flex-col justify-between space-y-3 hover:border-amber-400 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                        <img
                          src={resident.photoUrl}
                          alt={`${resident.firstName} ${resident.lastName}`}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {resident.firstName} {resident.lastName}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Zimmer {resident.roomNumber} • {resident.buildingWing}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 space-y-1.5">
                        {meds.map(med => (
                          <div key={med.id} className="text-xs bg-amber-50/60 border border-amber-100 rounded-lg p-2">
                            <div className="flex items-center justify-between font-bold text-slate-800">
                              <span>{med.name}</span>
                              <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded font-mono">
                                {med.dosage}
                              </span>
                            </div>
                            {med.instructions && (
                              <p className="text-[11px] text-slate-600 mt-0.5 italic">
                                💡 {med.instructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                      <button
                        onClick={() => onSelectResident(resident)}
                        className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline"
                      >
                        Profil öffnen
                      </button>
                      <button
                        onClick={() => handleMarkAdministered(meds.map(m => m.id))}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Als Verabreicht zeichnen</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Occupancy */}
        <div 
          onClick={() => onNavigateTab('rooms')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Belegungsquote</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-slate-900">{occupancyPercentage}%</span>
            <span className="text-xs font-semibold text-emerald-600">{occupiedBeds} / {totalBeds} Betten</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${occupancyPercentage}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{totalBeds - occupiedBeds} Zimmer frei</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
          </p>
        </div>

        {/* KPI 2: BESA Average */}
        <div 
          onClick={() => onNavigateTab('residents')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-500 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">BESA-Schnitt</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-slate-900">Stufe {avgBesa}</span>
            <span className="text-xs font-semibold text-amber-700">~124 Min/Tag</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(Number(avgBesa) / 12) * 100}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>KVG-Tarifklasse A3</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
          </p>
        </div>

        {/* KPI 3: Monthly CHF Revenue */}
        <div 
          onClick={() => onNavigateTab('billing')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monatsumsatz (CHF)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-slate-900">CHF {(totalMonthlyRoomBoard / 1000).toFixed(1)}k</span>
            <span className="text-xs font-semibold text-blue-600">+EL & KVG</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-between">
            <span>Restfinanzierung aktiv</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
          </p>
        </div>

        {/* KPI 4: Leads / Admissions Pipeline */}
        <div 
          onClick={() => onNavigateTab('leads')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-500 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aufnahme-Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-slate-900">{leads.length} Anfragen</span>
            <span className="text-xs font-semibold text-purple-600">Offene Abklärungen</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-between">
            <span>2 auf Warteliste</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400" />
          </p>
        </div>
      </div>

      {/* CLINICAL COMPLIANCE WIDGET: Medication Deadlines & Overdue Care Logs */}
      <ClinicalComplianceWidget
        residents={residents}
        careLogs={careLogs}
        medications={medications}
        language={language}
        theme={theme}
        onSelectResident={onSelectResident}
        onAddCareLog={onAddCareLog}
      />

      {/* Main Grid: Charts & Urgent Care Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* RADAR CHART: Care Level Distribution (BESA/RAI) & Resource Allocation Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    BESA / RAI Radar
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Personalressourcen & Pflegelast
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900 mt-1 flex items-center gap-2">
                  Pflegeaufwand & Ressourcenallokation
                </h3>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
                <button
                  onClick={() => setRadarViewMode('capacity')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    radarViewMode === 'capacity'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Soll/Ist-Kapazität
                </button>
                <button
                  onClick={() => setRadarViewMode('wings')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    radarViewMode === 'wings'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Flügel-Vergleich
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Radar Chart Visual */}
              <div className="md:col-span-2 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarMetrics.data}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

                    {radarViewMode === 'capacity' ? (
                      <>
                        <Radar name="Erforderlicher Pflegebedarf (BESA)" dataKey="Bedarf" stroke="#D97706" fill="#F59E0B" fillOpacity={0.45} />
                        <Radar name="Zugewiesene Personalkapazität" dataKey="Kapazitaet" stroke="#059669" fill="#10B981" fillOpacity={0.3} />
                      </>
                    ) : (
                      <>
                        <Radar name="Haus Säntis" dataKey="Santis" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.35} />
                        <Radar name="Haus Matterhorn (Demenz)" dataKey="Matterhorn" stroke="#DC2626" fill="#EF4444" fillOpacity={0.35} />
                        <Radar name="Residenz Eiger" dataKey="Eiger" stroke="#059669" fill="#10B981" fillOpacity={0.35} />
                      </>
                    )}
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Admin Workload Metrics & Allocation Recommendation */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  Dienstplan-Analyse
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">BESA-Gesamtzeit:</span>
                    <span className="font-bold text-slate-900 font-mono">{radarMetrics.totalCareMinutes} Min/Tag</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">HF/FA Soll-Besetzung:</span>
                    <span className="font-bold text-emerald-700 font-mono">{radarMetrics.requiredFte} VZÄ</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                    <p className="font-bold text-amber-900 text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Empfehlung Personal-Umschichtung
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      Erhöhter BESA-Bedarf im Bereich <strong>Kognition & Demenz</strong> (Haus Matterhorn). Es wird empfohlen, 1 Dipl. Pflegefachperson für den Spätdienst aus Residenz Eiger zuzuteilen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BESA Level Distribution Bar Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  BESA-Pflegestufen Verteilung (1 - 12)
                </h3>
                <p className="text-xs text-slate-500">
                  Übersicht des täglichen Pflegeaufwands gemäss Schweizer KVG-Klassifikation
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                Schnitt: Stufe {avgBesa}
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={besaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="level" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    formatter={(val) => [`${val} Bewohner`, 'Anzahl']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {besaChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index > 5 ? '#D97706' : '#5C6B4E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resident Directory Quick Spotlight */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-base text-slate-900">
                Aktive Bewohner (Direktzugriff)
              </h3>
              <button 
                onClick={() => onNavigateTab('residents')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Alle Bewohner ({activeResidents.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeResidents.map(res => (
                <div
                  key={res.id}
                  onClick={() => onSelectResident(res)}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 rounded-xl transition-all cursor-pointer flex items-center gap-3"
                >
                  <img
                    src={res.photoUrl}
                    alt={`${res.firstName} ${res.lastName}`}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-2xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{res.firstName} {res.lastName}</h4>
                      <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        BESA {res.besaLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Zimmer {res.roomNumber} • {res.buildingWing}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-600">
                      <span>AHV: {res.ahvNumber}</span>
                      <span>• Kt. {res.canton}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Nursing Alerts & Shift Logs */}
        <div className="space-y-6">
          
          {/* Urgent / Attention Nursing Logs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Pflege-Journal & Hinweise
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {urgentLogs.length} Einträge
              </span>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {careLogs.map(log => {
                const resident = residents.find(r => r.id === log.residentId);
                return (
                  <div 
                    key={log.id} 
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      log.severity === 'attention' || log.severity === 'urgent'
                        ? 'bg-amber-50/70 border-amber-200 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">
                        {resident ? `${resident.firstName} ${resident.lastName}` : 'Bewohner'} (Zimmer {resident?.roomNumber})
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" /> {log.time}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800">{log.summary}</p>
                    {log.details && <p className="text-[11px] text-slate-600 mt-1">{log.details}</p>}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                      <span>{log.staffName} ({log.staffRole})</span>
                      <span className="uppercase font-bold tracking-wider text-[9px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {log.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Breakdown Pie Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-serif font-bold text-base text-slate-900 mb-1">
              Schweizer Tarif-Aufteilung (CHF)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Kostenaufteilung zwischen Bewohner, Canton & KVG Krankenkasse
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenuePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {revenuePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`CHF ${val.toLocaleString()}`, 'Betrag']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2">
              {revenuePieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">CHF {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

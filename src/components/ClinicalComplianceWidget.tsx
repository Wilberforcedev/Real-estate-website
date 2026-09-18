import React, { useState, useMemo } from 'react';
import { 
  Pill, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Stethoscope, 
  Plus, 
  Search, 
  Check, 
  ShieldAlert, 
  Activity,
  HeartPulse,
  User,
  X
} from 'lucide-react';
import { Resident, CareLogEntry, MedicationItem, Language, ThemeMode } from '../types';

interface ClinicalComplianceWidgetProps {
  residents: Resident[];
  careLogs: CareLogEntry[];
  medications: MedicationItem[];
  language: Language;
  theme?: ThemeMode;
  onSelectResident: (resident: Resident) => void;
  onAddCareLog?: (log: Omit<CareLogEntry, 'id'>) => void;
}

type ShiftType = 'all' | 'morning' | 'noon' | 'evening' | 'night';
type FilterType = 'all' | 'meds' | 'logs' | 'urgent';

interface MedDeadlineItem {
  id: string;
  medication: MedicationItem;
  shift: 'morning' | 'noon' | 'evening' | 'night';
  deadlineTime: string;
  isOverdue: boolean;
  minutesRemaining?: number;
}

interface OverdueLogItem {
  resident: Resident;
  lastLog?: CareLogEntry;
  hoursSinceLastLog: number;
  reason: string;
  isCritical: boolean;
}

export const ClinicalComplianceWidget: React.FC<ClinicalComplianceWidgetProps> = ({
  residents,
  careLogs,
  medications,
  language,
  theme = 'light',
  onSelectResident,
  onAddCareLog
}) => {
  const isNight = theme === 'night';

  // Determine current system shift
  const currentHour = new Date().getHours();
  const currentShiftKey: 'morning' | 'noon' | 'evening' | 'night' = 
    currentHour >= 6 && currentHour < 11 ? 'morning' :
    currentHour >= 11 && currentHour < 16 ? 'noon' :
    currentHour >= 16 && currentHour < 21 ? 'evening' : 'night';

  // State
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<ShiftType>('all');
  const [activeTabFilter, setActiveTabFilter] = useState<FilterType>('all');
  const [wingFilter, setWingFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Persisted administered records: key format `${medId}_${shift}_${dateString}`
  const todayStr = new Date().toISOString().split('T')[0];
  const [administeredMap, setAdministeredMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('sanocare_admin_meds');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Inline Care Log Modal State
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [quickLogResident, setQuickLogResident] = useState<Resident | null>(null);
  const [quickLogSummary, setQuickLogSummary] = useState('');
  const [quickLogDetails, setQuickLogDetails] = useState('');
  const [quickLogCategory, setQuickLogCategory] = useState<'medical' | 'vital' | 'incident' | 'hygiene' | 'besa_review'>('medical');
  const [quickLogSeverity, setQuickLogSeverity] = useState<'normal' | 'attention' | 'urgent'>('normal');
  const [quickLogStaffName, setQuickLogStaffName] = useState('Regula Odermatt');
  const [quickLogStaffRole, setQuickLogStaffRole] = useState('Dipl. Pflegefachfrau HF');

  // Mark medication administered
  const handleMarkMedAdministered = (medId: string, shift: string, residentName: string, medName: string) => {
    const key = `${medId}_${shift}_${todayStr}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = { ...administeredMap, [key]: timestamp };
    setAdministeredMap(updated);
    try {
      localStorage.setItem('sanocare_admin_meds', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Also auto-add a quick care log entry if available
    if (onAddCareLog) {
      onAddCareLog({
        residentId: medications.find(m => m.id === medId)?.residentId || '',
        date: todayStr,
        time: timestamp,
        category: 'medical',
        staffName: 'Lukas Wenger',
        staffRole: 'Fachmann Gesundheit FaGe',
        summary: `Medikation ${medName} (${shift}) verabreicht`,
        details: `Gemäss Verordnung pünktlich an ${residentName} abgegeben. Keine Unverträglichkeiten beobachtet.`,
        severity: 'normal'
      });
    }
  };

  // Submit quick care log
  const handleSaveQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogResident || !quickLogSummary.trim()) return;

    if (onAddCareLog) {
      const now = new Date();
      onAddCareLog({
        residentId: quickLogResident.id,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: quickLogCategory,
        staffName: quickLogStaffName,
        staffRole: quickLogStaffRole,
        summary: quickLogSummary,
        details: quickLogDetails,
        severity: quickLogSeverity
      });
    }

    setIsQuickLogModalOpen(false);
    setQuickLogSummary('');
    setQuickLogDetails('');
  };

  // --- ANALYSIS ENGINE ---
  const analysis = useMemo(() => {
    const activeResidents = residents.filter(r => r.status === 'active' || r.status === 'temporary');

    // 1. Calculate Medication Deadlines
    const shiftDeadlines: Record<'morning' | 'noon' | 'evening' | 'night', { time: string; deadlineHour: number }> = {
      morning: { time: '09:00', deadlineHour: 9 },
      noon: { time: '13:00', deadlineHour: 13 },
      evening: { time: '19:30', deadlineHour: 19.5 },
      night: { time: '23:00', deadlineHour: 23 }
    };

    const residentMedItems: {
      resident: Resident;
      deadlines: MedDeadlineItem[];
    }[] = [];

    activeResidents.forEach(resident => {
      const resMeds = medications.filter(m => m.residentId === resident.id && m.active);
      const deadlines: MedDeadlineItem[] = [];

      resMeds.forEach(med => {
        (['morning', 'noon', 'evening', 'night'] as const).forEach(shift => {
          if (med.schedule[shift]) {
            // Check if selected shift filter matches
            if (selectedShiftFilter !== 'all' && selectedShiftFilter !== shift) {
              return;
            }

            const adminKey = `${med.id}_${shift}_${todayStr}`;
            const isAlreadyGiven = !!administeredMap[adminKey];

            if (!isAlreadyGiven) {
              const deadline = shiftDeadlines[shift];
              const isOverdue = currentHour >= deadline.deadlineHour;

              deadlines.push({
                id: `${med.id}-${shift}`,
                medication: med,
                shift,
                deadlineTime: deadline.time,
                isOverdue
              });
            }
          }
        });
      });

      if (deadlines.length > 0) {
        residentMedItems.push({ resident, deadlines });
      }
    });

    // 2. Calculate Overdue Care Logs
    const now = new Date();
    const overdueCareLogsList: OverdueLogItem[] = [];

    activeResidents.forEach(resident => {
      // Find all logs for this resident
      const resLogs = careLogs
        .filter(l => l.residentId === resident.id)
        .sort((a, b) => {
          const dtA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
          const dtB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
          return dtB - dtA;
        });

      const lastLog = resLogs[0];

      let hoursSince = 999;
      if (lastLog) {
        const logDate = new Date(`${lastLog.date}T${lastLog.time || '12:00'}`);
        hoursSince = Math.max(0, Math.round((now.getTime() - logDate.getTime()) / (1000 * 60 * 60)));
      }

      // Swiss Clinical criteria for overdue care logs:
      // A) BESA level >= 8: daily clinical check required (overdue if > 18 hours or no log today)
      // B) BESA level 4-7: log required at least every 24 hours
      // C) Palliative or Dementia: log required within last 16 hours
      // D) Last log had attention/urgent severity: requires follow-up within 12 hours
      let isOverdue = false;
      let reason = '';
      let isCritical = false;

      if (!lastLog) {
        isOverdue = true;
        isCritical = true;
        reason = 'Keine Pflegedokumentation im System hinterlegt.';
      } else if (lastLog.severity === 'urgent' && hoursSince > 8) {
        isOverdue = true;
        isCritical = true;
        reason = `Dringender Vorfall vor ${hoursSince}h erfordert ärztliche/klinische Verlaufsnotiz.`;
      } else if (lastLog.severity === 'attention' && hoursSince > 14) {
        isOverdue = true;
        reason = `Letzte Auffälligkeit (${lastLog.summary}) vor ${hoursSince}h ohne Nachkontrolle.`;
      } else if (resident.besaLevel >= 8 && hoursSince > 18) {
        isOverdue = true;
        isCritical = resident.besaLevel >= 10;
        reason = `BESA Stufe ${resident.besaLevel} verlangt tägliche KVG-Verlaufsdokumentation (letzter Eintrag vor ${hoursSince}h).`;
      } else if (resident.careCategory === 'dementia' && hoursSince > 22) {
        isOverdue = true;
        reason = `Demenzbetreuung: Verhaltens- & Orientierungsbericht seit ${hoursSince}h ausstehend.`;
      } else if (hoursSince > 26) {
        isOverdue = true;
        reason = `Reguläres Pflegejournal überfällig (letzter Eintrag vor ${hoursSince}h).`;
      }

      if (isOverdue) {
        overdueCareLogsList.push({
          resident,
          lastLog,
          hoursSinceLastLog: hoursSince,
          reason,
          isCritical
        });
      }
    });

    // 3. Aggregate residents with issues
    const combinedMap = new Map<string, {
      resident: Resident;
      medDeadlines: MedDeadlineItem[];
      overdueLog?: OverdueLogItem;
      hasCriticalIssue: boolean;
    }>();

    residentMedItems.forEach(({ resident, deadlines }) => {
      combinedMap.set(resident.id, {
        resident,
        medDeadlines: deadlines,
        hasCriticalIssue: deadlines.some(d => d.isOverdue)
      });
    });

    overdueCareLogsList.forEach(item => {
      const existing = combinedMap.get(item.resident.id);
      if (existing) {
        existing.overdueLog = item;
        if (item.isCritical) existing.hasCriticalIssue = true;
      } else {
        combinedMap.set(item.resident.id, {
          resident: item.resident,
          medDeadlines: [],
          overdueLog: item,
          hasCriticalIssue: item.isCritical
        });
      }
    });

    const combinedList = Array.from(combinedMap.values());

    // Counters
    const totalOverdueMeds = residentMedItems.reduce(
      (acc, curr) => acc + curr.deadlines.filter(d => d.isOverdue).length, 0
    );
    const totalUpcomingMeds = residentMedItems.reduce(
      (acc, curr) => acc + curr.deadlines.length, 0
    );
    const totalOverdueLogs = overdueCareLogsList.length;
    const criticalCasesCount = combinedList.filter(c => c.hasCriticalIssue).length;

    // Compliance rate calculation
    const totalTracked = activeResidents.length;
    const compliantCount = activeResidents.filter(r => !combinedMap.has(r.id)).length;
    const complianceRate = totalTracked > 0 ? Math.round((compliantCount / totalTracked) * 100) : 100;

    return {
      residentMedItems,
      overdueCareLogsList,
      combinedList,
      totalOverdueMeds,
      totalUpcomingMeds,
      totalOverdueLogs,
      criticalCasesCount,
      complianceRate,
      totalTracked
    };
  }, [residents, careLogs, medications, selectedShiftFilter, administeredMap, currentHour, todayStr]);

  // Filter combined list by user selections
  const filteredResidentsList = useMemo(() => {
    return analysis.combinedList.filter(item => {
      // Tab filter
      if (activeTabFilter === 'meds' && item.medDeadlines.length === 0) return false;
      if (activeTabFilter === 'logs' && !item.overdueLog) return false;
      if (activeTabFilter === 'urgent' && !item.hasCriticalIssue) return false;

      // Wing filter
      if (wingFilter !== 'all' && item.resident.buildingWing !== wingFilter) return false;

      // Search filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = `${item.resident.firstName} ${item.resident.lastName}`.toLowerCase().includes(query);
        const matchesRoom = item.resident.roomNumber.toLowerCase().includes(query);
        const matchesMed = item.medDeadlines.some(m => m.medication.name.toLowerCase().includes(query));
        if (!matchesName && !matchesRoom && !matchesMed) return false;
      }

      return true;
    });
  }, [analysis.combinedList, activeTabFilter, wingFilter, searchTerm]);

  const getShiftBadge = (shift: 'morning' | 'noon' | 'evening' | 'night') => {
    switch (shift) {
      case 'morning':
        return { label: 'Frühdienst (09:00)', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'noon':
        return { label: 'Mittagsdienst (13:00)', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'evening':
        return { label: 'Spätdienst (19:30)', bg: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      case 'night':
        return { label: 'Nachtdienst (23:00)', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
    }
  };

  return (
    <section 
      id="clinical-compliance-widget"
      className={`rounded-2xl border transition-all shadow-sm overflow-hidden ${
        isNight 
          ? 'bg-slate-900/95 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Banner Header */}
      <div className={`p-5 border-b ${
        isNight ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50/70'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <ShieldAlert className="w-3 h-3" />
                KVG Art. 25a / BESA Konform
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                analysis.criticalCasesCount > 0 
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300 animate-pulse' 
                  : 'bg-emerald-100 text-emerald-800 font-bold'
              }`}>
                {analysis.criticalCasesCount > 0 
                  ? `⚠️ ${analysis.criticalCasesCount} Frist-Warnungen erfordern Pflegeintervention` 
                  : '✅ Alle Fristen im Sollbereich'}
              </span>
              <span className="text-xs text-slate-400">
                Aktuelle Schicht: <strong>{getShiftBadge(currentShiftKey).label}</strong>
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Klinisches Fristen-Radar: Medikamente & Pflegejournale</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl leading-relaxed">
              Echtzeit-Überwachung zur Vermeidung von Medikationsfehlern und Lücken in der gesetzlichen BESA/KVG-Verlaufsdokumentation.
            </p>
          </div>

          {/* Quick Metrics KPI Ribbons */}
          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0 flex-wrap sm:flex-nowrap">
            {/* Overdue Meds Badge */}
            <div className={`px-3 py-2 rounded-xl border text-center min-w-[95px] ${
              analysis.totalOverdueMeds > 0 
                ? 'bg-red-50 border-red-200 text-red-900' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                <Pill className="w-3 h-3 text-red-500" />
                Meds Überfällig
              </div>
              <div className="text-lg font-bold font-mono text-red-600 mt-0.5">
                {analysis.totalOverdueMeds}
              </div>
            </div>

            {/* Overdue Logs Badge */}
            <div className={`px-3 py-2 rounded-xl border text-center min-w-[95px] ${
              analysis.totalOverdueLogs > 0 
                ? 'bg-amber-50 border-amber-200 text-amber-900' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                <FileText className="w-3 h-3 text-amber-600" />
                Journale Fällig
              </div>
              <div className="text-lg font-bold font-mono text-amber-700 mt-0.5">
                {analysis.totalOverdueLogs}
              </div>
            </div>

            {/* Open Shift Meds */}
            <div className="px-3 py-2 rounded-xl border bg-blue-50/70 border-blue-200 text-blue-900 text-center min-w-[95px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" />
                Offen Heute
              </div>
              <div className="text-lg font-bold font-mono text-blue-800 mt-0.5">
                {analysis.totalUpcomingMeds}
              </div>
            </div>

            {/* Compliance Rate */}
            <div className="px-3 py-2 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 text-center min-w-[95px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Compliance
              </div>
              <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
                {analysis.complianceRate}%
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Shift Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTabFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Alle Fälle</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {analysis.combinedList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTabFilter('urgent')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTabFilter === 'urgent'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Kritisch / Überfällig</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-800 text-white">
                {analysis.criticalCasesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTabFilter('meds')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTabFilter === 'meds'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Medikamenten-Fristen</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-900 text-white">
                {analysis.totalUpcomingMeds}
              </span>
            </button>

            <button
              onClick={() => setActiveTabFilter('logs')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTabFilter === 'logs'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Überfällige Pflegejournale</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-800 text-white">
                {analysis.totalOverdueLogs}
              </span>
            </button>
          </div>

          {/* Secondary Controls: Shift Picker & Wing Select */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Shift Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">Schicht:</span>
              {(['all', 'morning', 'noon', 'evening', 'night'] as const).map(shift => (
                <button
                  key={shift}
                  onClick={() => setSelectedShiftFilter(shift)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedShiftFilter === shift 
                      ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {shift === 'all' ? 'Alle' : 
                   shift === 'morning' ? 'Früh' : 
                   shift === 'noon' ? 'Mittag' : 
                   shift === 'evening' ? 'Spät' : 'Nacht'}
                </button>
              ))}
            </div>

            {/* Wing Filter */}
            <select
              value={wingFilter}
              onChange={e => setWingFilter(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">Alle Trakte</option>
              <option value="Haus Säntis">Haus Säntis</option>
              <option value="Haus Matterhorn">Haus Matterhorn</option>
              <option value="Residenz Eiger">Residenz Eiger</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Bewohner / Zimmer / Med..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden w-36 sm:w-44 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Widget Content Body */}
      <div className="p-5">
        {filteredResidentsList.length === 0 ? (
          <div className="text-center py-10 px-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Ausgezeichnet! Alle Fristen für diesen Filter erfüllt.
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Für die gewählten Kriterien liegen keine überfälligen Medikamentengaben oder ausstehenden Pflegejournale vor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredResidentsList.map(({ resident, medDeadlines, overdueLog, hasCriticalIssue }) => (
              <div
                key={resident.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  hasCriticalIssue
                    ? 'bg-red-50/40 border-red-300 hover:border-red-400 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-emerald-400 shadow-2xs'
                }`}
              >
                <div>
                  {/* Resident Header Card */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={resident.photoUrl}
                        alt={`${resident.firstName} ${resident.lastName}`}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 
                            onClick={() => onSelectResident(resident)}
                            className="font-bold text-sm text-slate-900 hover:text-emerald-700 cursor-pointer flex items-center gap-1 transition-colors"
                          >
                            <span>{resident.firstName} {resident.lastName}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </h4>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                            resident.besaLevel >= 8 ? 'bg-red-100 text-red-800' :
                            resident.besaLevel >= 5 ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            BESA {resident.besaLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Zimmer <strong>{resident.roomNumber}</strong> • {resident.buildingWing} • Kt. {resident.canton}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {hasCriticalIssue && (
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                          <AlertTriangle className="w-3 h-3" />
                          Dringlich
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-mono">
                        AHV {resident.ahvNumber.split('.').slice(-2).join('.')}
                      </span>
                    </div>
                  </div>

                  {/* Warning 1: Overdue Care Log Section */}
                  {overdueLog && (
                    <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-amber-700" />
                          Überfälliger Pflegeverlaufsbericht
                        </span>
                        <span className="text-[10px] font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                          {overdueLog.hoursSinceLastLog >= 999 
                            ? 'Kein Eintrag' 
                            : `Letzter vor ${overdueLog.hoursSinceLastLog} Std`}
                        </span>
                      </div>
                      
                      <p className="text-slate-700 text-[11px] font-medium leading-relaxed">
                        {overdueLog.reason}
                      </p>

                      {overdueLog.lastLog && (
                        <div className="mt-2 pt-2 border-t border-amber-200/60 text-[10px] text-slate-600 flex items-center justify-between">
                          <span className="italic truncate max-w-[240px]">
                            Letzter Eintrag: &quot;{overdueLog.lastLog.summary}&quot;
                          </span>
                          <span className="font-mono text-slate-500">
                            {overdueLog.lastLog.date} {overdueLog.lastLog.time}
                          </span>
                        </div>
                      )}

                      <div className="mt-2.5 flex items-center justify-end">
                        <button
                          onClick={() => {
                            setQuickLogResident(resident);
                            setQuickLogSummary(`Verlaufskontrolle & Vitalwerte (${new Date().toLocaleDateString()})`);
                            setIsQuickLogModalOpen(true);
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pflegejournal jetzt erfassen</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Warning 2: Medication Administration Deadlines */}
                  {medDeadlines.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-emerald-600" />
                          Medikamenten-Fristen ({medDeadlines.length} Verabreichungen offen)
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {medDeadlines.map(item => {
                          const badge = getShiftBadge(item.shift);
                          return (
                            <div
                              key={item.id}
                              className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                                item.isOverdue
                                  ? 'bg-red-50/70 border-red-200 text-red-950'
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-slate-900">
                                    {item.medication.name}
                                  </span>
                                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-300 font-bold text-slate-700">
                                    {item.medication.dosage}
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${badge.bg}`}>
                                    {badge.label}
                                  </span>
                                  {item.isOverdue && (
                                    <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                                      Frist abgelaufen
                                    </span>
                                  )}
                                </div>
                                {item.medication.instructions && (
                                  <p className="text-[11px] text-slate-500 mt-0.5 italic">
                                    Hinweis: {item.medication.instructions}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <button
                                  onClick={() => handleMarkMedAdministered(
                                    item.medication.id, 
                                    item.shift, 
                                    `${resident.firstName} ${resident.lastName}`,
                                    item.medication.name
                                  )}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs transition-all whitespace-nowrap"
                                  title="Als verabreicht quittieren und signieren"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Verabreicht</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Quick Links */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Betreuung: {resident.careCategory === 'dementia' ? 'Demenztrakt' : resident.careCategory === 'rehab' ? 'Rehabilitation' : 'Geriatrie'}
                  </span>
                  <button
                    onClick={() => onSelectResident(resident)}
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Vollständige Akte</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Care Log Entry Modal */}
      {isQuickLogModalOpen && quickLogResident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-base">
                    Pflegeeintrag erfassen
                  </h4>
                  <p className="text-xs text-slate-500">
                    {quickLogResident.firstName} {quickLogResident.lastName} • Zimmer {quickLogResident.roomNumber} (BESA {quickLogResident.besaLevel})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsQuickLogModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickLog} className="mt-4 space-y-4">
              {/* Category & Severity Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategorie
                  </label>
                  <select
                    value={quickLogCategory}
                    onChange={e => setQuickLogCategory(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-hidden"
                  >
                    <option value="medical">Medizinisch / Behandlungspflege</option>
                    <option value="vital">Vitalzeichenkontrolle</option>
                    <option value="hygiene">Grundpflege & Hygiene</option>
                    <option value="incident">Ereignis / Zwischenfall</option>
                    <option value="besa_review">BESA / RAI Verlaufsbericht</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dringlichkeitsstufe
                  </label>
                  <select
                    value={quickLogSeverity}
                    onChange={e => setQuickLogSeverity(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-hidden"
                  >
                    <option value="normal">🟢 Normal (Regulärer Verlauf)</option>
                    <option value="attention">🟡 Beobachtung (Attention)</option>
                    <option value="urgent">🔴 Dringend (Urgent)</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kurzbeschreibung (Zusammenfassung) *
                </label>
                <input
                  type="text"
                  required
                  value={quickLogSummary}
                  onChange={e => setQuickLogSummary(e.target.value)}
                  placeholder="z.B. Vitalwerte stabil, Mobilisation im Zimmer durchgeführt"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Klinische Details & Beobachtungen
                </label>
                <textarea
                  rows={3}
                  value={quickLogDetails}
                  onChange={e => setQuickLogDetails(e.target.value)}
                  placeholder="Detaillierte Angaben zu Wohlbefinden, Schmerzskala, Hautzustand oder Flüssigkeitsaufnahme..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Nurse Sign-off */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Pflegefachperson
                  </label>
                  <input
                    type="text"
                    value={quickLogStaffName}
                    onChange={e => setQuickLogStaffName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Funktion / Qualifikation
                  </label>
                  <input
                    type="text"
                    value={quickLogStaffRole}
                    onChange={e => setQuickLogStaffRole(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsQuickLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Eintrag speichern</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

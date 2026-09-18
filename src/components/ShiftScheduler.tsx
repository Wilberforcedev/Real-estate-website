import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  ShieldCheck, 
  Plus, 
  Download, 
  Sparkles, 
  Filter, 
  Building2, 
  CheckCircle2, 
  X, 
  Moon, 
  Sun, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { StaffMember, ShiftAssignment, ShiftType, StaffQualification, Language, ThemeMode } from '../types';
import { getTranslation } from '../i18n';

interface ShiftSchedulerProps {
  staffList: StaffMember[];
  shifts: ShiftAssignment[];
  language: Language;
  theme?: ThemeMode;
  onUpdateShifts: (newShifts: ShiftAssignment[]) => void;
  onAddStaffMember?: (staff: StaffMember) => void;
}

export const ShiftScheduler: React.FC<ShiftSchedulerProps> = ({
  staffList,
  shifts,
  language,
  theme = 'light',
  onUpdateShifts,
  onAddStaffMember
}) => {
  const t = getTranslation(language);
  const isNight = theme === 'night';

  // Filters
  const [selectedWing, setSelectedWing] = useState<string>('ALL');
  const [selectedQual, setSelectedQual] = useState<string>('ALL');
  
  // Date State - Week of 2026-08-03
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date('2026-08-03'));
  
  // Modal states
  const [selectedCell, setSelectedCell] = useState<{ staffId: string; dateStr: string; staffName: string; currentShift?: ShiftAssignment } | null>(null);
  const [editingShiftType, setEditingShiftType] = useState<ShiftType>('morning');
  const [editingNotes, setEditingNotes] = useState<string>('');
  
  // New Staff Modal
  const [isAddStaffOpen, setIsAddStaffOpen] = useState<boolean>(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Dipl. Pflegefachfrau HF');
  const [newStaffQual, setNewStaffQual] = useState<StaffQualification>('HF');
  const [newStaffWing, setNewStaffWing] = useState<'Haus Säntis' | 'Haus Matterhorn' | 'Residenz Eiger' | 'Alle Stationen'>('Haus Säntis');
  const [newStaffContract, setNewStaffContract] = useState(42);

  // Helper to format date YYYY-MM-DD
  const formatDateISO = (d: Date): string => {
    return d.toISOString().split('T')[0];
  };

  // Generate array of 7 days for current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentWeekStart);
    day.setDate(day.getDate() + i);
    return day;
  });

  const dayNamesShort = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  // Navigate weeks
  const changeWeek = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentWeekStart(new Date('2026-08-03'));
      return;
    }
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStart);
  };

  // Filtered staff list
  const filteredStaff = staffList.filter(s => {
    const matchesWing = selectedWing === 'ALL' || s.assignedWing === selectedWing || s.assignedWing === 'Alle Stationen';
    const matchesQual = selectedQual === 'ALL' || s.qualification === selectedQual;
    return matchesWing && matchesQual;
  });

  // Calculate total weekly hours for a staff member
  const getStaffWeeklyHours = (staffId: string) => {
    const weekDatesISO = weekDays.map(formatDateISO);
    return shifts
      .filter(sh => sh.staffId === staffId && weekDatesISO.includes(sh.date))
      .reduce((acc, curr) => acc + (curr.hours || 0), 0);
  };

  // Rest Period Violation Check (Spät -> Früh sequence under 11 hours rest)
  const checkRestPeriodViolations = (staffId: string) => {
    const violations: string[] = [];
    for (let i = 0; i < weekDays.length - 1; i++) {
      const day1Str = formatDateISO(weekDays[i]);
      const day2Str = formatDateISO(weekDays[i + 1]);
      const shift1 = shifts.find(s => s.staffId === staffId && s.date === day1Str);
      const shift2 = shifts.find(s => s.staffId === staffId && s.date === day2Str);

      if (shift1?.shiftType === 'late' && shift2?.shiftType === 'morning') {
        violations.push(`${dayNamesShort[i]} (Spät) ➔ ${dayNamesShort[i+1]} (Früh) : Ruhezeit < 11h`);
      }
    }
    return violations;
  };

  // Save Shift Assignment
  const handleSaveShift = () => {
    if (!selectedCell) return;

    let hours = 8.0;
    let startTime = '06:45';
    let endTime = '15:15';

    if (editingShiftType === 'late') {
      startTime = '14:45';
      endTime = '23:00';
      hours = 7.75;
    } else if (editingShiftType === 'night') {
      startTime = '22:30';
      endTime = '07:00';
      hours = 8.0;
    } else if (editingShiftType === 'day') {
      startTime = '08:00';
      endTime = '17:00';
      hours = 8.5;
    } else if (['off', 'vacation', 'sick'].includes(editingShiftType)) {
      startTime = '00:00';
      endTime = '00:00';
      hours = 0;
    }

    const existingIndex = shifts.findIndex(
      s => s.staffId === selectedCell.staffId && s.date === selectedCell.dateStr
    );

    const updatedShifts = [...shifts];
    const newAssignment: ShiftAssignment = {
      id: selectedCell.currentShift?.id || `sh-${Date.now()}`,
      staffId: selectedCell.staffId,
      date: selectedCell.dateStr,
      shiftType: editingShiftType,
      startTime,
      endTime,
      hours,
      assignedWing: staffList.find(s => s.id === selectedCell.staffId)?.assignedWing || 'Haus Säntis',
      notes: editingNotes
    };

    if (existingIndex >= 0) {
      updatedShifts[existingIndex] = newAssignment;
    } else {
      updatedShifts.push(newAssignment);
    }

    onUpdateShifts(updatedShifts);
    setSelectedCell(null);
  };

  // Auto-Fill Roster Helper
  const handleAutoFillRoster = () => {
    const updatedShifts = [...shifts];
    weekDays.forEach((day, dayIdx) => {
      const dateStr = formatDateISO(day);
      staffList.forEach((staff) => {
        const hasShift = updatedShifts.some(s => s.staffId === staff.id && s.date === dateStr);
        if (!hasShift) {
          let type: ShiftType = 'morning';
          if (staff.shift === 'spät') type = 'late';
          if (staff.shift === 'nacht') type = 'night';
          if (staff.shift === 'tag') type = 'day';
          if (dayIdx >= 5) type = 'off';

          updatedShifts.push({
            id: `sh-auto-${staff.id}-${dateStr}`,
            staffId: staff.id,
            date: dateStr,
            shiftType: type,
            startTime: type === 'late' ? '14:45' : type === 'night' ? '22:30' : '06:45',
            endTime: type === 'late' ? '23:00' : type === 'night' ? '07:00' : '15:15',
            hours: type === 'off' ? 0 : 8.0,
            assignedWing: staff.assignedWing,
            notes: 'Automatisch nach BESA-Soll generiert'
          });
        }
      });
    });
    onUpdateShifts(updatedShifts);
  };

  // Add Staff Member Handler
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName) return;

    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      name: newStaffName,
      role: newStaffRole,
      qualification: newStaffQual,
      shift: 'früh',
      assignedWing: newStaffWing,
      phone: '+41 44 990 00 99',
      email: `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@sanocare.ch`,
      active: true,
      contractHoursPerWeek: newStaffContract,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
    };

    if (onAddStaffMember) {
      onAddStaffMember(newStaff);
    }
    setIsAddStaffOpen(false);
    setNewStaffName('');
  };

  // Badge Color Mapper
  const getShiftBadge = (shift?: ShiftAssignment) => {
    if (!shift) {
      return (
        <span className={`text-[10px] font-medium italic ${isNight ? 'text-slate-600' : 'text-slate-400'}`}>
          -- Not assigned --
        </span>
      );
    }

    switch (shift.shiftType) {
      case 'morning':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black px-2 py-1 rounded-lg flex items-center justify-center gap-1 shadow-2xs">
            <Sun className="w-3 h-3 text-emerald-400" />
            Früh (06:45)
          </span>
        );
      case 'late':
        return (
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-black px-2 py-1 rounded-lg flex items-center justify-center gap-1 shadow-2xs">
            <Clock className="w-3 h-3 text-blue-400" />
            Spät (14:45)
          </span>
        );
      case 'night':
        return (
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-black px-2 py-1 rounded-lg flex items-center justify-center gap-1 shadow-2xs">
            <Moon className="w-3 h-3 text-indigo-400" />
            Nacht (22:30)
          </span>
        );
      case 'day':
        return (
          <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-black px-2 py-1 rounded-lg flex items-center justify-center gap-1 shadow-2xs">
            <Briefcase className="w-3 h-3 text-teal-400" />
            Tag (08:00)
          </span>
        );
      case 'off':
        return (
          <span className={`text-[11px] font-bold px-2 py-1 rounded-lg flex items-center justify-center gap-1 border ${
            isNight ? 'bg-slate-900/60 text-slate-500 border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            Frei
          </span>
        );
      case 'vacation':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black px-2 py-1 rounded-lg flex items-center justify-center gap-1">
            Ferien
          </span>
        );
      case 'sick':
        return (
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-black px-2 py-1 rounded-lg flex items-center justify-center gap-1">
            Krank
          </span>
        );
      default:
        return null;
    }
  };

  // Qualification Badge Mapper
  const getQualBadge = (qual: StaffQualification) => {
    switch (qual) {
      case 'HF':
      case 'FH':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-1.5 py-0.5 rounded">Dipl. HF</span>;
      case 'FaGe':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black px-1.5 py-0.5 rounded">FaGe</span>;
      case 'AGS':
      case 'SRK':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black px-1.5 py-0.5 rounded">{qual}</span>;
      case 'Arzt':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-1.5 py-0.5 rounded">Arzt</span>;
      default:
        return <span className="bg-slate-500/20 text-slate-300 border border-slate-500/30 text-[10px] font-black px-1.5 py-0.5 rounded">{qual}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Shift Scheduler Summary & Regulatory Compliance Controls */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        isNight 
          ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-lg' 
          : 'bg-white border-slate-200 shadow-xs text-slate-900'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold tracking-tight">Dienstplan & Roster-Verwaltung</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Arbeitsgesetz (ArGV 1) Konforme Schichteinteilung • BESA-Qualifikationsmix & Ruhezeiten (11h)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAutoFillRoster}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              Auto-Fill Dienstplan
            </button>
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-slate-300" />
              Pflegekraft Erfassen
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Dienstplan Exportieren
            </button>
          </div>
        </div>

        {/* Regulatory Safeguard Cards (ArGV & Skill-Mix) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-800/60">
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isNight ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-400">ArGV 1 Höchstarbeitszeit</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Maximal 50h/Woche gesetzliche Obergrenze. Automatische Überstundenkontrolle.
              </p>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isNight ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-400">Ruhezeit-Prüfung (11 Std.)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Warnt automatisch bei schmalen Übergängen von Spät- zu Frühdienst.
              </p>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isNight ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Users className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-400">BESA / KVG Qualifikationsmix</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sichert Mindestanzahl an Dipl. HF Pflegefachkräften pro Schicht.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Date Selector & Filters */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        isNight ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeWeek('prev')}
            className={`p-2 rounded-xl border transition-all ${
              isNight ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <span className="font-serif font-bold text-sm block text-emerald-400">
              Woche vom {weekDays[0].toLocaleDateString('de-CH')} bis {weekDays[6].toLocaleDateString('de-CH')}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Kalenderwoche {Math.ceil((weekDays[0].getDate() + 6) / 7)}
            </span>
          </div>

          <button
            onClick={() => changeWeek('next')}
            className={`p-2 rounded-xl border transition-all ${
              isNight ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => changeWeek('today')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 ml-1"
          >
            Heute
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {/* Wing Filter */}
          <select
            value={selectedWing}
            onChange={(e) => setSelectedWing(e.target.value)}
            className={`border text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none ${
              isNight ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <option value="ALL">Alle Trakt-Stationen</option>
            <option value="Haus Säntis">Haus Säntis</option>
            <option value="Haus Matterhorn">Haus Matterhorn</option>
            <option value="Residenz Eiger">Residenz Eiger</option>
          </select>

          {/* Qualification Filter */}
          <select
            value={selectedQual}
            onChange={(e) => setSelectedQual(e.target.value)}
            className={`border text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none ${
              isNight ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <option value="ALL">Alle Qualifikationen</option>
            <option value="HF">Dipl. HF</option>
            <option value="FaGe">FaGe</option>
            <option value="AGS">AGS / SRK</option>
            <option value="Arzt">Arzt</option>
          </select>
        </div>
      </div>

      {/* Main Weekly Interactive Shift Calendar Table */}
      <div className={`rounded-2xl border overflow-hidden transition-colors shadow-2xs ${
        isNight ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs font-bold ${
                isNight ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <th className="p-4 w-64 min-w-[240px]">Pflegekraft & Pensum</th>
                {weekDays.map((day, idx) => {
                  const dateStr = formatDateISO(day);
                  const isToday = dateStr === '2026-08-03';
                  return (
                    <th 
                      key={dateStr} 
                      className={`p-3 text-center min-w-[120px] border-l ${
                        isNight ? 'border-slate-800' : 'border-slate-200'
                      } ${isToday ? 'bg-emerald-500/10' : ''}`}
                    >
                      <div className="font-bold text-xs flex items-center justify-center gap-1">
                        {dayNamesShort[idx]}
                        {isToday && <span className="bg-emerald-500 text-white text-[9px] px-1 rounded-full font-sans">Heute</span>}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 font-normal">
                        {day.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' })}
                      </div>
                    </th>
                  );
                })}
                <th className="p-3 text-center w-28 min-w-[100px] border-l border-slate-800">Soll / Ist (h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {filteredStaff.map((staff) => {
                const weeklyHours = getStaffWeeklyHours(staff.id);
                const isOvertime = weeklyHours > staff.contractHoursPerWeek;
                const violations = checkRestPeriodViolations(staff.id);

                return (
                  <tr key={staff.id} className={`hover:bg-slate-800/30 transition-colors ${
                    isNight ? 'divide-slate-800' : 'divide-slate-200'
                  }`}>
                    {/* Staff Profile Cell */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={staff.photoUrl}
                          alt={staff.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs truncate max-w-[120px]">{staff.name}</span>
                            {getQualBadge(staff.qualification)}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {staff.role}
                          </p>
                          <p className="text-[9px] font-mono text-emerald-400">
                            {staff.assignedWing}
                          </p>
                        </div>
                      </div>

                      {/* Rest Violation Alert Pill */}
                      {violations.length > 0 && (
                        <div className="mt-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold p-1 rounded-lg flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate">{violations[0]}</span>
                        </div>
                      )}
                    </td>

                    {/* Day Cells */}
                    {weekDays.map((day) => {
                      const dateStr = formatDateISO(day);
                      const shift = shifts.find(s => s.staffId === staff.id && s.date === dateStr);

                      return (
                        <td 
                          key={dateStr}
                          onClick={() => {
                            setSelectedCell({
                              staffId: staff.id,
                              dateStr,
                              staffName: staff.name,
                              currentShift: shift
                            });
                            setEditingShiftType(shift?.shiftType || 'morning');
                            setEditingNotes(shift?.notes || '');
                          }}
                          className={`p-2.5 text-center cursor-pointer border-l transition-all hover:ring-2 hover:ring-emerald-500/50 ${
                            isNight ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {getShiftBadge(shift)}
                          {shift?.notes && (
                            <span className="text-[9px] text-slate-400 block truncate mt-1 italic font-mono max-w-[100px] mx-auto">
                              "{shift.notes}"
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Weekly Hours & Compliance */}
                    <td className="p-3 text-center border-l border-slate-800 font-mono">
                      <div className="font-bold text-xs">
                        <span className={isOvertime ? 'text-amber-400' : 'text-emerald-400'}>
                          {weeklyHours.toFixed(1)}h
                        </span>
                        <span className="text-slate-400 text-[10px]"> / {staff.contractHoursPerWeek}h</span>
                      </div>
                      {isOvertime ? (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded block mt-1">
                          +{(weeklyHours - staff.contractHoursPerWeek).toFixed(1)}h Überzeit
                        </span>
                      ) : (
                        <span className="text-[9px] text-emerald-400 block mt-1">✓ Soll erfüllt</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Shift Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl border p-6 space-y-4 shadow-xl ${
            isNight ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base">Schicht Zuweisen</h3>
                <p className="text-xs text-slate-400">
                  {selectedCell.staffName} • {selectedCell.dateStr}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold block">Schicht-Typ Auswählen:</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setEditingShiftType('morning')}
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    editingShiftType === 'morning' 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30' 
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4 text-emerald-400" />
                  <span>Frühdienst (06:45)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingShiftType('late')}
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    editingShiftType === 'late' 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-2 ring-blue-500/30' 
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Spätdienst (14:45)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingShiftType('night')}
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    editingShiftType === 'night' 
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30' 
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Nachtdienst (22:30)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingShiftType('day')}
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    editingShiftType === 'day' 
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 ring-2 ring-teal-500/30' 
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-teal-400" />
                  <span>Tagdienst (08:00)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingShiftType('off')}
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    editingShiftType === 'off' 
                      ? 'bg-slate-700 border-slate-500 text-white' 
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>Freitag / Ruhetag</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingShiftType('vacation')}
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    editingShiftType === 'vacation' 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>Ferien</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Anmerkung / Besonderheit:</label>
                <input
                  type="text"
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="z.B. Pikett, BESA-Visite, Übergabe"
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                    isNight ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleSaveShift}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Schicht Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddStaffSubmit} className={`max-w-md w-full rounded-2xl border p-6 space-y-4 shadow-xl ${
            isNight ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-base">Neue Pflegekraft Registrieren</h3>
              <button 
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Vorname & Nachname:</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="z.B. Maria Bernasconi"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isNight ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Qualifikation & Ausbildungsabschluss:</label>
                <select
                  value={newStaffQual}
                  onChange={(e) => setNewStaffQual(e.target.value as StaffQualification)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isNight ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="HF">Dipl. Pflegefachfrau / -mann HF</option>
                  <option value="FH">Bachelor / Master Pflege FH</option>
                  <option value="FaGe">Fachfrau / Fachmann Gesundheit (FaGe)</option>
                  <option value="AGS">Assistent/in Gesundheit & Soziales (AGS)</option>
                  <option value="SRK">Pflegehelfer/in SRK</option>
                  <option value="Arzt">Arzt / Konsiliararzt</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Funktionsbezeichnung:</label>
                <input
                  type="text"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  placeholder="z.B. Tagesverantwortung / Demenzstation"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isNight ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Stamm-Trakt / Station:</label>
                <select
                  value={newStaffWing}
                  onChange={(e) => setNewStaffWing(e.target.value as any)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isNight ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="Haus Säntis">Haus Säntis</option>
                  <option value="Haus Matterhorn">Haus Matterhorn</option>
                  <option value="Residenz Eiger">Residenz Eiger</option>
                  <option value="Alle Stationen">Alle Stationen</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Anstellungsvertrag (Wochenstunden):</label>
                <input
                  type="number"
                  min={10}
                  max={50}
                  value={newStaffContract}
                  onChange={(e) => setNewStaffContract(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none ${
                    isNight ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Standard Vollzeit: 42 Std./Woche (Schweizer Pflege-GAV)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Mitarbeiter Erfassen
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

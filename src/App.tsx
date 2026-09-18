import React, { useState, useEffect } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { DashboardOverview } from './components/DashboardOverview';
import { ResidentDirectory } from './components/ResidentDirectory';
import { AdmissionsPipeline } from './components/AdmissionsPipeline';
import { RoomManagement } from './components/RoomManagement';
import { SwissBillingModule } from './components/SwissBillingModule';
import { ShiftScheduler } from './components/ShiftScheduler';
import { CareAiAssistantModal } from './components/CareAiAssistantModal';
import { AddResidentModal } from './components/AddResidentModal';
import { AddLeadModal } from './components/AddLeadModal';

import { 
  Resident, 
  Room, 
  Lead, 
  CareLogEntry, 
  MedicationItem, 
  Invoice, 
  StaffMember,
  ShiftAssignment,
  Language, 
  SwissCanton, 
  LeadStatus,
  ThemeMode 
} from './types';

import { 
  INITIAL_RESIDENTS, 
  INITIAL_ROOMS, 
  INITIAL_LEADS, 
  INITIAL_CARE_LOGS, 
  INITIAL_MEDICATIONS, 
  INITIAL_INVOICES,
  INITIAL_STAFF,
  INITIAL_SHIFTS
} from './data/mockData';

import { CheckCircle2, AlertCircle, Moon, Sun, ShieldAlert, HeartPulse } from 'lucide-react';

export default function App() {
  // Global App States
  const [language, setLanguage] = useState<Language>('de');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('sanocare_theme');
      return (saved === 'night' || saved === 'light') ? saved : 'light';
    } catch {
      return 'light';
    }
  });
  const [selectedCanton, setSelectedCanton] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'residents' | 'leads' | 'rooms' | 'billing' | 'roster' | 'ai-assistant'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Persisted CRM Collections
  const [residents, setResidents] = useState<Resident[]>(() => {
    try {
      const saved = localStorage.getItem('sanocare_residents');
      return saved ? JSON.parse(saved) : INITIAL_RESIDENTS;
    } catch {
      return INITIAL_RESIDENTS;
    }
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('sanocare_rooms');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('sanocare_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [careLogs, setCareLogs] = useState<CareLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('sanocare_care_logs');
      return saved ? JSON.parse(saved) : INITIAL_CARE_LOGS;
    } catch {
      return INITIAL_CARE_LOGS;
    }
  });

  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    try {
      const saved = localStorage.getItem('sanocare_medications');
      return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
    } catch {
      return INITIAL_MEDICATIONS;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('sanocare_invoices');
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('sanocare_staff');
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [shifts, setShifts] = useState<ShiftAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('sanocare_shifts');
      return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
    } catch {
      return INITIAL_SHIFTS;
    }
  });

  // Modal Controls
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sanocare_residents', JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    localStorage.setItem('sanocare_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('sanocare_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('sanocare_care_logs', JSON.stringify(careLogs));
  }, [careLogs]);

  useEffect(() => {
    localStorage.setItem('sanocare_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('sanocare_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('sanocare_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('sanocare_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('sanocare_theme', theme);
    if (theme === 'night') {
      document.documentElement.classList.add('dark', 'night-mode');
    } else {
      document.documentElement.classList.remove('dark', 'night-mode');
    }
  }, [theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers
  const handleAddResident = (newResident: Resident) => {
    setResidents(prev => [newResident, ...prev]);
    
    // Also mark room occupied if applicable
    setRooms(prev => prev.map(r => r.number === newResident.roomNumber ? { ...r, status: 'occupied', residentId: newResident.id } : r));

    showToast(`Bewohner ${newResident.firstName} ${newResident.lastName} (Zimmer ${newResident.roomNumber}) erfolgreich erfasst! 🇨🇭`);
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
    showToast(`Neue Pflegeanfrage für ${newLead.prospectFirstName} ${newLead.prospectLastName} in Pipeline aufgenommen! 📋`);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, currentStatus: newStatus } : l));
    showToast(`Anfrage-Status auf Phase "${newStatus}" aktualisiert!`);
  };

  const handleConvertToResident = (lead: Lead) => {
    const convertedResident: Resident = {
      id: `res-${Date.now()}`,
      firstName: lead.prospectFirstName,
      lastName: lead.prospectLastName,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      birthDate: '1945-03-20',
      gender: 'female',
      ahvNumber: '756.8831.2001.99',
      canton: lead.targetCanton,
      besaLevel: lead.estimatedBesa,
      careCategory: 'somatics',
      status: 'active',
      roomNumber: '108',
      buildingWing: lead.targetWing,
      entryDate: new Date().toISOString().split('T')[0],
      insuranceCompany: 'Helsana KVG',
      insurancePolicyNo: 'POL-771122',
      primaryContact: {
        name: lead.contactName,
        relation: lead.relation,
        phone: lead.contactPhone,
        email: lead.contactEmail,
        isLegalGuardian: true
      },
      doctor: {
        name: 'Dr. med. Beat Keller',
        praxis: 'Bellevue Praxis',
        phone: '+41 44 251 10 20'
      },
      dietaryNeeds: ['Vollkost'],
      allergies: [],
      dailyCostCHF: 220,
      cantonalSubsidyEligible: true,
      notes: 'Anfrage erfolgreich in aktiven Bewohner umgewandelt.'
    };

    setResidents(prev => [convertedResident, ...prev]);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, currentStatus: 'admitted' } : l));
    setActiveTab('residents');
    showToast(`Anfrage ${lead.prospectFirstName} ${lead.prospectLastName} erfolgreich als aktiver Bewohner aufgenommen! 🎉`);
  };

  const handleAddCareLog = (log: Omit<CareLogEntry, 'id'>) => {
    const newLog: CareLogEntry = {
      id: `log-${Date.now()}`,
      ...log
    };
    setCareLogs(prev => [newLog, ...prev]);
    showToast('Pflegeeintrag im Journal gespeichert.');
  };

  const handleUpdateRoomStatus = (roomId: string, newStatus: Room['status']) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    showToast('Zimmer-Status aktualisiert.');
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status } : inv));
    showToast(`Rechnung ${invoiceId} Status geändert auf: ${status}`);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-300 ${
      theme === 'night' 
        ? 'bg-slate-950 text-slate-100 dark' 
        : 'bg-slate-100/80 text-slate-900'
    }`}>
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <HeaderNavbar
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
        selectedCantonFilter={selectedCanton}
        setSelectedCantonFilter={setSelectedCanton}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddResident={() => setIsAddResidentOpen(true)}
        onOpenAddLead={() => setIsAddLeadOpen(true)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
      />

      {/* Night Shift Operational Banner */}
      {theme === 'night' && (
        <div className="bg-slate-900/90 border-b border-amber-500/40 text-amber-200 px-4 py-2.5 text-xs font-medium shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <Moon className="w-4 h-4 text-amber-300 shrink-0 fill-amber-300/20" />
              <span className="font-bold text-amber-300">Nachtdienst-Modus Aktiv:</span>
              <span className="text-slate-300">Augen-schonender High Contrast für dunkle Pflegestationen (22:00 - 06:00). Anti-Glare Interface.</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] shrink-0">
              <span className="bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-emerald-400" />
                Nachtwache: 1 HF / 2 FaGe
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            residents={residents}
            rooms={rooms}
            leads={leads}
            careLogs={careLogs}
            medications={medications}
            language={language}
            theme={theme}
            onNavigateTab={setActiveTab}
            onSelectResident={(res) => {
              setSearchQuery(res.lastName);
              setActiveTab('residents');
            }}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
            onAddCareLog={handleAddCareLog}
          />
        )}

        {/* TAB 2: RESIDENTS DIRECTORY */}
        {activeTab === 'residents' && (
          <ResidentDirectory
            residents={residents}
            careLogs={careLogs}
            medications={medications}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCantonFilter={selectedCanton}
            language={language}
            theme={theme}
            onOpenAddResident={() => setIsAddResidentOpen(true)}
            onAddCareLog={handleAddCareLog}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
          />
        )}

        {/* TAB 3: ADMISSIONS PIPELINE (LEADS) */}
        {activeTab === 'leads' && (
          <AdmissionsPipeline
            leads={leads}
            language={language}
            theme={theme}
            onOpenAddLead={() => setIsAddLeadOpen(true)}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onConvertToResident={handleConvertToResident}
          />
        )}

        {/* TAB 4: ROOM MANAGEMENT */}
        {activeTab === 'rooms' && (
          <RoomManagement
            rooms={rooms}
            residents={residents}
            language={language}
            theme={theme}
            onUpdateRoomStatus={handleUpdateRoomStatus}
          />
        )}

        {/* TAB 5: BILLING & QR-RECHNUNG */}
        {activeTab === 'billing' && (
          <SwissBillingModule
            invoices={invoices}
            residents={residents}
            language={language}
            theme={theme}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
          />
        )}

        {/* TAB 6: SHIFT SCHEDULER & ROSTER */}
        {activeTab === 'roster' && (
          <ShiftScheduler
            staffList={staffList}
            shifts={shifts}
            language={language}
            theme={theme}
            onUpdateShifts={(newShifts) => {
              setShifts(newShifts);
              showToast('Dienstplan-Änderungen erfolgreich gespeichert! 📅');
            }}
            onAddStaffMember={(newStaff) => {
              setStaffList(prev => [...prev, newStaff]);
              showToast(`Pflegekraft ${newStaff.name} (${newStaff.qualification}) registriert! 👩‍⚕️`);
            }}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-serif font-bold text-slate-800">
            <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded font-black">🇨🇭</span>
            SanoCare Schweiz CRM • Alters- & Pflegeheim Software
          </div>
          <p className="text-[11px] text-slate-400">
            Konform mit KVG (KVB), BESA 5.0 / RAI-NH, CURAVIVA Standards & Schweizer DSG.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      <CareAiAssistantModal
        isOpen={isAiModalOpen || activeTab === 'ai-assistant'}
        onClose={() => {
          setIsAiModalOpen(false);
          if (activeTab === 'ai-assistant') setActiveTab('dashboard');
        }}
        residents={residents}
        language={language}
      />

      <AddResidentModal
        isOpen={isAddResidentOpen}
        onClose={() => setIsAddResidentOpen(false)}
        onAddResident={handleAddResident}
        language={language}
      />

      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onAddLead={handleAddLead}
        language={language}
      />

    </div>
  );
}

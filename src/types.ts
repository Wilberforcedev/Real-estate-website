export type Language = 'de' | 'fr' | 'it' | 'en';

export type ThemeMode = 'light' | 'night';

export type BesaLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type LeadStatus = 'inquiry' | 'assessment' | 'waitlist' | 'trial' | 'admitted' | 'declined';

export type ResidentStatus = 'active' | 'temporary' | 'hospitalized' | 'discharged';

export type CareCategory = 'somatics' | 'dementia' | 'palliative' | 'rehab' | 'assisted_living';

export type SwissCanton = 'ZH' | 'BE' | 'LU' | 'UR' | 'SZ' | 'OW' | 'NW' | 'GL' | 'ZG' | 'FR' | 'SO' | 'BS' | 'BL' | 'SH' | 'AR' | 'AI' | 'SG' | 'GR' | 'AG' | 'TG' | 'TI' | 'VD' | 'VS' | 'NE' | 'GE' | 'JU';

export interface PrimaryContact {
  name: string;
  relation: string; // e.g., "Tochter", "Sohn", "Ehepartner", "Beistand"
  phone: string;
  email: string;
  isLegalGuardian: boolean;
  address?: string;
}

export interface DoctorInfo {
  name: string;
  praxis: string;
  phone: string;
  emergencyPhone?: string;
  specialty?: string;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'female' | 'male' | 'other';
  ahvNumber: string; // e.g. 756.1234.5678.90
  canton: SwissCanton;
  besaLevel: BesaLevel;
  careCategory: CareCategory;
  status: ResidentStatus;
  roomNumber: string;
  buildingWing: 'Haus Säntis' | 'Haus Matterhorn' | 'Residenz Eiger';
  entryDate: string;
  insuranceCompany: string; // e.g. Helsana, Swica, CSS, Sanitas
  insurancePolicyNo: string;
  primaryContact: PrimaryContact;
  doctor: DoctorInfo;
  dietaryNeeds: string[];
  allergies: string[];
  dailyCostCHF: number;
  cantonalSubsidyEligible: boolean; // Ergänzungsleistungen (EL)
  notes: string;
  vitals?: {
    bloodPressureSys: number;
    bloodPressureDia: number;
    pulse: number;
    weightKg: number;
    temperatureC: number;
    lastUpdated: string;
  };
}

export interface CareLogEntry {
  id: string;
  residentId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: 'medical' | 'vital' | 'incident' | 'activity' | 'hygiene' | 'besa_review';
  staffName: string;
  staffRole: string; // e.g. "Dipl. Pflegefachfrau HF", "FaGe", "Pflegehelfer SRK"
  summary: string;
  details?: string;
  severity: 'normal' | 'attention' | 'urgent';
}

export interface MedicationItem {
  id: string;
  residentId: string;
  name: string;
  dosage: string;
  schedule: {
    morning: boolean;
    noon: boolean;
    evening: boolean;
    night: boolean;
  };
  prescribedBy: string;
  instructions: string;
  active: boolean;
}

export interface Room {
  id: string;
  number: string;
  wing: 'Haus Säntis' | 'Haus Matterhorn' | 'Residenz Eiger';
  floor: number;
  type: 'single' | 'double' | 'suite' | 'dementia_care';
  pricePerDayCHF: number;
  status: 'occupied' | 'reserved' | 'cleaning' | 'available';
  residentId?: string;
  residentName?: string;
  features: string[];
  imageUrl?: string;
}

export interface Lead {
  id: string;
  prospectFirstName: string;
  prospectLastName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  relation: string;
  desiredEntryDate: string;
  targetCanton: SwissCanton;
  targetWing: 'Haus Säntis' | 'Haus Matterhorn' | 'Residenz Eiger';
  estimatedBesa: BesaLevel;
  currentStatus: LeadStatus;
  notes: string;
  assignedStaff: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  residentId: string;
  residentName: string;
  monthYear: string; // e.g. "2026-08"
  totalDays: number;
  roomBoardCostCHF: number;
  careCostCHF: number;
  besaLevel: BesaLevel;
  cantonalContributionCHF: number; // Kantonsbeitrag
  insuranceContributionCHF: number; // Krankenkassenbeitrag (KVG)
  outOfPocketCHF: number; // Eigenanteil Bewohner
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
}

export type StaffQualification = 'HF' | 'FH' | 'FaGe' | 'SRK' | 'AGS' | 'Arzt' | 'Admin';

export type ShiftType = 'morning' | 'late' | 'night' | 'day' | 'off' | 'vacation' | 'sick';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  qualification: StaffQualification;
  shift: 'früh' | 'spät' | 'nacht' | 'tag';
  assignedWing: 'Haus Säntis' | 'Haus Matterhorn' | 'Residenz Eiger' | 'Alle Stationen';
  phone: string;
  email: string;
  active: boolean;
  photoUrl?: string;
  contractHoursPerWeek: number; // e.g. 42, 33.6, 21
}

export interface ShiftAssignment {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  hours: number;
  assignedWing: 'Haus Säntis' | 'Haus Matterhorn' | 'Residenz Eiger' | 'Alle Stationen';
  notes?: string;
}

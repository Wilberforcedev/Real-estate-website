import { Resident, CareLogEntry, MedicationItem, Room, Lead, Invoice, StaffMember, ShiftAssignment } from '../types';

export const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'res-101',
    firstName: 'Hanspeter',
    lastName: 'Zürcher',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    birthDate: '1938-04-12',
    gender: 'male',
    ahvNumber: '756.3482.9102.14',
    canton: 'ZH',
    besaLevel: 6,
    careCategory: 'somatics',
    status: 'active',
    roomNumber: '104',
    buildingWing: 'Haus Säntis',
    entryDate: '2022-09-01',
    insuranceCompany: 'Helsana Versicherungen AG',
    insurancePolicyNo: 'HEL-8823910-ZH',
    primaryContact: {
      name: 'Dr. Markus Zürcher',
      relation: 'Sohn',
      phone: '+41 44 821 44 90',
      email: 'markus.zuercher@uzh.ch',
      isLegalGuardian: true,
      address: 'Seestrasse 112, 8002 Zürich'
    },
    doctor: {
      name: 'Dr. med. Beat Keller',
      praxis: 'Hausarztpraxis Bellevue',
      phone: '+41 44 251 10 20',
      emergencyPhone: '+41 79 402 11 22',
      specialty: 'Allgemeine Innere Medizin / Geriatrie'
    },
    dietaryNeeds: ['Schonkost', 'Kochsalzarm', 'Flüssigkeitskontrolle (max. 1.5L)'],
    allergies: ['Penicillin'],
    dailyCostCHF: 245.00,
    cantonalSubsidyEligible: true,
    notes: 'Bevorzugt Spaziergänge am Morgen im Demenzgarten. Sehr kooperativ bei Physiotherapie.',
    vitals: {
      bloodPressureSys: 128,
      bloodPressureDia: 82,
      pulse: 71,
      weightKg: 74.5,
      temperatureC: 36.7,
      lastUpdated: '2026-08-03 08:30'
    }
  },
  {
    id: 'res-102',
    firstName: 'Marie-Thérèse',
    lastName: 'Schneider-Favre',
    photoUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    birthDate: '1941-11-23',
    gender: 'female',
    ahvNumber: '756.8821.4019.55',
    canton: 'BE',
    besaLevel: 8,
    careCategory: 'dementia',
    status: 'active',
    roomNumber: '208',
    buildingWing: 'Haus Matterhorn',
    entryDate: '2023-01-15',
    insuranceCompany: 'Swica Gesundheitsorganisation',
    insurancePolicyNo: 'SWI-901823-BE',
    primaryContact: {
      name: 'Chantal Schneider',
      relation: 'Tochter',
      phone: '+41 31 312 09 88',
      email: 'c.schneider@kanton-bern.ch',
      isLegalGuardian: true,
      address: 'Kramgasse 44, 3011 Bern'
    },
    doctor: {
      name: 'Dr. med. Chantal Dupuis',
      praxis: 'Praxiszentrum Bern Nord',
      phone: '+41 31 330 20 00',
      emergencyPhone: '+41 78 910 22 33',
      specialty: 'Neurologie & Altersmedizin'
    },
    dietaryNeeds: ['Passierte Kost (Stufe 2)', 'Erhöhter Kalorienbedarf', 'Laktosefrei'],
    allergies: ['Nüsse', 'Sulfite'],
    dailyCostCHF: 310.00,
    cantonalSubsidyEligible: true,
    notes: 'Validierende Gesprächsführung bei Orientierungsstörungen. Spricht sowohl Deutsch als auch Französisch.',
    vitals: {
      bloodPressureSys: 134,
      bloodPressureDia: 86,
      pulse: 78,
      weightKg: 58.0,
      temperatureC: 36.6,
      lastUpdated: '2026-08-03 07:45'
    }
  },
  {
    id: 'res-103',
    firstName: 'Giuseppe',
    lastName: 'Rossi',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    birthDate: '1935-08-30',
    gender: 'male',
    ahvNumber: '756.1092.8374.01',
    canton: 'TI',
    besaLevel: 4,
    careCategory: 'assisted_living',
    status: 'active',
    roomNumber: '301',
    buildingWing: 'Residenz Eiger',
    entryDate: '2024-05-10',
    insuranceCompany: 'CSS Versicherung',
    insurancePolicyNo: 'CSS-441290-TI',
    primaryContact: {
      name: 'Elena Rossi-Bianchi',
      relation: 'Nichte',
      phone: '+41 91 922 70 11',
      email: 'elena.rossi@lugano.ch',
      isLegalGuardian: false,
      address: 'Via Nassa 14, 6900 Lugano'
    },
    doctor: {
      name: 'Dr. med. Marco Bernasconi',
      praxis: 'Centro Medico Lugano',
      phone: '+41 91 911 50 00',
      specialty: 'Allgemeinmedizin'
    },
    dietaryNeeds: ['Mediterrane Kost', 'Vollwert'],
    allergies: [],
    dailyCostCHF: 195.00,
    cantonalSubsidyEligible: false,
    notes: 'Sehr selbstständig im Alltag. Nimmt aktiv an den Nachmittagsaktivitäten (Boccia, Gesang) teil.',
    vitals: {
      bloodPressureSys: 122,
      bloodPressureDia: 78,
      pulse: 66,
      weightKg: 81.2,
      temperatureC: 36.5,
      lastUpdated: '2026-08-02 18:00'
    }
  },
  {
    id: 'res-104',
    firstName: 'Heidi',
    lastName: 'Amstad-Lustenberger',
    photoUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400',
    birthDate: '1944-02-17',
    gender: 'female',
    ahvNumber: '756.5512.9901.88',
    canton: 'LU',
    besaLevel: 10,
    careCategory: 'palliative',
    status: 'active',
    roomNumber: '112',
    buildingWing: 'Haus Säntis',
    entryDate: '2025-10-01',
    insuranceCompany: 'Visana Services AG',
    insurancePolicyNo: 'VIS-338291-LU',
    primaryContact: {
      name: 'Stefan Amstad',
      relation: 'Ehemann',
      phone: '+41 41 410 88 33',
      email: 's.amstad@bluewin.ch',
      isLegalGuardian: true,
      address: 'Pilatusstrasse 20, 6003 Luzern'
    },
    doctor: {
      name: 'Dr. med. Ursula Widmer',
      praxis: 'Palliata Praxis Luzern',
      phone: '+41 41 220 33 44',
      emergencyPhone: '+41 79 333 44 55',
      specialty: 'Palliative Care & Schmerztherapie'
    },
    dietaryNeeds: ['Feine Pürierkost', 'Andicken von Flüssigkeiten'],
    allergies: ['Morphin-Synthetika'],
    dailyCostCHF: 380.00,
    cantonalSubsidyEligible: true,
    notes: 'Erfordert 24h Palliative-Begleitung und regelmässige Lagerung nach Schema (Positionierung alle 2 Stunden).',
    vitals: {
      bloodPressureSys: 110,
      bloodPressureDia: 70,
      pulse: 82,
      weightKg: 51.5,
      temperatureC: 37.0,
      lastUpdated: '2026-08-03 06:15'
    }
  },
  {
    id: 'res-105',
    firstName: 'Gottfried',
    lastName: 'Keller-Stucki',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    birthDate: '1939-06-05',
    gender: 'male',
    ahvNumber: '756.9012.3384.72',
    canton: 'SG',
    besaLevel: 3,
    careCategory: 'rehab',
    status: 'temporary',
    roomNumber: '202',
    buildingWing: 'Residenz Eiger',
    entryDate: '2026-07-01',
    insuranceCompany: 'Sanitas Krankenversicherung',
    insurancePolicyNo: 'SAN-772819-SG',
    primaryContact: {
      name: 'Karin Keller',
      relation: 'Schwiegertochter',
      phone: '+41 71 222 90 10',
      email: 'karin.keller@sg.ch',
      isLegalGuardian: false
    },
    doctor: {
      name: 'Dr. med. Beat Keller',
      praxis: 'Hausarztpraxis Bellevue',
      phone: '+41 44 251 10 20',
      specialty: 'Orthopädie & Rehabilitation'
    },
    dietaryNeeds: ['Normal'],
    allergies: [],
    dailyCostCHF: 210.00,
    cantonalSubsidyEligible: false,
    notes: 'Kurzzeitaufenthalt nach Hüft-Totalendoprothese (TEP) rechts. Fortschritte im Gehtraining mit Gehbock.',
    vitals: {
      bloodPressureSys: 130,
      bloodPressureDia: 84,
      pulse: 68,
      weightKg: 79.0,
      temperatureC: 36.6,
      lastUpdated: '2026-08-02 14:20'
    }
  }
];

export const WING_PHOTOS = {
  'Haus Säntis': 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=800',
  'Haus Matterhorn': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
  'Residenz Eiger': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
};

export const INITIAL_ROOMS: Room[] = [
  { id: 'rm-101', number: '101', wing: 'Haus Säntis', floor: 1, type: 'single', pricePerDayCHF: 160, status: 'available', features: ['Balkon', 'Barrierefreies Bad', 'Pflegebett Electric', 'Notrufknopf'], imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600' },
  { id: 'rm-104', number: '104', wing: 'Haus Säntis', floor: 1, type: 'single', pricePerDayCHF: 165, status: 'occupied', residentId: 'res-101', residentName: 'Hanspeter Zürcher', features: ['Gartenblick', 'Notruf', 'Sauerstoffanschluss'], imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600' },
  { id: 'rm-112', number: '112', wing: 'Haus Säntis', floor: 1, type: 'dementia_care', pricePerDayCHF: 190, status: 'occupied', residentId: 'res-104', residentName: 'Heidi Amstad-Lustenberger', features: ['Demenz-Überwachung', 'Sensormatte', 'Niederflurbett'], imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600' },
  { id: 'rm-202', number: '202', wing: 'Residenz Eiger', floor: 2, type: 'single', pricePerDayCHF: 175, status: 'occupied', residentId: 'res-105', residentName: 'Gottfried Keller-Stucki', features: ['Seeblick', 'Reha-Ausstattung', 'TV/WLAN'], imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600' },
  { id: 'rm-208', number: '208', wing: 'Haus Matterhorn', floor: 2, type: 'dementia_care', pricePerDayCHF: 185, status: 'occupied', residentId: 'res-102', residentName: 'Marie-Thérèse Schneider-Favre', features: ['Beschützendes Zimmer', 'Lichttherapie', 'Sensormatte'], imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600' },
  { id: 'rm-301', number: '301', wing: 'Residenz Eiger', floor: 3, type: 'suite', pricePerDayCHF: 240, status: 'occupied', residentId: 'res-103', residentName: 'Giuseppe Rossi', features: ['Attika-Terrasse', 'Teeküche', 'Eigenes Wohnzimmer', 'Klima'], imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600' },
  { id: 'rm-305', number: '305', wing: 'Residenz Eiger', floor: 3, type: 'suite', pricePerDayCHF: 250, status: 'reserved', features: ['Panoramablick', 'Rollstuhlgängig', 'Klima'], imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600' },
  { id: 'rm-109', number: '109', wing: 'Haus Matterhorn', floor: 1, type: 'double', pricePerDayCHF: 140, status: 'cleaning', features: ['Verbindungstür', '2 Pflegebetten', 'Behindertengerecht'], imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=600' }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-301',
    prospectFirstName: 'Elisabeth',
    prospectLastName: 'Bovet',
    contactName: 'Jean-Claude Bovet',
    contactEmail: 'jc.bovet@bluewin.ch',
    contactPhone: '+41 21 801 12 34',
    relation: 'Sohn',
    desiredEntryDate: '2026-09-15',
    targetCanton: 'VD',
    targetWing: 'Haus Matterhorn',
    estimatedBesa: 5,
    currentStatus: 'assessment',
    notes: 'Anfrage für Pflegeplatz nach Spitalaustritt CHUV Lausanne. Besichtigung vereinbart am 10. August.',
    assignedStaff: 'Dipl. Pflegefachfrau S. Meier',
    createdAt: '2026-07-28'
  },
  {
    id: 'lead-302',
    prospectFirstName: 'Ernst',
    prospectLastName: 'Fankhauser',
    contactName: 'Brigitte Fankhauser',
    contactEmail: 'b.fankhauser@gmx.ch',
    contactPhone: '+41 31 721 00 99',
    relation: 'Ehefrau',
    desiredEntryDate: '2026-08-20',
    targetCanton: 'BE',
    targetWing: 'Haus Säntis',
    estimatedBesa: 7,
    currentStatus: 'waitlist',
    notes: 'Priorität 1 auf der Warteliste für Einzelzimmer im Haus Säntis. Arztbericht von Inselspital liegt vor.',
    assignedStaff: 'Verwaltung M. Steiner',
    createdAt: '2026-07-20'
  },
  {
    id: 'lead-303',
    prospectFirstName: 'Renate',
    prospectLastName: 'Bieri',
    contactName: 'Thomas Bieri',
    contactEmail: 't.bieri@swisscom.ch',
    contactPhone: '+41 79 444 88 11',
    relation: 'Sohn',
    desiredEntryDate: '2026-10-01',
    targetCanton: 'ZH',
    targetWing: 'Residenz Eiger',
    estimatedBesa: 2,
    currentStatus: 'inquiry',
    notes: 'Erste telefonische Kontaktaufnahme. Interesse an Betreutem Wohnen / Suite.',
    assignedStaff: 'Verwaltung M. Steiner',
    createdAt: '2026-08-01'
  }
];

export const INITIAL_CARE_LOGS: CareLogEntry[] = [
  {
    id: 'log-1',
    residentId: 'res-101',
    date: '2026-08-03',
    time: '08:15',
    category: 'vital',
    staffName: 'Regula Odermatt',
    staffRole: 'Dipl. Pflegefachfrau HF',
    summary: 'Morgen-Vitalzeichenkontrolle unauffällig.',
    details: 'Blutdruck 128/82 mmHg, Puls 71 SpM. Herr Zürcher fühlt sich gut und hat das Frühstück vollständig eingenommen.',
    severity: 'normal'
  },
  {
    id: 'log-2',
    residentId: 'res-102',
    date: '2026-08-03',
    time: '07:30',
    category: 'medical',
    staffName: 'Lukas Wenger',
    staffRole: 'Fachmann Gesundheit FaGe',
    summary: 'Medikamenteneinnahme Morgen mit Apfelmus.',
    details: 'Morgenmedikation gemäss Verordnung problemlos eingenommen. Hautzustand am Sakrum unauffällig.',
    severity: 'normal'
  },
  {
    id: 'log-3',
    residentId: 'res-104',
    date: '2026-08-03',
    time: '06:00',
    category: 'hygiene',
    staffName: 'Regula Odermatt',
    staffRole: 'Dipl. Pflegefachfrau HF',
    summary: 'Positionierung & Hautpflege Palliative Care.',
    details: 'Wechsel auf linke Seitenlagerung. Schmerzskala VAS 2 unter laufender Infusion. Atmung ruhig.',
    severity: 'attention'
  },
  {
    id: 'log-4',
    residentId: 'res-103',
    date: '2026-08-02',
    time: '16:30',
    category: 'activity',
    staffName: 'Sophie Favre',
    staffRole: 'Aktivierungstherapeutin SHV',
    summary: 'Teilnahme am Singkreis und Gedächtnistraining.',
    details: 'Herr Rossi hat engagiert Tessiner Volkslieder gesungen und alle Mitbewohner aufgeheitert.',
    severity: 'normal'
  }
];

export const INITIAL_MEDICATIONS: MedicationItem[] = [
  {
    id: 'med-1',
    residentId: 'res-101',
    name: 'Metoprolol Mepha 50mg',
    dosage: '1 Tabl.',
    schedule: { morning: true, noon: false, evening: true, night: false },
    prescribedBy: 'Dr. med. Beat Keller',
    instructions: 'Vor dem Essen mit Wasser einnehmen.',
    active: true
  },
  {
    id: 'med-2',
    residentId: 'res-101',
    name: 'Xarelto 15mg',
    dosage: '1 Tabl.',
    schedule: { morning: true, noon: false, evening: false, night: false },
    prescribedBy: 'Dr. med. Beat Keller',
    instructions: 'Zum Frühstück.',
    active: true
  },
  {
    id: 'med-3',
    residentId: 'res-102',
    name: 'Donepezil Mepha 10mg',
    dosage: '1 Tabl.',
    schedule: { morning: false, noon: false, evening: false, night: true },
    prescribedBy: 'Dr. med. Chantal Dupuis',
    instructions: 'Vor dem Schlafen mit Apfelmus.',
    active: true
  },
  {
    id: 'med-4',
    residentId: 'res-104',
    name: 'Targin 10/5mg Retard',
    dosage: '1 Tabl.',
    schedule: { morning: true, noon: false, evening: true, night: false },
    prescribedBy: 'Dr. med. Ursula Widmer',
    instructions: 'Streng alle 12 Stunden.',
    active: true
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-08-101',
    residentId: 'res-101',
    residentName: 'Hanspeter Zürcher',
    monthYear: '2026-08',
    totalDays: 31,
    roomBoardCostCHF: 5115.00, // 31 x 165
    careCostCHF: 2790.00,     // BESA 6 Care Share
    besaLevel: 6,
    cantonalContributionCHF: 1550.00, // Kantonsbeitrag ZH
    insuranceContributionCHF: 1860.00, // KVG Beitrag Helsana
    outOfPocketCHF: 4495.00,           // Restzahlung Bewohner/EL
    status: 'sent',
    dueDate: '2026-08-25'
  },
  {
    id: 'inv-2026-08-102',
    residentId: 'res-102',
    residentName: 'Marie-Thérèse Schneider-Favre',
    monthYear: '2026-08',
    totalDays: 31,
    roomBoardCostCHF: 5735.00,
    careCostCHF: 3875.00,     // BESA 8
    besaLevel: 8,
    cantonalContributionCHF: 2200.00,
    insuranceContributionCHF: 2480.00,
    outOfPocketCHF: 4930.00,
    status: 'draft',
    dueDate: '2026-08-30'
  },
  {
    id: 'inv-2026-08-103',
    residentId: 'res-103',
    residentName: 'Giuseppe Rossi',
    monthYear: '2026-08',
    totalDays: 31,
    roomBoardCostCHF: 7440.00, // Suite 240/day
    careCostCHF: 1240.00,     // BESA 4
    besaLevel: 4,
    cantonalContributionCHF: 620.00,
    insuranceContributionCHF: 1240.00,
    outOfPocketCHF: 6820.00,
    status: 'paid',
    dueDate: '2026-08-15'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'st-1', name: 'Sr. Regula Odermatt', role: 'Pflegedienstleitung (PDL)', qualification: 'HF', shift: 'tag', assignedWing: 'Alle Stationen', phone: '+41 44 990 00 11', email: 'r.odermatt@sanocare.ch', active: true, contractHoursPerWeek: 42, photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-2', name: 'Lukas Wenger', role: 'Dipl. Pflegefachmann HF', qualification: 'HF', shift: 'früh', assignedWing: 'Haus Säntis', phone: '+41 44 990 00 12', email: 'l.wenger@sanocare.ch', active: true, contractHoursPerWeek: 42, photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-3', name: 'Sophie Favre', role: 'Fachfrau Gesundheit (FaGe)', qualification: 'FaGe', shift: 'spät', assignedWing: 'Haus Säntis', phone: '+41 44 990 00 15', email: 's.favre@sanocare.ch', active: true, contractHoursPerWeek: 33.6, photoUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78347?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-4', name: 'Marco Bernasconi', role: 'Dipl. Pflegefachmann HF (Nachtwache)', qualification: 'HF', shift: 'nacht', assignedWing: 'Haus Matterhorn', phone: '+41 44 990 00 18', email: 'm.bernasconi@sanocare.ch', active: true, contractHoursPerWeek: 42, photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-5', name: 'Fatma Yilmaz', role: 'Assistentin Gesundheit (AGS)', qualification: 'AGS', shift: 'früh', assignedWing: 'Haus Matterhorn', phone: '+41 44 990 00 19', email: 'f.yilmaz@sanocare.ch', active: true, contractHoursPerWeek: 33.6, photoUrl: 'https://images.unsplash.com/photo-1580281657557-2b69d3ff08b1?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-6', name: 'Klaus Hintermann', role: 'Pflegehelfer SRK', qualification: 'SRK', shift: 'spät', assignedWing: 'Residenz Eiger', phone: '+41 44 990 00 20', email: 'k.hintermann@sanocare.ch', active: true, contractHoursPerWeek: 21, photoUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-7', name: 'Beatrix Brunner', role: 'Dipl. Pflegefachfrau HF', qualification: 'HF', shift: 'früh', assignedWing: 'Residenz Eiger', phone: '+41 44 990 00 21', email: 'b.brunner@sanocare.ch', active: true, contractHoursPerWeek: 42, photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200' },
  { id: 'st-8', name: 'Dr. med. Reto Camenzind', role: 'Heimarzt / Konsiliararzt', qualification: 'Arzt', shift: 'tag', assignedWing: 'Alle Stationen', phone: '+41 44 990 00 22', email: 'r.camenzind@sanocare.ch', active: true, contractHoursPerWeek: 20, photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' }
];

export const INITIAL_SHIFTS: ShiftAssignment[] = [
  // Monday 2026-08-03
  { id: 'sh-101', staffId: 'st-1', date: '2026-08-03', shiftType: 'day', startTime: '08:00', endTime: '17:00', hours: 8.5, assignedWing: 'Alle Stationen', notes: 'PDL Visite & KVG Audit' },
  { id: 'sh-102', staffId: 'st-2', date: '2026-08-03', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Säntis' },
  { id: 'sh-103', staffId: 'st-3', date: '2026-08-03', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Haus Säntis' },
  { id: 'sh-104', staffId: 'st-4', date: '2026-08-03', shiftType: 'night', startTime: '22:30', endTime: '07:00', hours: 8.0, assignedWing: 'Haus Matterhorn', notes: 'Nachtwache HF' },
  { id: 'sh-105', staffId: 'st-5', date: '2026-08-03', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-106', staffId: 'st-6', date: '2026-08-03', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Residenz Eiger' },
  { id: 'sh-107', staffId: 'st-7', date: '2026-08-03', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Residenz Eiger' },

  // Tuesday 2026-08-04
  { id: 'sh-201', staffId: 'st-1', date: '2026-08-04', shiftType: 'day', startTime: '08:00', endTime: '17:00', hours: 8.5, assignedWing: 'Alle Stationen' },
  { id: 'sh-202', staffId: 'st-2', date: '2026-08-04', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Säntis' },
  { id: 'sh-203', staffId: 'st-3', date: '2026-08-04', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Haus Säntis' },
  { id: 'sh-204', staffId: 'st-4', date: '2026-08-04', shiftType: 'night', startTime: '22:30', endTime: '07:00', hours: 8.0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-205', staffId: 'st-5', date: '2026-08-04', shiftType: 'off', startTime: '00:00', endTime: '00:00', hours: 0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-206', staffId: 'st-6', date: '2026-08-04', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Residenz Eiger' },
  { id: 'sh-207', staffId: 'st-7', date: '2026-08-04', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Residenz Eiger' },

  // Wednesday 2026-08-05
  { id: 'sh-301', staffId: 'st-1', date: '2026-08-05', shiftType: 'day', startTime: '08:00', endTime: '17:00', hours: 8.5, assignedWing: 'Alle Stationen' },
  { id: 'sh-302', staffId: 'st-2', date: '2026-08-05', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Säntis' },
  { id: 'sh-303', staffId: 'st-3', date: '2026-08-05', shiftType: 'off', startTime: '00:00', endTime: '00:00', hours: 0, assignedWing: 'Haus Säntis' },
  { id: 'sh-304', staffId: 'st-4', date: '2026-08-05', shiftType: 'night', startTime: '22:30', endTime: '07:00', hours: 8.0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-305', staffId: 'st-5', date: '2026-08-05', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-306', staffId: 'st-6', date: '2026-08-05', shiftType: 'off', startTime: '00:00', endTime: '00:00', hours: 0, assignedWing: 'Residenz Eiger' },
  { id: 'sh-307', staffId: 'st-7', date: '2026-08-05', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Residenz Eiger' },

  // Thursday 2026-08-06
  { id: 'sh-401', staffId: 'st-1', date: '2026-08-06', shiftType: 'day', startTime: '08:00', endTime: '17:00', hours: 8.5, assignedWing: 'Alle Stationen' },
  { id: 'sh-402', staffId: 'st-2', date: '2026-08-06', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Haus Säntis' },
  { id: 'sh-403', staffId: 'st-3', date: '2026-08-06', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Säntis' },
  { id: 'sh-404', staffId: 'st-4', date: '2026-08-06', shiftType: 'off', startTime: '00:00', endTime: '00:00', hours: 0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-405', staffId: 'st-5', date: '2026-08-06', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-406', staffId: 'st-6', date: '2026-08-06', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Residenz Eiger' },
  { id: 'sh-407', staffId: 'st-7', date: '2026-08-06', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Residenz Eiger' },

  // Friday 2026-08-07
  { id: 'sh-501', staffId: 'st-1', date: '2026-08-07', shiftType: 'day', startTime: '08:00', endTime: '17:00', hours: 8.5, assignedWing: 'Alle Stationen' },
  { id: 'sh-502', staffId: 'st-2', date: '2026-08-07', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Säntis' },
  { id: 'sh-503', staffId: 'st-3', date: '2026-08-07', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Säntis' },
  { id: 'sh-504', staffId: 'st-4', date: '2026-08-07', shiftType: 'night', startTime: '22:30', endTime: '07:00', hours: 8.0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-505', staffId: 'st-5', date: '2026-08-07', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-506', staffId: 'st-6', date: '2026-08-07', shiftType: 'off', startTime: '00:00', endTime: '00:00', hours: 0, assignedWing: 'Residenz Eiger' },
  { id: 'sh-507', staffId: 'st-7', date: '2026-08-07', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Residenz Eiger' },

  // Saturday 2026-08-08
  { id: 'sh-602', staffId: 'st-2', date: '2026-08-08', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Säntis' },
  { id: 'sh-603', staffId: 'st-3', date: '2026-08-08', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Haus Säntis' },
  { id: 'sh-604', staffId: 'st-4', date: '2026-08-08', shiftType: 'night', startTime: '22:30', endTime: '07:00', hours: 8.0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-607', staffId: 'st-7', date: '2026-08-08', shiftType: 'off', startTime: '00:00', endTime: '00:00', hours: 0, assignedWing: 'Residenz Eiger' },

  // Sunday 2026-08-09
  { id: 'sh-702', staffId: 'st-2', date: '2026-08-09', shiftType: 'off', startTime: '00:00', endTime: '00:00', hours: 0, assignedWing: 'Haus Säntis' },
  { id: 'sh-703', staffId: 'st-3', date: '2026-08-09', shiftType: 'morning', startTime: '06:45', endTime: '15:15', hours: 8.0, assignedWing: 'Haus Säntis' },
  { id: 'sh-704', staffId: 'st-4', date: '2026-08-09', shiftType: 'night', startTime: '22:30', endTime: '07:00', hours: 8.0, assignedWing: 'Haus Matterhorn' },
  { id: 'sh-707', staffId: 'st-7', date: '2026-08-09', shiftType: 'late', startTime: '14:45', endTime: '23:00', hours: 7.75, assignedWing: 'Residenz Eiger' }
];

import React, { useState } from 'react';
import { UserPlus, X, ShieldCheck, Building2 } from 'lucide-react';
import { Resident, SwissCanton, BesaLevel, CareCategory, Language } from '../types';
import { getTranslation } from '../i18n';

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResident: (resident: Resident) => void;
  language?: Language;
}

export const AddResidentModal: React.FC<AddResidentModalProps> = ({
  isOpen,
  onClose,
  onAddResident,
  language = 'de'
}) => {
  const t = getTranslation(language as Language);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('1942-05-10');
  const [ahvNumber, setAhvNumber] = useState('756.9182.0019.44');
  const [canton, setCanton] = useState<SwissCanton>('ZH');
  const [besaLevel, setBesaLevel] = useState<BesaLevel>(5);
  const [careCategory, setCareCategory] = useState<CareCategory>('somatics');
  const [roomNumber, setRoomNumber] = useState('105');
  const [wing, setWing] = useState<'Haus Säntis' | 'Haus Matterhorn' | 'Residenz Eiger'>('Haus Säntis');
  const [insurance, setInsurance] = useState('Helsana');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [dailyCost, setDailyCost] = useState(230);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    const newRes: Resident = {
      id: `res-${Date.now()}`,
      firstName,
      lastName,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      birthDate,
      gender: 'female',
      ahvNumber,
      canton,
      besaLevel,
      careCategory,
      status: 'active',
      roomNumber,
      buildingWing: wing,
      entryDate: new Date().toISOString().split('T')[0],
      insuranceCompany: insurance,
      insurancePolicyNo: `POL-${Math.floor(Math.random() * 899999 + 100000)}`,
      primaryContact: {
        name: contactName || 'Angehörige/r',
        relation: 'Angehörige',
        phone: contactPhone || '+41 44 000 00 00',
        email: 'kontakt@familie.ch',
        isLegalGuardian: true
      },
      doctor: {
        name: 'Dr. med. Beat Keller',
        praxis: 'Hausarztpraxis Bellevue',
        phone: '+41 44 251 10 20'
      },
      dietaryNeeds: ['Schonkost'],
      allergies: [],
      dailyCostCHF: dailyCost,
      cantonalSubsidyEligible: true,
      notes: 'Neuerintritt erfasst im SanoCare CRM.'
    };

    onAddResident(newRes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif font-bold text-base text-white">Neuen Bewohner erfassen</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Vorname</label>
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nachname</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">AHV-Nummer (Schweiz)</label>
              <input type="text" value={ahvNumber} onChange={e => setAhvNumber(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl font-mono" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kanton</label>
              <select value={canton} onChange={e => setCanton(e.target.value as SwissCanton)} className="w-full bg-slate-50 border p-2 rounded-xl">
                {['ZH', 'BE', 'LU', 'SG', 'TI', 'VD', 'AG'].map(c => <option key={c} value={c}>Kt. {c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">BESA-Pflegestufe (1 - 12)</label>
              <select value={besaLevel} onChange={e => setBesaLevel(Number(e.target.value) as BesaLevel)} className="w-full bg-slate-50 border p-2 rounded-xl font-bold">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(l => <option key={l} value={l}>Stufe {l}</option>)}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Betreuungsbereich</label>
              <select value={careCategory} onChange={e => setCareCategory(e.target.value as CareCategory)} className="w-full bg-slate-50 border p-2 rounded-xl">
                <option value="somatics">Somatik & Pflege</option>
                <option value="dementia">Demenz-Betreuung</option>
                <option value="palliative">Palliative Care</option>
                <option value="rehab">Rehabilitation</option>
                <option value="assisted_living">Betreutes Wohnen</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Zimmer-Nummer</label>
              <input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Gebäude-Trakt</label>
              <select value={wing} onChange={e => setWing(e.target.value as any)} className="w-full bg-slate-50 border p-2 rounded-xl">
                <option value="Haus Säntis">Haus Säntis</option>
                <option value="Haus Matterhorn">Haus Matterhorn</option>
                <option value="Residenz Eiger">Residenz Eiger</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Bezugsperson Name</label>
              <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Z.B. Markus Zürcher" className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Telefon Bezugsperson</label>
              <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+41 79 123 45 67" className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-slate-600 font-bold">Abbrechen</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#5C6B4E] text-white font-bold shadow-2xs">Bewohner speichern</button>
          </div>

        </form>
      </div>
    </div>
  );
};

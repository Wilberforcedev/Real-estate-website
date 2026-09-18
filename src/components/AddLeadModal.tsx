import React, { useState } from 'react';
import { HeartHandshake, X } from 'lucide-react';
import { Lead, SwissCanton, BesaLevel, Language } from '../types';
import { getTranslation } from '../i18n';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
  language?: Language;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  language = 'de'
}) => {
  const t = getTranslation(language as Language);
  const [prospectFirstName, setProspectFirstName] = useState('');
  const [prospectLastName, setProspectLastName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [relation, setRelation] = useState('Tochter');
  const [desiredEntryDate, setDesiredEntryDate] = useState('2026-09-01');
  const [targetCanton, setTargetCanton] = useState<SwissCanton>('ZH');
  const [estimatedBesa, setEstimatedBesa] = useState<BesaLevel>(4);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectFirstName || !prospectLastName) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      prospectFirstName,
      prospectLastName,
      contactName: contactName || 'Angehörige/r',
      contactEmail: contactEmail || 'kontakt@anfrage.ch',
      contactPhone: contactPhone || '+41 44 999 88 77',
      relation,
      desiredEntryDate,
      targetCanton,
      targetWing: 'Haus Säntis',
      estimatedBesa,
      currentStatus: 'inquiry',
      notes,
      assignedStaff: 'Verwaltung M. Steiner',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-purple-400" />
            <h3 className="font-serif font-bold text-base text-white">Neue Pflege-Anfrage erfassen</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Interessent Vorname</label>
              <input type="text" required value={prospectFirstName} onChange={e => setProspectFirstName(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Interessent Nachname</label>
              <input type="text" required value={prospectLastName} onChange={e => setProspectLastName(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kontaktperson Name</label>
              <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Beziehung</label>
              <select value={relation} onChange={e => setRelation(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl">
                <option value="Tochter">Tochter</option>
                <option value="Sohn">Sohn</option>
                <option value="Ehepartner">Ehepartner</option>
                <option value="Beistand">Beistand / Spital-Sozialdienst</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Telefon Kontakt</label>
              <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+41 79 000 11 22" className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">E-Mail Kontakt</label>
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="kontakt@email.ch" className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Wunsch-Eintritt</label>
              <input type="date" value={desiredEntryDate} onChange={e => setDesiredEntryDate(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ziel-Kanton</label>
              <select value={targetCanton} onChange={e => setTargetCanton(e.target.value as SwissCanton)} className="w-full bg-slate-50 border p-2 rounded-xl">
                {['ZH', 'BE', 'LU', 'SG', 'TI', 'VD', 'AG'].map(c => <option key={c} value={c}>Kt. {c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Geschätzte BESA</label>
              <select value={estimatedBesa} onChange={e => setEstimatedBesa(Number(e.target.value) as BesaLevel)} className="w-full bg-slate-50 border p-2 rounded-xl font-bold">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(l => <option key={l} value={l}>Stufe {l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Bemerkung / Pflegebedarf Details</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Z.B.: Anfrage nach Spitalaufenthalt, Zimmer mit Balkon bevorzugt..." className="w-full bg-slate-50 border p-2 rounded-xl" />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-slate-600 font-bold">Abbrechen</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-2xs">Anfrage erfassen</button>
          </div>

        </form>
      </div>
    </div>
  );
};

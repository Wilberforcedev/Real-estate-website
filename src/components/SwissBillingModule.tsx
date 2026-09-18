import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Download, 
  Eye, 
  QrCode, 
  Building2, 
  Search,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { Invoice, Resident, Language, ThemeMode } from '../types';
import { getTranslation } from '../i18n';

interface SwissBillingModuleProps {
  invoices: Invoice[];
  residents: Resident[];
  language: Language;
  theme?: ThemeMode;
  onUpdateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
}

export const SwissBillingModule: React.FC<SwissBillingModuleProps> = ({
  invoices,
  residents,
  language,
  theme = 'light',
  onUpdateInvoiceStatus
}) => {
  const t = getTranslation(language);
  const isNight = theme === 'night';
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [billingSearch, setBillingSearch] = useState<string>('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchesSearch = inv.residentName.toLowerCase().includes(billingSearch.toLowerCase()) || inv.id.toLowerCase().includes(billingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full">{t.statusPaid}</span>;
      case 'sent':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full">{t.statusPending}</span>;
      case 'draft':
        return <span className="bg-slate-200 text-slate-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">{t.statusDraft}</span>;
      case 'overdue':
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full">{t.statusOverdue}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Schweizer KVG & Kantons-Abrechnung (QR-Rechnung)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatische Verteilung der Pflegekosten auf KVG-Krankenkasse, Kantons-Restfinanzierung (EL) & Bewohner-Eigenanteil
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Rechnung oder Bewohner..."
            value={billingSearch}
            onChange={(e) => setBillingSearch(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">Alle Status</option>
            <option value="draft">Entwurf</option>
            <option value="sent">Versandt</option>
            <option value="paid">Bezahlt</option>
            <option value="overdue">Überfällig</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-3.5">Rechnungs-ID / Monat</th>
              <th className="p-3.5">Bewohner / BESA</th>
              <th className="p-3.5 text-right">Pension/Hotellerie</th>
              <th className="p-3.5 text-right">KVG Krankenkasse</th>
              <th className="p-3.5 text-right">Kantonsbeitrag (EL)</th>
              <th className="p-3.5 text-right">Eigenanteil (CHF)</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">QR-Bill Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map(inv => {
              const resident = residents.find(r => r.id === inv.residentId);
              return (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {inv.id}
                    <span className="block text-[10px] text-slate-400 font-normal">Abrechnung {inv.monthYear} ({inv.totalDays} Tage)</span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900">
                    {inv.residentName}
                    <span className="inline-block ml-2 bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      BESA {inv.besaLevel}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-medium">CHF {inv.roomBoardCostCHF.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-mono text-blue-700 font-semibold">CHF {inv.insuranceContributionCHF.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-mono text-purple-700 font-semibold">CHF {inv.cantonalContributionCHF.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#5C6B4E]">CHF {inv.outOfPocketCHF.toFixed(2)}</td>
                  <td className="p-3.5">{getStatusBadge(inv.status)}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] px-3 py-1 rounded-xl inline-flex items-center gap-1 transition-all shadow-2xs"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>QR-Rechnung</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SWISS QR-BILL MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                  🇨🇭
                </div>
                <h3 className="font-serif font-bold text-base text-white">
                  Schweizer QR-Rechnung Vorschau ({selectedInvoice.id})
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Swiss QR Bill Content */}
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50">
              
              {/* Top Invoice Summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex justify-between border-b pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Residenz Alpina Schweiz AG</h4>
                    <p className="text-xs text-slate-500">Alters- und Pflegeheim • Höhestrasse 12, 8001 Zürich</p>
                    <p className="text-xs text-slate-500 font-mono">IBAN: CH93 0070 0110 0002 9102 3</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase">Abrechnungsmonat</span>
                    <p className="font-serif font-bold text-lg text-slate-900">{selectedInvoice.monthYear}</p>
                    <p className="text-xs text-slate-500">Fällig am: {selectedInvoice.dueDate}</p>
                  </div>
                </div>

                <div className="text-xs space-y-2 pt-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Pension & Betreuung (Hotellerie, {selectedInvoice.totalDays} Tage):</span>
                    <span className="font-mono">CHF {selectedInvoice.roomBoardCostCHF.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-blue-700">
                    <span>Auszahlung KVG Krankenkasse (BESA Stufe {selectedInvoice.besaLevel}):</span>
                    <span className="font-mono font-semibold">- CHF {selectedInvoice.insuranceContributionCHF.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-purple-700">
                    <span>Abzug Kantonsbeitrag / Ergänzungsleistungen (EL):</span>
                    <span className="font-mono font-semibold">- CHF {selectedInvoice.cantonalContributionCHF.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-[#5C6B4E]">
                    <span>Zahlbar durch Bewohner / Vertretung:</span>
                    <span className="font-mono">CHF {selectedInvoice.outOfPocketCHF.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Authentic Swiss QR-Bill Receipt Graphic mockup */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-4 font-mono text-xs space-y-3 relative overflow-hidden">
                <div className="border-b-2 border-dashed border-slate-900 pb-2 text-[10px] font-bold text-slate-500 flex justify-between">
                  <span>Zahlteil / Section paiement</span>
                  <span>Empfangsschein / Récépissé</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Konto / Zahlbar an</p>
                    <p className="font-bold text-slate-900">CH93 0070 0110 0002 9102 3</p>
                    <p className="text-slate-700">Residenz Alpina Schweiz AG<br/>8001 Zürich</p>

                    <p className="text-[10px] text-slate-500 uppercase font-bold pt-2">Zahlbar durch</p>
                    <p className="font-bold text-slate-900">{selectedInvoice.residentName}</p>
                  </div>

                  {/* QR Code graphic mockup */}
                  <div className="w-28 h-28 bg-slate-900 p-2 rounded-lg flex items-center justify-center relative shrink-0">
                    <QrCode className="w-20 h-20 text-white" />
                    <div className="absolute inset-0 m-auto w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white font-bold text-[10px] border border-white">
                      +
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-slate-900">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Währung / Monnaie</span>
                    <span className="font-bold text-sm">CHF</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Betrag / Montant</span>
                    <span className="font-bold text-base text-slate-900">{selectedInvoice.outOfPocketCHF.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateInvoiceStatus(selectedInvoice.id, 'paid')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                >
                  Als Bezahlt markieren
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Swiss QR-Bill PDF wird gedruckt...')}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Drucken / PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

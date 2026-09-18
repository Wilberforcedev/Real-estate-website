import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  UserCheck, 
  Phone, 
  Mail, 
  Calendar, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  UserPlus
} from 'lucide-react';
import { Lead, LeadStatus, SwissCanton, BesaLevel, Language, ThemeMode } from '../types';
import { getTranslation } from '../i18n';

interface AdmissionsPipelineProps {
  leads: Lead[];
  language: Language;
  theme?: ThemeMode;
  onOpenAddLead: () => void;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onConvertToResident: (lead: Lead) => void;
}

export const AdmissionsPipeline: React.FC<AdmissionsPipelineProps> = ({
  leads,
  language,
  theme = 'light',
  onOpenAddLead,
  onUpdateLeadStatus,
  onConvertToResident
}) => {
  const t = getTranslation(language);
  const isNight = theme === 'night';
  const [activeFilterCanton, setActiveFilterCanton] = useState<string>('ALL');

  const columns: { status: LeadStatus; title: string; color: string; badge: string }[] = [
    { status: 'inquiry', title: t.stageInquiry, color: 'border-blue-400 bg-blue-50/40', badge: 'bg-blue-100 text-blue-900' },
    { status: 'assessment', title: t.stageAssessment, color: 'border-purple-400 bg-purple-50/40', badge: 'bg-purple-100 text-purple-900' },
    { status: 'waitlist', title: t.stageApproval, color: 'border-amber-400 bg-amber-50/40', badge: 'bg-amber-100 text-amber-900' },
    { status: 'trial', title: t.stageRoomAssigned, color: 'border-teal-400 bg-teal-50/40', badge: 'bg-teal-100 text-teal-900' },
    { status: 'admitted', title: t.stageAdmitted, color: 'border-emerald-400 bg-emerald-50/40', badge: 'bg-emerald-100 text-emerald-900' }
  ];

  const filteredLeads = leads.filter(l => 
    activeFilterCanton === 'ALL' || l.targetCanton === activeFilterCanton
  );

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-purple-600" />
            {t.pipelineTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.tagline} • Swiss KVG & BESA Standards
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={onOpenAddLead}
            className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addLead}</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const colLeads = filteredLeads.filter(l => l.currentStatus === col.status);
          return (
            <div 
              key={col.status}
              className={`rounded-2xl border p-3.5 flex flex-col min-h-[420px] ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <h3 className="font-serif font-bold text-xs text-slate-900">{col.title}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${col.badge}`}>
                  {colLeads.length}
                </span>
              </div>

              {/* Lead Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colLeads.map(lead => (
                  <div
                    key={lead.id}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-[#5C6B4E] hover:shadow-xs transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">
                          {lead.prospectFirstName} {lead.prospectLastName}
                        </h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Ziel-Kanton: <strong>Kt. {lead.targetCanton}</strong>
                        </span>
                      </div>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded">
                        BESA ~{lead.estimatedBesa}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                      <p className="font-semibold text-slate-800">Kontakt: {lead.contactName} ({lead.relation})</p>
                      <p className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" /> {lead.contactPhone}
                      </p>
                      <p className="flex items-center gap-1 text-slate-500 truncate">
                        <Mail className="w-3 h-3 text-slate-400" /> {lead.contactEmail}
                      </p>
                    </div>

                    {lead.notes && (
                      <p className="text-[10px] text-slate-500 italic bg-amber-50/60 p-1.5 rounded border border-amber-100">
                        "{lead.notes}"
                      </p>
                    )}

                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Ab {lead.desiredEntryDate}
                      </span>
                      <span>{lead.assignedStaff}</span>
                    </div>

                    {/* Move Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                      {col.status !== 'admitted' ? (
                        <button
                          onClick={() => {
                            const nextStatus: { [key in LeadStatus]?: LeadStatus } = {
                              inquiry: 'assessment',
                              assessment: 'waitlist',
                              waitlist: 'trial',
                              trial: 'admitted'
                            };
                            if (nextStatus[lead.currentStatus]) {
                              onUpdateLeadStatus(lead.id, nextStatus[lead.currentStatus]!);
                            }
                          }}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                        >
                          <span>{t.moveNextStage}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onConvertToResident(lead)}
                          className="w-full bg-[#5C6B4E] hover:bg-[#4A573F] text-white text-[10px] font-bold py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-all shadow-2xs"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>{t.convertToResident}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                    Keine Einträge in dieser Phase
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

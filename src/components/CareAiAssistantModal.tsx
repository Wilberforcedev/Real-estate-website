import React, { useState } from 'react';
import { 
  Sparkles, 
  Stethoscope, 
  FileText, 
  Activity, 
  Globe, 
  Bot, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  X,
  HelpCircle
} from 'lucide-react';
import { Resident, Language } from '../types';
import { getTranslation } from '../i18n';

interface CareAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  residents: Resident[];
  language: Language;
}

export const CareAiAssistantModal: React.FC<CareAiAssistantModalProps> = ({
  isOpen,
  onClose,
  residents,
  language
}) => {
  const t = getTranslation(language);
  const [activeAiTab, setActiveAiTab] = useState<'report' | 'besa' | 'translate' | 'advisor'>('report');
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Form states for Report
  const [selectedResidentId, setSelectedResidentId] = useState(residents[0]?.id || '');
  const [reportNotes, setReportNotes] = useState('');
  const [reportCategory, setReportCategory] = useState('medical');

  // Form states for BESA
  const [besaMobility, setBesaMobility] = useState('Benötigt Rollator und Unterstützung beim Aufstehen');
  const [besaCognitive, setBesaCognitive] = useState('Leichte Orientierungsstörung zeitlich, erkennt Personal gut');
  const [besaHygiene, setBesaHygiene] = useState('Unterstützung bei Ganzkörperpflege und Ankleiden');
  const [besaNutrition, setBesaNutrition] = useState('Selbstständig bei Nahrungsaufnahme, Getränke andicken');

  // Form states for Translation
  const [transText, setTransText] = useState('Sehr geehrte Familie Schneider, der Gesundheitszustand von Frau Schneider hat sich stabilisiert.');
  const [targetLang, setTargetLang] = useState('fr');

  // Form states for Advisor Chat
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);

  if (!isOpen) return null;

  const currentResident = residents.find(r => r.id === selectedResidentId) || residents[0];

  const handleRunAi = async () => {
    setLoading(true);
    setAiOutput('');

    try {
      let payload: any = {};
      let type = '';

      if (activeAiTab === 'report') {
        type = 'generate_care_report';
        payload = {
          residentName: `${currentResident.firstName} ${currentResident.lastName}`,
          besaLevel: currentResident.besaLevel,
          notes: reportNotes || 'Morgen-Vitalzeichen stabil, Patient meldet schmerzfreie Schulter nach Physiotherapie.',
          category: reportCategory,
          staffName: 'Regula Odermatt',
          staffRole: 'Dipl. Pflegefachfrau HF'
        };
      } else if (activeAiTab === 'besa') {
        type = 'besa_assessment';
        payload = {
          residentName: `${currentResident.firstName} ${currentResident.lastName}`,
          age: 82,
          careCategory: currentResident.careCategory,
          mobilityCondition: besaMobility,
          cognitiveStatus: besaCognitive,
          hygieneSupport: besaHygiene,
          nutritionSupport: besaNutrition
        };
      } else if (activeAiTab === 'translate') {
        type = 'translate_swiss_languages';
        payload = {
          text: transText,
          targetLang: targetLang === 'fr' ? 'Français' : targetLang === 'it' ? 'Italiano' : targetLang === 'en' ? 'English' : 'Deutsch'
        };
      } else {
        type = 'advisor_chat';
        payload = {
          query: advisorQuery || 'Welche KVG-Kosten übernimmt die Krankenkasse bei BESA Stufe 6 im Kanton Zürich?',
          residentContext: currentResident
        };
      }

      const res = await fetch('/api/care-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload, language })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiOutput(data.result);
        if (activeAiTab === 'advisor') {
          setChatHistory(prev => [
            ...prev,
            { role: 'user', text: advisorQuery },
            { role: 'model', text: data.result }
          ]);
          setAdvisorQuery('');
        }
      } else {
        setAiOutput(`Fehler bei der KI-Generierung: ${data.error || 'Bitte versuchen Sie es erneut.'}`);
      }
    } catch (err: any) {
      setAiOutput('Netzwerkfehler bei der Verbindung zum Schweizer Pflege-KI Assistenten.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
              <Stethoscope className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">
                  Schweizer Pflege-KI Assistent
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300">
                KVB-Pflegeberichte, BESA-Stufen-Einschätzung & Schweizer Mehrsprachigkeit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Nav Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveAiTab('report')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeAiTab === 'report' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Pflegebericht Generator</span>
          </button>

          <button
            onClick={() => setActiveAiTab('besa')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeAiTab === 'besa' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-600" />
            <span>2. BESA KI-Rechner</span>
          </button>

          <button
            onClick={() => setActiveAiTab('translate')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeAiTab === 'translate' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>3. CH-Übersetzer</span>
          </button>

          <button
            onClick={() => setActiveAiTab('advisor')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeAiTab === 'advisor' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>4. KVG & Tarif Berater</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-slate-50/60">
          
          {/* TAB 1: REPORT GENERATOR */}
          {activeAiTab === 'report' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Bewohner auswählen:
                  </label>
                  <select
                    value={selectedResidentId}
                    onChange={(e) => setSelectedResidentId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  >
                    {residents.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.firstName} {r.lastName} (BESA {r.besaLevel} - Rm {r.roomNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pflege-Kategorie:
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  >
                    <option value="medical">Medizinischer Befund</option>
                    <option value="vital">Vitalzeichen & Wundpflege</option>
                    <option value="incident">Vorfall / Sturz</option>
                    <option value="activity">Aktivierung & Psyche</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Stichworte / Notizen der Pflegekraft:
                </label>
                <textarea
                  rows={3}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Z.B.: Ruhige Nacht, schmerzfrei nach Medikamente. Frühstück gut eingenommen, Gehtraining am Vormittag mit Physiotherapie..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C6B4E]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BESA CALCULATOR */}
          {activeAiTab === 'besa' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobilität & Transfer:</label>
                <input
                  type="text"
                  value={besaMobility}
                  onChange={(e) => setBesaMobility(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kognition & Demenz-Status:</label>
                <input
                  type="text"
                  value={besaCognitive}
                  onChange={(e) => setBesaCognitive(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Körperpflege & Kleidung:</label>
                <input
                  type="text"
                  value={besaHygiene}
                  onChange={(e) => setBesaHygiene(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 3: TRANSLATOR */}
          {activeAiTab === 'translate' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Zu übersetzender Text:</label>
                <textarea
                  rows={3}
                  value={transText}
                  onChange={(e) => setTransText(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Zielsprache:</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                >
                  <option value="fr">Français (Schweiz)</option>
                  <option value="it">Italiano (Schweiz)</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch (Schweiz)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 4: ADVISOR CHAT */}
          {activeAiTab === 'advisor' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block mb-1">Frage zu KVG, BESA oder Ergänzungsleistungen (EL):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={advisorQuery}
                  onChange={(e) => setAdvisorQuery(e.target.value)}
                  placeholder="Z.B.: Wie hoch ist die maximale Selbstbeteiligung bei BESA Stufe 8?"
                  className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleRunAi}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>KI analysiert Schweizer KVG Standards...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>KI-Analyse generieren</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result Output Display */}
          {aiOutput && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 relative animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Generierte KI-Ausgabe:
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Kopiert!' : 'Kopieren'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans max-h-[220px] overflow-y-auto">
                {aiOutput}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

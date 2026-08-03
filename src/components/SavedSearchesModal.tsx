import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Bell, 
  Trash2, 
  Check, 
  Mail, 
  Search, 
  Play, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { FilterState, SavedSearch } from '../types';

interface SavedSearchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedSearches: SavedSearch[];
  onSaveSearch: (name: string, email: string, enableAlerts: boolean, frequency: 'instant' | 'daily' | 'weekly') => void;
  onApplySearch: (filters: FilterState) => void;
  onDeleteSearch: (id: string) => void;
  onToggleAlerts: (id: string, enabled: boolean, frequency?: 'instant' | 'daily' | 'weekly') => void;
  currentFilters: FilterState;
}

export const SavedSearchesModal: React.FC<SavedSearchesModalProps> = ({
  isOpen,
  onClose,
  savedSearches,
  onSaveSearch,
  onApplySearch,
  onDeleteSearch,
  onToggleAlerts,
  currentFilters
}) => {
  const [searchName, setSearchName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState<'instant' | 'daily' | 'weekly'>('daily');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    const emailToUse = userEmail.trim() || 'user@example.com';
    onSaveSearch(searchName, emailToUse, enableAlerts, alertFrequency);
    
    setSearchName('');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Helper to build friendly text summary of filters
  const formatFilterSummary = (f: FilterState) => {
    const parts: string[] = [];
    if (f.searchQuery) parts.push(`"${f.searchQuery}"`);
    if (f.listingType !== 'all') parts.push(`For ${f.listingType.toUpperCase()}`);
    if (f.propertyTypes.length > 0) parts.push(f.propertyTypes.join(', '));
    if (f.minPrice > 0 || f.maxPrice < 10000000) {
      const min = f.minPrice > 0 ? `$${(f.minPrice/1000).toFixed(0)}k` : '$0';
      const max = f.maxPrice < 10000000 ? `$${(f.maxPrice/1000000).toFixed(1)}M` : 'No Max';
      parts.push(`${min} - ${max}`);
    }
    if (f.minBeds > 0) parts.push(`${f.minBeds}+ Beds`);
    if (f.minBaths > 0) parts.push(`${f.minBaths}+ Baths`);
    if (f.amenities.length > 0) parts.push(`${f.amenities.length} Amenities`);

    return parts.length > 0 ? parts.join(' • ') : 'All Properties (Default Filter)';
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3E3C38]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E8E6E1] overflow-hidden max-h-[90vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#3E3C38] text-white flex items-center justify-between border-b border-[#3E3C38] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8A9A5B]/20 border border-[#8A9A5B]/40 flex items-center justify-center text-[#8A9A5B]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Saved Searches & Email Alerts</h3>
              <p className="text-[11px] text-[#E8E6E1]/70">Receive automated alerts for new properties matching your custom criteria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#4A4844] hover:bg-[#5C5A55] text-[#E8E6E1] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* SAVE CURRENT SEARCH SECTION */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8E6E1] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8A9A5B]" />
                <h4 className="font-bold text-sm text-[#3E3C38]">Save Your Active Search Criteria</h4>
              </div>
              <span className="text-[10px] font-bold text-[#5C6B4E] bg-[#8A9A5B]/15 px-2.5 py-0.5 rounded-full border border-[#8A9A5B]/30">
                Active Filter Set
              </span>
            </div>

            {showSaveSuccess && (
              <div className="bg-[#8A9A5B]/15 border border-[#8A9A5B] p-3 rounded-xl text-xs font-bold text-[#5C6B4E] flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#5C6B4E]" />
                <span>Search saved successfully! Email alert configured.</span>
              </div>
            )}

            {/* Current Criteria Preview */}
            <div className="bg-[#F3F1ED] p-3 rounded-xl border border-[#E8E6E1] text-xs">
              <span className="font-bold text-[#8C8A85] block mb-0.5">CURRENT FILTERS:</span>
              <p className="font-semibold text-[#3E3C38]">{formatFilterSummary(currentFilters)}</p>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#3E3C38] block mb-1">Search Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco Luxury Condos"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#3E3C38] block mb-1">Notification Email</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                  />
                </div>
              </div>

              {/* Email Alert Config Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#E8E6E1]">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enable-email-alerts"
                    checked={enableAlerts}
                    onChange={(e) => setEnableAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#5C6B4E] rounded cursor-pointer"
                  />
                  <label htmlFor="enable-email-alerts" className="text-xs font-bold text-[#3E3C38] cursor-pointer flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#8A9A5B]" />
                    <span>Send me email alerts for new matching listings</span>
                  </label>
                </div>

                {enableAlerts && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[#8C8A85] font-medium">Frequency:</span>
                    <select
                      value={alertFrequency}
                      onChange={(e) => setAlertFrequency(e.target.value as any)}
                      className="bg-[#F3F1ED] border border-[#E8E6E1] rounded-lg px-2 py-1 text-xs font-semibold text-[#3E3C38] focus:outline-none focus:ring-1 focus:ring-[#8A9A5B]"
                    >
                      <option value="instant">Instant (Real-time)</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save Current Search & Set Alerts</span>
              </button>
            </form>
          </div>

          {/* LIST OF SAVED SEARCHES */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#3E3C38] flex items-center justify-between">
              <span>Your Saved Searches ({savedSearches.length})</span>
              {savedSearches.length > 0 && (
                <span className="text-xs font-sans text-[#8C8A85] font-normal">Click "Apply" to run search</span>
              )}
            </h4>

            {savedSearches.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E8E6E1] text-[#8C8A85] space-y-2">
                <Bookmark className="w-10 h-10 text-[#8C8A85] mx-auto opacity-40" />
                <p className="font-bold text-[#3E3C38] text-sm">No Saved Searches Yet</p>
                <p className="text-xs text-[#8C8A85]">
                  Use the form above to save your favorite property filter combinations and configure automated email alerts.
                </p>
              </div>
            ) : (
              savedSearches.map((ss) => (
                <div
                  key={ss.id}
                  className="bg-white rounded-2xl p-4 border border-[#E8E6E1] hover:border-[#8A9A5B] transition-all space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-[#3E3C38]">{ss.name}</h5>
                        {ss.emailAlertsEnabled && (
                          <span className="bg-[#8A9A5B]/15 text-[#5C6B4E] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#8A9A5B]/30 flex items-center gap-1">
                            <Bell className="w-3 h-3 text-[#5C6B4E]" />
                            <span>Alerts: {ss.alertFrequency}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8C8A85] mt-1 font-medium">{formatFilterSummary(ss.filters)}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onApplySearch(ss.filters);
                          onClose();
                        }}
                        className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Apply</span>
                      </button>

                      <button
                        onClick={() => onDeleteSearch(ss.id)}
                        className="p-1.5 text-[#8C8A85] hover:text-[#D98E73] hover:bg-[#D98E73]/10 rounded-xl transition-all"
                        title="Delete saved search"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Toggle Alert Row */}
                  <div className="pt-2.5 border-t border-[#E8E6E1] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleAlerts(ss.id, !ss.emailAlertsEnabled, ss.alertFrequency)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                          ss.emailAlertsEnabled
                            ? 'bg-[#8A9A5B]/15 border-[#8A9A5B] text-[#5C6B4E]'
                            : 'bg-[#F3F1ED] border-[#E8E6E1] text-[#8C8A85]'
                        }`}
                      >
                        <Bell className="w-3 h-3" />
                        <span>{ss.emailAlertsEnabled ? 'Alerts ON' : 'Alerts OFF'}</span>
                      </button>

                      {ss.emailAlertsEnabled && (
                        <span className="text-[11px] text-[#8C8A85]">
                          To: <strong className="text-[#3E3C38]">{ss.userEmail}</strong>
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-[#8C8A85]">
                      Saved {new Date(ss.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

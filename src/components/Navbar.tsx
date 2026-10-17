import React from 'react';
import { Building2, Heart, Calendar, PlusCircle, Search, Bookmark, Calculator, Bell } from 'lucide-react';

interface NavbarProps {
  listingType: 'all' | 'sale' | 'rent';
  setListingType: (type: 'all' | 'sale' | 'rent') => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  scheduledToursCount: number;
  onOpenToursModal: () => void;
  onOpenAddListingModal: () => void;
  savedSearchesCount: number;
  onOpenSavedSearchesModal: () => void;
  onOpenMortgageCalculatorModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  listingType,
  setListingType,
  savedCount,
  onOpenSavedDrawer,
  scheduledToursCount,
  onOpenToursModal,
  onOpenAddListingModal,
  savedSearchesCount,
  onOpenSavedSearchesModal,
  onOpenMortgageCalculatorModal,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E8E6E1] text-[#3E3C38] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#5C6B4E] flex items-center justify-center text-white shadow-sm ring-2 ring-[#5C6B4E]/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-bold tracking-tight text-[#5C6B4E]">EstateVue</span>
                <span className="text-[10px] font-semibold bg-[#8A9A5B]/15 text-[#5C6B4E] px-1.5 py-0.5 rounded border border-[#8A9A5B]/30 uppercase tracking-wider">Natural</span>
              </div>
              <p className="text-[10px] text-[#8C8A85] font-medium hidden sm:block">Earth-Conscious Homes & Verified Listings</p>
            </div>
          </div>

          {/* Quick Search & Buy/Rent Toggle */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
            {/* Buy / Rent Selector */}
            <div className="bg-[#F3F1ED] p-1 rounded-xl border border-[#E8E6E1] flex items-center shrink-0">
              <button
                onClick={() => setListingType('sale')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  listingType === 'sale'
                    ? 'bg-[#5C6B4E] text-white shadow-xs'
                    : 'text-[#8C8A85] hover:text-[#3E3C38] hover:bg-white/60'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setListingType('rent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  listingType === 'rent'
                    ? 'bg-[#5C6B4E] text-white shadow-xs'
                    : 'text-[#8C8A85] hover:text-[#3E3C38] hover:bg-white/60'
                }`}
              >
                Rent
              </button>
              <button
                onClick={() => setListingType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  listingType === 'all'
                    ? 'bg-[#5C6B4E] text-white shadow-xs'
                    : 'text-[#8C8A85] hover:text-[#3E3C38] hover:bg-white/60'
                }`}
              >
                All
              </button>
            </div>

            {/* Navbar Instant Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8A85]" />
              <input
                type="text"
                placeholder="City, neighborhood, or zip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3F1ED] text-[#3E3C38] placeholder-[#8C8A85] text-xs rounded-xl pl-9 pr-3 py-2 border border-[#E8E6E1] focus:outline-none focus:ring-2 focus:ring-[#8A9A5B] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8A85] hover:text-[#3E3C38] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mortgage Calculator Quick Button */}
            <button
              onClick={onOpenMortgageCalculatorModal}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-[#F3F1ED] text-[#3E3C38] border border-[#E8E6E1] transition-all flex items-center gap-2 text-xs font-semibold shadow-xs"
              title="Mortgage Payment Calculator"
            >
              <Calculator className="w-4 h-4 text-[#5C6B4E]" />
              <span className="hidden lg:inline">Calculator</span>
            </button>

            {/* Saved Searches & Alerts Button */}
            <button
              onClick={onOpenSavedSearchesModal}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-[#F3F1ED] text-[#3E3C38] border border-[#E8E6E1] transition-all flex items-center gap-2 text-xs font-semibold shadow-xs"
              title="Saved Searches & Email Alerts"
            >
              <Bookmark className="w-4 h-4 text-[#8A9A5B]" />
              <span className="hidden sm:inline">Searches</span>
              {savedSearchesCount > 0 && (
                <span className="bg-[#8A9A5B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {savedSearchesCount}
                </span>
              )}
            </button>

            {/* Scheduled Tours Button */}
            <button
              onClick={onOpenToursModal}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-[#F3F1ED] text-[#3E3C38] border border-[#E8E6E1] transition-all flex items-center gap-2 text-xs font-medium shadow-xs"
              title="View Scheduled Tours"
            >
              <Calendar className="w-4 h-4 text-[#8A9A5B]" />
              <span className="hidden md:inline">Tours</span>
              {scheduledToursCount > 0 && (
                <span className="bg-[#8A9A5B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {scheduledToursCount}
                </span>
              )}
            </button>

            {/* Saved Homes / Comparison Button */}
            <button
              onClick={onOpenSavedDrawer}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-[#F3F1ED] text-[#3E3C38] border border-[#E8E6E1] transition-all flex items-center gap-2 text-xs font-medium shadow-xs"
              title="Saved Properties"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-[#D98E73] text-[#D98E73]' : 'text-[#8C8A85]'}`} />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="bg-[#D98E73] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* List Property CTA */}
            <button
              onClick={onOpenAddListingModal}
              className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden md:inline">List Property</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

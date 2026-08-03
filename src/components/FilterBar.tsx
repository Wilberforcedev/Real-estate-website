import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  RotateCcw, 
  Map, 
  LayoutGrid, 
  Split, 
  Check, 
  ChevronDown, 
  X, 
  Sparkles,
  Bookmark,
  Bell
} from 'lucide-react';
import { FilterState, PropertyType } from '../types';
import { ALL_AMENITIES_LIST } from '../data/mockProperties';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResults: number;
  viewMode: 'split' | 'grid' | 'map';
  setViewMode: (mode: 'split' | 'grid' | 'map') => void;
  onResetFilters: () => void;
  onOpenSavedSearchesModal: () => void;
}

const PROPERTY_TYPES: PropertyType[] = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Luxury Villa',
  'Penthouse',
  'Multi-Family',
  'Land'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalResults,
  viewMode,
  setViewMode,
  onResetFilters,
  onOpenSavedSearchesModal
}) => {
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);

  // Active filters count calculation
  const activeFiltersCount = 
    (filters.listingType !== 'all' ? 1 : 0) +
    filters.propertyTypes.length +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 10000000 ? 1 : 0) +
    (filters.minBeds > 0 ? 1 : 0) +
    (filters.minBaths > 0 ? 1 : 0) +
    (filters.minSqFt > 0 ? 1 : 0) +
    filters.amenities.length;

  const togglePropertyType = (type: PropertyType) => {
    setFilters(prev => {
      const exists = prev.propertyTypes.includes(type);
      return {
        ...prev,
        propertyTypes: exists
          ? prev.propertyTypes.filter(t => t !== type)
          : [...prev.propertyTypes, type]
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  return (
    <div className="bg-white border-b border-[#E8E6E1] sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Controls Group */}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8A85]" />
              <input
                type="text"
                placeholder="City, ZIP, address..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full bg-[#F3F1ED] hover:bg-[#F8F7F2] focus:bg-white text-[#3E3C38] placeholder-[#8C8A85] text-xs rounded-xl pl-9 pr-8 py-2 border border-[#E8E6E1] focus:outline-none focus:ring-2 focus:ring-[#8A9A5B] focus:border-transparent transition-all font-medium"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8A85] hover:text-[#3E3C38] text-xs p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Price Range Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#3E3C38] hover:border-[#8A9A5B] cursor-pointer transition-colors">
                <span>Price:</span>
                <span className="text-[#5C6B4E] font-bold">
                  {filters.minPrice > 0 ? `$${(filters.minPrice/1000).toFixed(0)}k` : 'Any'} – {filters.maxPrice < 10000000 ? `$${(filters.maxPrice/1000000).toFixed(1)}M` : 'Max'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C8A85]" />
              </div>

              {/* Price Popover Panel */}
              <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-[#E8E6E1] p-4 z-50 hidden group-hover:block group-focus-within:block">
                <p className="text-xs font-bold text-[#3E3C38] mb-3">Price Range</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-medium text-[#8C8A85] mb-1 block">Min Price (${filters.minPrice.toLocaleString()})</label>
                    <input
                      type="range"
                      min={0}
                      max={5000000}
                      step={100000}
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                      className="w-full accent-[#5C6B4E] h-1.5 bg-[#E8E6E1] rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#8C8A85] mb-1 block">Max Price (${filters.maxPrice.toLocaleString()})</label>
                    <input
                      type="range"
                      min={500000}
                      max={10000000}
                      step={250000}
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full accent-[#5C6B4E] h-1.5 bg-[#E8E6E1] rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[#E8E6E1]">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 10000000 }))}
                      className="text-[11px] font-semibold text-[#8C8A85] hover:text-[#3E3C38] py-1"
                    >
                      Reset Price
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Beds Selector */}
            <div className="flex items-center bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-1">
              <span className="text-[11px] font-bold text-[#8C8A85] px-2">Beds:</span>
              {[0, 1, 2, 3, 4].map((beds) => (
                <button
                  key={beds}
                  onClick={() => setFilters(prev => ({ ...prev, minBeds: beds }))}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    filters.minBeds === beds
                      ? 'bg-[#5C6B4E] text-white shadow-xs'
                      : 'text-[#3E3C38] hover:text-[#5C6B4E] hover:bg-white/70'
                  }`}
                >
                  {beds === 0 ? 'Any' : `${beds}+`}
                </button>
              ))}
            </div>

            {/* Property Types Trigger */}
            <button
              onClick={() => setShowMoreFiltersModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                filters.propertyTypes.length > 0
                  ? 'bg-[#8A9A5B]/15 border-[#8A9A5B] text-[#5C6B4E]'
                  : 'bg-[#F3F1ED] border-[#E8E6E1] text-[#3E3C38] hover:bg-[#F8F7F2]'
              }`}
            >
              <span>Property Type</span>
              {filters.propertyTypes.length > 0 && (
                <span className="bg-[#5C6B4E] text-white text-[10px] font-extrabold px-1.5 rounded-full">
                  {filters.propertyTypes.length}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-[#8C8A85]" />
            </button>

            {/* Amenities Trigger */}
            <button
              onClick={() => setShowAmenitiesModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                filters.amenities.length > 0
                  ? 'bg-[#8A9A5B]/15 border-[#8A9A5B] text-[#5C6B4E]'
                  : 'bg-[#F3F1ED] border-[#E8E6E1] text-[#3E3C38] hover:bg-[#F8F7F2]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>Amenities</span>
              {filters.amenities.length > 0 && (
                <span className="bg-[#5C6B4E] text-white text-[10px] font-extrabold px-1.5 rounded-full">
                  {filters.amenities.length}
                </span>
              )}
            </button>

            {/* All Filters / More Button */}
            <button
              onClick={() => setShowMoreFiltersModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#5C6B4E] text-white text-xs font-semibold hover:bg-[#4A573F] transition-all shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#8A9A5B] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Save Search & Email Alert CTA */}
            <button
              onClick={onOpenSavedSearchesModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#8A9A5B]/15 text-[#5C6B4E] border border-[#8A9A5B]/40 hover:bg-[#8A9A5B]/25 text-xs font-bold transition-all shadow-xs"
              title="Save current search criteria and configure email alerts"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#5C6B4E]" />
              <span className="hidden sm:inline">Save Search</span>
            </button>

            {/* Reset Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-[#8C8A85] hover:text-[#D98E73] text-xs font-semibold transition-colors px-2 py-1"
                title="Clear all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Reset</span>
              </button>
            )}
          </div>

          {/* View Toggles & Sorting */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Total Results Count */}
            <span className="text-xs font-bold text-[#8C8A85] hidden sm:inline">
              <strong className="text-[#3E3C38]">{totalResults}</strong> properties
            </span>

            {/* Sort Selector */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-[#F3F1ED] border border-[#E8E6E1] text-[#3E3C38] text-xs font-semibold rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Listings</option>
              <option value="sqft-desc">Largest Sq Ft</option>
            </select>

            {/* View Mode Switcher */}
            <div className="bg-[#F3F1ED] p-1 rounded-xl flex items-center gap-1 border border-[#E8E6E1]">
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'split'
                    ? 'bg-white text-[#5C6B4E] shadow-xs font-bold'
                    : 'text-[#8C8A85] hover:text-[#3E3C38]'
                }`}
                title="Split Map + List View"
              >
                <Split className="w-4 h-4" />
                <span className="hidden xl:inline text-[11px]">Split</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#5C6B4E] shadow-xs font-bold'
                    : 'text-[#8C8A85] hover:text-[#3E3C38]'
                }`}
                title="Full Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden xl:inline text-[11px]">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'map'
                    ? 'bg-white text-[#5C6B4E] shadow-xs font-bold'
                    : 'text-[#8C8A85] hover:text-[#3E3C38]'
                }`}
                title="Full Map View"
              >
                <Map className="w-4 h-4" />
                <span className="hidden xl:inline text-[11px]">Map</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* AMENITIES MODAL */}
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-50 bg-[#3E3C38]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E6E1] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8A9A5B]" />
                <h3 className="font-serif font-bold text-lg text-[#3E3C38]">Filter by Amenities</h3>
              </div>
              <button
                onClick={() => setShowAmenitiesModal(false)}
                className="p-1 rounded-full text-[#8C8A85] hover:bg-[#F3F1ED] hover:text-[#3E3C38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-5 max-h-80 overflow-y-auto">
              {ALL_AMENITIES_LIST.map((amenity) => {
                const isChecked = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                      isChecked
                        ? 'bg-[#8A9A5B]/15 border-[#8A9A5B] text-[#5C6B4E] shadow-xs'
                        : 'bg-[#F3F1ED] border-[#E8E6E1] text-[#3E3C38] hover:bg-[#F8F7F2]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      isChecked ? 'bg-[#5C6B4E] border-[#5C6B4E] text-white' : 'border-[#E8E6E1] bg-white'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E8E6E1]">
              <button
                onClick={() => setFilters(prev => ({ ...prev, amenities: [] }))}
                className="text-xs font-bold text-[#8C8A85] hover:text-[#3E3C38]"
              >
                Clear Amenities
              </button>
              <button
                onClick={() => setShowAmenitiesModal(false)}
                className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs"
              >
                Apply Filters ({filters.amenities.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MORE FILTERS & PROPERTY TYPES MODAL */}
      {showMoreFiltersModal && (
        <div className="fixed inset-0 z-50 bg-[#3E3C38]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#E8E6E1] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#5C6B4E]" />
                <h3 className="font-serif font-bold text-lg text-[#3E3C38]">Detailed Search Filters</h3>
              </div>
              <button
                onClick={() => setShowMoreFiltersModal(false)}
                className="p-1 rounded-full text-[#8C8A85] hover:bg-[#F3F1ED] hover:text-[#3E3C38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 py-5">
              {/* Property Types */}
              <div>
                <label className="text-xs font-bold text-[#3E3C38] uppercase tracking-wider block mb-3">Property Types</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((type) => {
                    const active = filters.propertyTypes.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => togglePropertyType(type)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          active
                            ? 'bg-[#5C6B4E] border-[#5C6B4E] text-white shadow-xs'
                            : 'bg-[#F3F1ED] border-[#E8E6E1] text-[#3E3C38] hover:bg-[#F8F7F2]'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="text-xs font-bold text-[#3E3C38] uppercase tracking-wider block mb-3">Minimum Bathrooms</label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4].map((baths) => (
                    <button
                      key={baths}
                      onClick={() => setFilters(prev => ({ ...prev, minBaths: baths }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        filters.minBaths === baths
                          ? 'bg-[#5C6B4E] border-[#5C6B4E] text-white shadow-xs'
                          : 'bg-[#F3F1ED] border-[#E8E6E1] text-[#3E3C38] hover:bg-[#F8F7F2]'
                      }`}
                    >
                      {baths === 0 ? 'Any' : `${baths}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Square Footage */}
              <div>
                <label className="text-xs font-bold text-[#3E3C38] uppercase tracking-wider block mb-3">Square Footage (Sq Ft)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-medium text-[#8C8A85] mb-1 block">Min Sq Ft</span>
                    <select
                      value={filters.minSqFt}
                      onChange={(e) => setFilters(prev => ({ ...prev, minSqFt: Number(e.target.value) }))}
                      className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs font-semibold text-[#3E3C38]"
                    >
                      <option value={0}>No Min</option>
                      <option value={1000}>1,000 sqft</option>
                      <option value={1500}>1,500 sqft</option>
                      <option value={2000}>2,000 sqft</option>
                      <option value={3000}>3,000 sqft</option>
                      <option value={5000}>5,000 sqft</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-[#8C8A85] mb-1 block">Max Sq Ft</span>
                    <select
                      value={filters.maxSqFt}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxSqFt: Number(e.target.value) }))}
                      className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs font-semibold text-[#3E3C38]"
                    >
                      <option value={20000}>No Max</option>
                      <option value={2000}>2,000 sqft</option>
                      <option value={3500}>3,500 sqft</option>
                      <option value={5000}>5,000 sqft</option>
                      <option value={10000}>10,000 sqft</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E8E6E1]">
              <button
                onClick={onResetFilters}
                className="text-xs font-bold text-[#8C8A85] hover:text-[#3E3C38]"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setShowMoreFiltersModal(false)}
                className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs"
              >
                Show {totalResults} Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

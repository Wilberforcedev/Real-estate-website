import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { PropertyMap } from './components/PropertyMap';
import { ListingCard } from './components/ListingCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SavedPropertiesDrawer } from './components/SavedPropertiesDrawer';
import { ComparisonModal } from './components/ComparisonModal';
import { ScheduledToursModal } from './components/ScheduledToursModal';
import { AddListingModal } from './components/AddListingModal';
import { SavedSearchesModal } from './components/SavedSearchesModal';
import { MortgageCalculatorModal } from './components/MortgageCalculatorModal';
import { Property, FilterState, TourBooking, AgentInquiry, SavedSearch } from './types';
import { INITIAL_PROPERTIES } from './data/mockProperties';
import { Sparkles, Building2, MapPin, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  listingType: 'all',
  propertyTypes: [],
  minPrice: 0,
  maxPrice: 10000000,
  minBeds: 0,
  minBaths: 0,
  minSqFt: 0,
  maxSqFt: 20000,
  amenities: [],
  sortBy: 'featured'
};

const DEFAULT_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'search-1',
    name: 'San Francisco Luxury Condos & Villas',
    filters: {
      ...INITIAL_FILTER_STATE,
      searchQuery: 'San Francisco',
      listingType: 'sale',
      propertyTypes: ['Condo', 'Luxury Villa'],
      minPrice: 1500000,
      maxPrice: 5000000
    },
    emailAlertsEnabled: false,
    alertFrequency: 'daily',
    userEmail: '',
    createdAt: '2026-08-01'
  }
];

function readStoredArray<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, quota); the app keeps working in memory.
  }
}

export default function App() {
  // Persistence for custom properties & saved states
  const [properties, setProperties] = useState<Property[]>(() =>
    readStoredArray<Property>('estatevue_properties', INITIAL_PROPERTIES)
  );

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() =>
    readStoredArray<string>('estatevue_saved_ids', ['prop-1', 'prop-3'])
  );

  const [tourBookings, setTourBookings] = useState<TourBooking[]>(() =>
    readStoredArray<TourBooking>('estatevue_tour_bookings', [])
  );

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() =>
    readStoredArray<SavedSearch>('estatevue_saved_searches', DEFAULT_SAVED_SEARCHES)
  );

  // Filter State & View Mode
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('grid');
  
  // Modals & Hover States
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailModalProperty, setDetailModalProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isToursModalOpen, setIsToursModalOpen] = useState(false);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isSavedSearchesOpen, setIsSavedSearchesOpen] = useState(false);
  const [isMortgageCalcOpen, setIsMortgageCalcOpen] = useState(false);

  // Toast Banner State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    persist('estatevue_properties', properties);
  }, [properties]);

  useEffect(() => {
    persist('estatevue_saved_ids', savedPropertyIds);
  }, [savedPropertyIds]);

  useEffect(() => {
    persist('estatevue_tour_bookings', tourBookings);
  }, [tourBookings]);

  useEffect(() => {
    persist('estatevue_saved_searches', savedSearches);
  }, [savedSearches]);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Saved Search Handlers
  const handleSaveSearch = (
    name: string,
    email: string,
    enableAlerts: boolean,
    frequency: 'instant' | 'daily' | 'weekly'
  ) => {
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name,
      filters: { ...filters },
      emailAlertsEnabled: enableAlerts,
      alertFrequency: frequency,
      userEmail: email,
      createdAt: new Date().toISOString()
    };
    setSavedSearches((prev) => [newSearch, ...prev]);
    showToast(enableAlerts ? 'Search saved on this device. Email alerts are a demo and are not sent.' : 'Search saved on this device.');
  };

  const handleApplySavedSearch = (savedFilters: FilterState) => {
    setFilters(savedFilters);
    showToast('Saved search criteria applied.');
  };

  const handleDeleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    showToast('Saved search deleted.');
  };

  const handleToggleSavedSearchAlerts = (
    id: string,
    enabled: boolean,
    frequency?: 'instant' | 'daily' | 'weekly'
  ) => {
    setSavedSearches((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              emailAlertsEnabled: enabled,
              ...(frequency ? { alertFrequency: frequency } : {})
            }
          : s
      )
    );
    showToast('Alert preference saved on this device. No email will be sent.');
  };

  // Toggle Saved Heart
  const handleToggleFavorite = (propertyId: string) => {
    setSavedPropertyIds((prev) => {
      const exists = prev.includes(propertyId);
      const updated = exists ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      if (!exists) {
        showToast('Property saved to your collection! ❤️');
      }
      return updated;
    });
  };

  // Quick Schedule Tour handler from card
  const handleQuickScheduleTour = (property: Property) => {
    setDetailModalProperty(property);
  };

  // Submit Tour Booking
  const handleScheduleTourSubmit = (booking: TourBooking) => {
    setTourBookings((prev) => [booking, ...prev]);
    showToast(`Tour request saved on this device for ${booking.date} at ${booking.timeSlot}. It has not been sent to the agent.`);
  };

  // Submit Agent Inquiry
  const handleAgentInquirySubmit = (inquiry: AgentInquiry) => {
    showToast(`Inquiry preview for ${inquiry.agentName}. No message has been sent.`);
  };

  // Add Custom Property
  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    showToast(`"${newProp.title}" added to this browser's demo collection.`);
  };

  // Cancel Tour
  const handleCancelTour = (tourId: string) => {
    setTourBookings((prev) => prev.filter((t) => t.id !== tourId));
    showToast('Tour booking cancelled.');
  };

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Listing Type filter (Sale / Rent)
      if (filters.listingType !== 'all' && prop.listingType !== filters.listingType) {
        return false;
      }

      // Search Query filter (Title, address, city, state, zip)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(query);
        const matchAddress = prop.address.toLowerCase().includes(query);
        const matchCity = prop.city.toLowerCase().includes(query);
        const matchState = prop.state.toLowerCase().includes(query);
        const matchZip = prop.zipCode.includes(query);
        const matchType = prop.propertyType.toLowerCase().includes(query);

        if (!matchTitle && !matchAddress && !matchCity && !matchState && !matchZip && !matchType) {
          return false;
        }
      }

      // Property Type
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(prop.propertyType)) {
        return false;
      }

      // Price Range
      if (prop.price < filters.minPrice || prop.price > filters.maxPrice) {
        return false;
      }

      // Beds & Baths
      if (prop.beds < filters.minBeds || prop.baths < filters.minBaths) {
        return false;
      }

      // Sq Ft Range
      if (prop.sqft < filters.minSqFt || prop.sqft > filters.maxSqFt) {
        return false;
      }

      // Amenities (Must match all selected amenities)
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((am) => prop.amenities.includes(am));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'sqft-desc') return b.sqft - a.sqft;
      // Featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [properties, filters]);

  const savedPropertiesList = useMemo(() => {
    return properties.filter((p) => savedPropertyIds.includes(p.id));
  }, [properties, savedPropertyIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EE] text-[#26372D] font-sans">
      <a href="#property-results" className="sr-only z-50 rounded bg-white px-4 py-3 text-[#26372D] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-[#71806A]">Skip to property listings</a>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div role="status" aria-live="polite" className="fixed top-20 right-4 z-50 bg-[#26372D] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#71806A]/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-[#8A9A5B] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        listingType={filters.listingType}
        setListingType={(type) => setFilters((prev) => ({ ...prev, listingType: type }))}
        savedCount={savedPropertyIds.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        scheduledToursCount={tourBookings.length}
        onOpenToursModal={() => setIsToursModalOpen(true)}
        onOpenAddListingModal={() => setIsAddListingOpen(true)}
        savedSearchesCount={savedSearches.length}
        onOpenSavedSearchesModal={() => setIsSavedSearchesOpen(true)}
        onOpenMortgageCalculatorModal={() => setIsMortgageCalcOpen(true)}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
      />


      {/* Editorial hero inspired by the quiet, architectural feel of CDA National */}
      {viewMode !== 'map' && (
        <section className="relative isolate min-h-[430px] overflow-hidden bg-[#17251d] sm:min-h-[500px] lg:min-h-[590px]">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85"
            alt="Modern home framed by its natural landscape"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#15221c]/85 via-[#15221c]/48 to-[#15221c]/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#15221c]/55 via-transparent to-[#15221c]/10" />
          <div className="mx-auto flex min-h-[430px] max-w-7xl flex-col justify-end px-5 pb-12 pt-16 sm:min-h-[500px] sm:px-8 sm:pb-16 lg:min-h-[590px] lg:px-12 lg:pb-20">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e0d5bd] sm:text-xs">
                <span className="h-px w-8 bg-[#d6c6a5]" />
                A more considered way to find home
              </p>
              <h1 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Space to live.<br className="hidden sm:block" /> Room to belong.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Explore distinctive homes, compare the details that matter, and discover a setting that feels unmistakably yours.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => document.getElementById('property-results')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-3 bg-[#f1eee6] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#24372c] transition hover:bg-white"
                >
                  Explore homes <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className="inline-flex items-center gap-2 border border-white/55 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
                >
                  <MapPin className="h-4 w-4" /> Explore the map
                </button>
              </div>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/75 sm:mt-16">
              <span className="h-px w-8 bg-[#d6c6a5]" />
              Distinctive homes · thoughtful details · places to put down roots
            </div>
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        totalResults={filteredProperties.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
        onOpenSavedSearchesModal={() => setIsSavedSearchesOpen(true)}
      />

      <aside role="note" className="mx-auto flex w-full max-w-7xl items-start gap-2 px-4 py-3 text-xs leading-relaxed text-[#5f6258] sm:px-6 lg:px-8">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#71806A]" />
        <p><strong className="font-semibold text-[#35483c]">Preview experience.</strong> Listings are examples. Favorites, searches, tour requests, and added properties are saved in this browser; no emails or bookings are sent.</p>
      </aside>

      {/* Main Container View Area */}
      <main id="property-results" className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* VIEW MODE 1: SPLIT MAP + LIST VIEW */}
        {viewMode === 'split' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8rem)]">
            
            {/* Left 50%: Listings Grid Column (6 cols on lg) */}
            <div className="lg:col-span-6 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-8rem)]">
              
              {/* Editorial introduction keeps the search experience welcoming and clear */}
              <section className="relative overflow-hidden rounded-[1.75rem] border border-[#E8E6E1] bg-gradient-to-br from-white via-white to-[#F1F1E8] p-5 sm:p-6 shadow-sm">
                <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full border-[26px] border-[#8A9A5B]/10" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-lg">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#5C6B4E]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5C6B4E]">
                      <Sparkles className="h-3 w-3" /> Thoughtfully found homes
                    </div>
                    <h1 className="font-serif text-2xl font-semibold leading-tight tracking-tight text-[#30342B] sm:text-[2rem]">
                      Find a place that feels like yours.
                    </h1>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-[#77776D] sm:text-sm">
                      Explore homes, compare the details that matter, and book a tour when you’re ready.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5C6B4E]/10 text-[#5C6B4E]"><ShieldCheck className="h-4 w-4" /></div>
                    <div>
                      <p className="text-[11px] font-bold text-[#3E3C38]">Your search, made simple</p>
                      <p className="mt-0.5 text-[10px] text-[#8C8A85]">Save favorites and plan a visit</p>
                    </div>
                    <ArrowUpRight className="ml-1 h-4 w-4 text-[#8C8A85]" />
                  </div>
                </div>
              </section>

              {/* Active Filter summary */}
              <div className="flex items-center justify-between">
                <h2 className="font-serif font-bold text-lg text-[#3E3C38] flex items-center gap-2">
                  <span>Listings for {filters.listingType === 'sale' ? 'Sale' : filters.listingType === 'rent' ? 'Rent' : 'Sale & Rent'}</span>
                  <span className="text-xs font-sans font-normal text-[#3E3C38] bg-[#E8E6E1] px-2.5 py-0.5 rounded-full">
                    {filteredProperties.length} results
                  </span>
                </h2>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="bg-[#F3F1ED] rounded-3xl p-10 text-center border border-[#E8E6E1] space-y-3 my-8">
                  <Building2 className="w-12 h-12 text-[#8C8A85] mx-auto" />
                  <h3 className="font-serif font-bold text-base text-[#3E3C38]">No properties found</h3>
                  <p className="text-xs text-[#8C8A85] max-w-sm mx-auto">
                    Try broadening your search criteria or resetting filters to see more results.
                  </p>
                  <button
                    onClick={() => setFilters(INITIAL_FILTER_STATE)}
                    className="mt-2 bg-[#5C6B4E] hover:bg-[#4A573F] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProperties.map((property) => (
                    <ListingCard
                      key={property.id}
                      property={property}
                      isFavorite={savedPropertyIds.includes(property.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectProperty={setSelectedProperty}
                      onOpenDetailModal={setDetailModalProperty}
                      onQuickScheduleTour={handleQuickScheduleTour}
                      isHovered={hoveredPropertyId === property.id}
                      onHover={setHoveredPropertyId}
                    />
                  ))}
                </div>
              )}

            </div>

            {/* Right 50%: Sticky Interactive Leaflet Map Column (6 cols on lg) */}
            <div className="lg:col-span-6 p-4 lg:pl-0 h-[500px] lg:h-auto sticky top-32">
              <PropertyMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onSelectProperty={setSelectedProperty}
                hoveredPropertyId={hoveredPropertyId}
                onHoverProperty={setHoveredPropertyId}
                onOpenDetailModal={setDetailModalProperty}
              />
            </div>

          </div>
        )}

        {/* VIEW MODE 2: FULL GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#69765f]">The collection</p>
                <h2 className="font-serif text-3xl font-medium tracking-tight text-[#27362d] sm:text-4xl">Find your place</h2>
                <p className="mt-2 text-sm text-[#77766e]">A considered selection of homes, ready to explore.</p>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="bg-[#F3F1ED] rounded-3xl p-12 text-center border border-[#E8E6E1] max-w-md mx-auto space-y-3 my-12">
                <Building2 className="w-12 h-12 text-[#8C8A85] mx-auto" />
                <h3 className="font-serif font-bold text-base text-[#3E3C38]">No properties found</h3>
                <button
                  onClick={() => setFilters(INITIAL_FILTER_STATE)}
                  className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <ListingCard
                    key={property.id}
                    property={property}
                    isFavorite={savedPropertyIds.includes(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectProperty={setSelectedProperty}
                    onOpenDetailModal={setDetailModalProperty}
                    onQuickScheduleTour={handleQuickScheduleTour}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 3: FULL MAP VIEW */}
        {viewMode === 'map' && (
          <div className="w-full h-[calc(100vh-8rem)] p-4">
            <PropertyMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onSelectProperty={setSelectedProperty}
              hoveredPropertyId={hoveredPropertyId}
              onHoverProperty={setHoveredPropertyId}
              onOpenDetailModal={setDetailModalProperty}
            />
          </div>
        )}

      </main>

      {/* Property Detail Modal */}
      {detailModalProperty && (
        <PropertyDetailModal
          property={detailModalProperty}
          onClose={() => setDetailModalProperty(null)}
          isFavorite={savedPropertyIds.includes(detailModalProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          onScheduleTourSubmit={handleScheduleTourSubmit}
          onAgentInquirySubmit={handleAgentInquirySubmit}
        />
      )}

      {/* Saved Properties Drawer */}
      <SavedPropertiesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedPropertiesList}
        onRemoveSaved={handleToggleFavorite}
        onOpenDetailModal={setDetailModalProperty}
        onOpenComparisonModal={() => setIsComparisonOpen(true)}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        savedProperties={savedPropertiesList}
        onOpenDetailModal={setDetailModalProperty}
      />

      {/* Scheduled Tours Modal */}
      <ScheduledToursModal
        isOpen={isToursModalOpen}
        onClose={() => setIsToursModalOpen(false)}
        tourBookings={tourBookings}
        onCancelTour={handleCancelTour}
      />

      {/* Add Custom Listing Modal */}
      <AddListingModal
        isOpen={isAddListingOpen}
        onClose={() => setIsAddListingOpen(false)}
        onAddProperty={handleAddProperty}
      />

      {/* Saved Searches & Email Alerts Modal */}
      <SavedSearchesModal
        isOpen={isSavedSearchesOpen}
        onClose={() => setIsSavedSearchesOpen(false)}
        savedSearches={savedSearches}
        onSaveSearch={handleSaveSearch}
        onApplySearch={handleApplySavedSearch}
        onDeleteSearch={handleDeleteSavedSearch}
        onToggleAlerts={handleToggleSavedSearchAlerts}
        currentFilters={filters}
      />

      {/* Standalone Mortgage Calculator Tool */}
      <MortgageCalculatorModal
        isOpen={isMortgageCalcOpen}
        onClose={() => setIsMortgageCalcOpen(false)}
        initialPrice={detailModalProperty ? detailModalProperty.price : 1250000}
      />

    </div>
  );
}

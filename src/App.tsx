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
import { Sparkles, Building2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

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

export default function App() {
  // Persistence for custom properties & saved states
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('estatevue_properties');
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('estatevue_saved_ids');
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-3'];
    } catch {
      return ['prop-1', 'prop-3'];
    }
  });

  const [tourBookings, setTourBookings] = useState<TourBooking[]>(() => {
    try {
      const saved = localStorage.getItem('estatevue_tour_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    try {
      const saved = localStorage.getItem('estatevue_saved_searches');
      return saved ? JSON.parse(saved) : [
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
          emailAlertsEnabled: true,
          alertFrequency: 'daily',
          userEmail: 'wilberofficial2001@gmail.com',
          createdAt: '2026-08-01'
        }
      ];
    } catch {
      return [];
    }
  });

  // Filter State & View Mode
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  
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
    localStorage.setItem('estatevue_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('estatevue_saved_ids', JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  useEffect(() => {
    localStorage.setItem('estatevue_tour_bookings', JSON.stringify(tourBookings));
  }, [tourBookings]);

  useEffect(() => {
    localStorage.setItem('estatevue_saved_searches', JSON.stringify(savedSearches));
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
    showToast(`Saved search "${name}" created! ${enableAlerts ? `Email alerts set to ${frequency}.` : ''} 🔔`);
  };

  const handleApplySavedSearch = (savedFilters: FilterState) => {
    setFilters(savedFilters);
    showToast(`Applied saved search criteria! 🔍`);
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
    showToast(`Email alert status updated.`);
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
    showToast(`Tour requested with ${booking.agentName} for ${booking.date} at ${booking.timeSlot}! 📅`);
  };

  // Submit Agent Inquiry
  const handleAgentInquirySubmit = (inquiry: AgentInquiry) => {
    showToast(`Question sent to agent ${inquiry.agentName}! Check your email shortly. 📩`);
  };

  // Add Custom Property
  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    showToast(`Property "${newProp.title}" listed successfully! 🎉`);
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#3E3C38] font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#3E3C38] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#8A9A5B]/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
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

      {/* Main Container View Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* VIEW MODE 1: SPLIT MAP + LIST VIEW */}
        {viewMode === 'split' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8rem)]">
            
            {/* Left 50%: Listings Grid Column (6 cols on lg) */}
            <div className="lg:col-span-6 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-8rem)]">
              
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
                <h2 className="font-serif font-bold text-2xl text-[#3E3C38]">Explore Properties</h2>
                <p className="text-xs text-[#8C8A85]">Showing {filteredProperties.length} properties matching your criteria</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

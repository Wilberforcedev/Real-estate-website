export type ListingType = 'sale' | 'rent' | 'sold' | 'pending';

export type PropertyType = 
  | 'Single Family'
  | 'Condo'
  | 'Townhouse'
  | 'Luxury Villa'
  | 'Penthouse'
  | 'Multi-Family'
  | 'Land';

export interface Agent {
  id: string;
  name: string;
  agency: string;
  avatar: string;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  responseTime: string;
  listingsCount: number;
}

export interface NearbySchool {
  name: string;
  type: 'Public' | 'Private' | 'Charter';
  grades: string;
  rating: number; // 1-10
  distance: string;
}

export interface NeighborhoodStats {
  walkScore: number;
  transitScore: number;
  bikeScore: number;
  safetyRating: string;
  nearbySchools: NearbySchool[];
  topSpots: { category: string; name: string; distance: string }[];
}

export interface PriceHistoryItem {
  date: string;
  price: number;
  event: 'Listed' | 'Price Change' | 'Pending' | 'Sold';
  source?: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  rentPeriod?: 'month' | 'year';
  listingType: ListingType;
  propertyType: PropertyType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSizeSqFt?: number;
  yearBuilt: number;
  pricePerSqFt: number;
  hoaFeePerMonth?: number;
  estMonthlyTax?: number;
  estInsurance?: number;
  description: string;
  images: string[];
  floorPlanImage?: string;
  virtualTourUrl?: string;
  videoUrl?: string;
  amenities: string[];
  isFeatured?: boolean;
  isHot?: boolean;
  openHouse?: string;
  agent: Agent;
  neighborhood: NeighborhoodStats;
  priceHistory: PriceHistoryItem[];
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  listingType: 'all' | 'sale' | 'rent';
  propertyTypes: PropertyType[];
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  minSqFt: number;
  maxSqFt: number;
  amenities: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'sqft-desc';
}

export interface TourBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  agentName: string;
  tourType: 'in-person' | 'video';
  date: string;
  timeSlot: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  notes?: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface AgentInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  agentName: string;
  inquiryType: 'question' | 'pricing' | 'disclosures' | 'offer';
  message: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterState;
  emailAlertsEnabled: boolean;
  alertFrequency: 'instant' | 'daily' | 'weekly';
  userEmail: string;
  createdAt: string;
}

export interface MortgageCalcState {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  propertyTaxRate: number;
  annualInsurance: number;
  monthlyHoa: number;
}

import { Property } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'The Glass Pavilion at Pacific Heights',
    price: 3450000,
    listingType: 'sale',
    propertyType: 'Luxury Villa',
    address: '2840 Broadway St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94115',
    lat: 37.7942,
    lng: -122.4381,
    beds: 4,
    baths: 4.5,
    sqft: 4200,
    lotSizeSqFt: 6500,
    yearBuilt: 2021,
    pricePerSqFt: 821,
    hoaFeePerMonth: 450,
    estMonthlyTax: 3100,
    estInsurance: 420,
    description: 'An architectural masterpiece overlooking the Golden Gate Bridge and San Francisco Bay. Features floor-to-ceiling glass walls, a temperature-controlled wine cellar, climate-controlled rooftop terrace with fire pit, and seamless indoor-outdoor living.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample123',
    amenities: ['Pool', 'Waterfront', 'Smart Home', 'Garage', 'Wine Cellar', 'AC', 'Rooftop Deck', 'Hardwood Floors', 'EV Charger'],
    isFeatured: true,
    isHot: true,
    openHouse: 'Sat, Aug 8 • 1:00 PM - 4:00 PM',
    agent: {
      id: 'agent-1',
      name: 'Victoria Vance',
      agency: 'Sotheby\'s International Realty',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      phone: '(415) 890-3211',
      email: 'v.vance@sothebysrealty.sf',
      rating: 4.98,
      reviewsCount: 84,
      responseTime: 'Under 15 mins',
      listingsCount: 18
    },
    neighborhood: {
      walkScore: 94,
      transitScore: 88,
      bikeScore: 82,
      safetyRating: 'A+',
      nearbySchools: [
        { name: 'Redding Elementary School', type: 'Public', grades: 'K-5', rating: 9, distance: '0.4 mi' },
        { name: 'Marina Middle School', type: 'Public', grades: '6-8', rating: 8, distance: '0.7 mi' },
        { name: 'Galileo High School', type: 'Public', grades: '9-12', rating: 9, distance: '1.1 mi' }
      ],
      topSpots: [
        { category: 'Parks', name: 'Alta Plaza Park', distance: '0.2 mi' },
        { category: 'Dining', name: 'Gary Danko Fine Dining', distance: '0.8 mi' },
        { category: 'Shopping', name: 'Fillmore Street Boutiques', distance: '0.3 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-05-10', price: 3450000, event: 'Listed' },
      { date: '2024-03-15', price: 3100000, event: 'Sold' }
    ],
    createdAt: '2026-05-10'
  },
  {
    id: 'prop-2',
    title: 'Modern Waterfront Loft at South Beach',
    price: 1850000,
    listingType: 'sale',
    propertyType: 'Condo',
    address: '401 Harrison St #18B',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    lat: 37.7858,
    lng: -122.3922,
    beds: 2,
    baths: 2,
    sqft: 1650,
    yearBuilt: 2019,
    pricePerSqFt: 1121,
    hoaFeePerMonth: 820,
    estMonthlyTax: 1650,
    estInsurance: 210,
    description: 'Sleek luxury condominium in Rincon Hill with unobstructed Bay Bridge views. High-end Gaggenau appliances, European oak cabinetry, private balcony, concierge service, heated infinity lap pool, and state-of-the-art fitness facility.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Pool', 'Waterfront', 'Gym', 'Concierge', 'Balcony', 'AC', 'EV Charger', 'Smart Home'],
    isFeatured: true,
    agent: {
      id: 'agent-2',
      name: 'Marcus Thorne',
      agency: 'Compass Bay Area',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      phone: '(415) 552-9018',
      email: 'm.thorne@compass.com',
      rating: 4.92,
      reviewsCount: 62,
      responseTime: 'Within 30 mins',
      listingsCount: 12
    },
    neighborhood: {
      walkScore: 97,
      transitScore: 100,
      bikeScore: 89,
      safetyRating: 'A',
      nearbySchools: [
        { name: 'SF Public Montessori', type: 'Public', grades: 'K-5', rating: 8, distance: '0.6 mi' }
      ],
      topSpots: [
        { category: 'Transit', name: 'Salesforce Transit Center', distance: '0.3 mi' },
        { category: 'Parks', name: 'Embarcadero Promenade', distance: '0.2 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-06-01', price: 1850000, event: 'Listed' }
    ],
    createdAt: '2026-06-01'
  },
  {
    id: 'prop-3',
    title: 'Malibu Oceanfront Modern Sanctuary',
    price: 7800000,
    listingType: 'sale',
    propertyType: 'Luxury Villa',
    address: '22108 Pacific Coast Hwy',
    city: 'Malibu',
    state: 'CA',
    zipCode: '90265',
    lat: 34.0381,
    lng: -118.6753,
    beds: 5,
    baths: 6,
    sqft: 5800,
    lotSizeSqFt: 12000,
    yearBuilt: 2022,
    pricePerSqFt: 1344,
    hoaFeePerMonth: 0,
    estMonthlyTax: 7200,
    estInsurance: 950,
    description: 'Direct ocean access on Carbon Beach. Custom cedar architectural estate featuring panoramic Pacific Ocean vistas, private stairs to the sand, infinity spa pool, media room, and expansive multi-level outdoor entertainer decks.',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Pool', 'Waterfront', 'Smart Home', 'Garage', 'Garden', 'AC', 'Rooftop Deck', 'Wine Cellar', 'Solar'],
    isFeatured: true,
    isHot: true,
    openHouse: 'Sun, Aug 9 • 2:00 PM - 5:00 PM',
    agent: {
      id: 'agent-3',
      name: 'Elena Rostova',
      agency: 'The Agency Malibu',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      phone: '(310) 892-0012',
      email: 'elena@theagency.com',
      rating: 5.0,
      reviewsCount: 110,
      responseTime: 'Under 10 mins',
      listingsCount: 24
    },
    neighborhood: {
      walkScore: 72,
      transitScore: 40,
      bikeScore: 65,
      safetyRating: 'A+',
      nearbySchools: [
        { name: 'Webster Elementary', type: 'Public', grades: 'K-5', rating: 10, distance: '1.2 mi' },
        { name: 'Malibu High School', type: 'Public', grades: '9-12', rating: 9, distance: '3.5 mi' }
      ],
      topSpots: [
        { category: 'Beaches', name: 'Carbon Beach', distance: '0.0 mi' },
        { category: 'Dining', name: 'Nobu Malibu', distance: '0.4 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-04-18', price: 7800000, event: 'Listed' }
    ],
    createdAt: '2026-04-18'
  },
  {
    id: 'prop-4',
    title: 'Skyline Penthouse at Tribeca Towers',
    price: 12500,
    rentPeriod: 'month',
    listingType: 'rent',
    propertyType: 'Penthouse',
    address: '105 Hudson St PH-A',
    city: 'New York',
    state: 'NY',
    zipCode: '10013',
    lat: 40.7191,
    lng: -74.0083,
    beds: 3,
    baths: 3.5,
    sqft: 2900,
    yearBuilt: 2020,
    pricePerSqFt: 1448,
    hoaFeePerMonth: 1200,
    estMonthlyTax: 3800,
    estInsurance: 350,
    description: 'Fully furnished ultra-luxury Penthouse with 360-degree views of Manhattan skyline and Hudson River. Private key elevator entrance, 14ft ceiling heights, wood burning fireplace, and 800 sq ft private landscaped roof terrace.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Waterfront', 'Gym', 'Concierge', 'Rooftop Deck', 'AC', 'Hardwood Floors', 'Smart Home'],
    isFeatured: true,
    agent: {
      id: 'agent-4',
      name: 'David Sterling',
      agency: 'Douglas Elliman Manhattan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      phone: '(212) 400-8812',
      email: 'd.sterling@elliman.com',
      rating: 4.95,
      reviewsCount: 95,
      responseTime: 'Under 15 mins',
      listingsCount: 15
    },
    neighborhood: {
      walkScore: 100,
      transitScore: 100,
      bikeScore: 92,
      safetyRating: 'A+',
      nearbySchools: [
        { name: 'PS 234 Independence School', type: 'Public', grades: 'K-5', rating: 10, distance: '0.2 mi' }
      ],
      topSpots: [
        { category: 'Parks', name: 'Hudson River Park', distance: '0.2 mi' },
        { category: 'Culture', name: 'Tribeca Film Center', distance: '0.1 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-06-20', price: 12500, event: 'Listed' }
    ],
    createdAt: '2026-06-20'
  },
  {
    id: 'prop-5',
    title: 'Austin Modern Hillside Retreat',
    price: 1420000,
    listingType: 'sale',
    propertyType: 'Single Family',
    address: '3209 Mount Bonnell Rd',
    city: 'Austin',
    state: 'TX',
    zipCode: '78731',
    lat: 30.3218,
    lng: -97.7735,
    beds: 4,
    baths: 3.5,
    sqft: 3400,
    lotSizeSqFt: 11000,
    yearBuilt: 2023,
    pricePerSqFt: 417,
    hoaFeePerMonth: 0,
    estMonthlyTax: 1400,
    estInsurance: 220,
    description: 'Contemporary eco-luxury residence nestled in West Austin. Features solar panels, zero-edge pool overlooking Lake Austin, custom oak millwork, smart climate automation, and chef\'s outdoor kitchen with smoker and pizza oven.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Pool', 'Solar', 'Smart Home', 'Garage', 'Garden', 'EV Charger', 'AC'],
    isFeatured: false,
    isHot: true,
    agent: {
      id: 'agent-5',
      name: 'Samantha Hayes',
      agency: 'Kuper Sotheby\'s Austin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      phone: '(512) 789-9022',
      email: 'samantha.hayes@sothebys.com',
      rating: 4.89,
      reviewsCount: 48,
      responseTime: 'Within 1 hour',
      listingsCount: 10
    },
    neighborhood: {
      walkScore: 68,
      transitScore: 45,
      bikeScore: 70,
      safetyRating: 'A+',
      nearbySchools: [
        { name: 'Casis Elementary', type: 'Public', grades: 'K-5', rating: 9, distance: '1.0 mi' },
        { name: 'Austin High School', type: 'Public', grades: '9-12', rating: 8, distance: '2.8 mi' }
      ],
      topSpots: [
        { category: 'Viewpoint', name: 'Mount Bonnell Lookout', distance: '0.1 mi' },
        { category: 'Boating', name: 'Lake Austin Park', distance: '0.5 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-05-02', price: 1420000, event: 'Listed' }
    ],
    createdAt: '2026-05-02'
  },
  {
    id: 'prop-6',
    title: 'Emerald Bay Luxury Modern Villa',
    price: 4900000,
    listingType: 'sale',
    propertyType: 'Single Family',
    address: '142 Bellevue Way NE',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98004',
    lat: 47.6101,
    lng: -122.2015,
    beds: 5,
    baths: 5.5,
    sqft: 5200,
    lotSizeSqFt: 14500,
    yearBuilt: 2022,
    pricePerSqFt: 942,
    hoaFeePerMonth: 200,
    estMonthlyTax: 4200,
    estInsurance: 480,
    description: 'Pacific Northwest luxury residence in downtown Bellevue with private dock access on Lake Washington. Covered heated loggia, double-sided gas fireplaces, temperature controlled wine display, and spa sanctuary bathrooms.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Waterfront', 'Smart Home', 'Garage', 'Wine Cellar', 'Garden', 'AC', 'EV Charger'],
    isFeatured: true,
    agent: {
      id: 'agent-1',
      name: 'Victoria Vance',
      agency: 'Sotheby\'s International Realty',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      phone: '(415) 890-3211',
      email: 'v.vance@sothebysrealty.sf',
      rating: 4.98,
      reviewsCount: 84,
      responseTime: 'Under 15 mins',
      listingsCount: 18
    },
    neighborhood: {
      walkScore: 88,
      transitScore: 78,
      bikeScore: 80,
      safetyRating: 'A+',
      nearbySchools: [
        { name: 'Medina Elementary', type: 'Public', grades: 'K-5', rating: 10, distance: '0.8 mi' },
        { name: 'Bellevue High School', type: 'Public', grades: '9-12', rating: 10, distance: '1.2 mi' }
      ],
      topSpots: [
        { category: 'Shopping', name: 'Bellevue Square', distance: '0.4 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-03-12', price: 4900000, event: 'Listed' }
    ],
    createdAt: '2026-03-12'
  },
  {
    id: 'prop-7',
    title: 'Miami Beach Waterfront Island Oasis',
    price: 6500000,
    listingType: 'sale',
    propertyType: 'Luxury Villa',
    address: '420 Star Island Dr',
    city: 'Miami',
    state: 'FL',
    zipCode: '33139',
    lat: 25.7781,
    lng: -80.1508,
    beds: 6,
    baths: 7,
    sqft: 6400,
    lotSizeSqFt: 18000,
    yearBuilt: 2023,
    pricePerSqFt: 1015,
    hoaFeePerMonth: 600,
    estMonthlyTax: 5800,
    estInsurance: 850,
    description: 'Gated tropical paradise on exclusive Star Island with 100ft deepwater boat dock. Contemporary minimalist design, glass elevator, saltwater pool with submerged lounger lounge, lush palm gardens, and outdoor summer kitchen.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Pool', 'Waterfront', 'Smart Home', 'Garage', 'Garden', 'AC', 'EV Charger', 'Gym'],
    isFeatured: true,
    isHot: true,
    agent: {
      id: 'agent-3',
      name: 'Elena Rostova',
      agency: 'The Agency Malibu & Miami',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      phone: '(305) 902-8811',
      email: 'elena.miami@theagency.com',
      rating: 5.0,
      reviewsCount: 110,
      responseTime: 'Under 10 mins',
      listingsCount: 24
    },
    neighborhood: {
      walkScore: 82,
      transitScore: 60,
      bikeScore: 85,
      safetyRating: 'A+',
      nearbySchools: [
        { name: 'South Pointe Elementary', type: 'Public', grades: 'K-5', rating: 9, distance: '1.5 mi' }
      ],
      topSpots: [
        { category: 'Dining', name: 'Carbone Miami', distance: '1.2 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-06-10', price: 6500000, event: 'Listed' }
    ],
    createdAt: '2026-06-10'
  },
  {
    id: 'prop-8',
    title: 'Modern Townhome at Historic Georgetown',
    price: 3800,
    rentPeriod: 'month',
    listingType: 'rent',
    propertyType: 'Townhouse',
    address: '3104 O St NW',
    city: 'Washington',
    state: 'DC',
    zipCode: '20007',
    lat: 38.9082,
    lng: -77.0612,
    beds: 3,
    baths: 2.5,
    sqft: 2100,
    yearBuilt: 2018,
    pricePerSqFt: 595,
    hoaFeePerMonth: 150,
    estMonthlyTax: 1100,
    estInsurance: 180,
    description: 'Charming renovated brick townhome nestled on a quiet tree-lined cobblestone avenue in historic Georgetown. Private rear courtyard, exposed brick walls, updated chef\'s kitchen with marble waterfall island, and built-in library.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Garden', 'AC', 'Hardwood Floors', 'Smart Home', 'Balcony'],
    isFeatured: false,
    agent: {
      id: 'agent-2',
      name: 'Marcus Thorne',
      agency: 'Compass Capital',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      phone: '(202) 880-1299',
      email: 'm.thorne@compass.com',
      rating: 4.92,
      reviewsCount: 62,
      responseTime: 'Within 30 mins',
      listingsCount: 12
    },
    neighborhood: {
      walkScore: 98,
      transitScore: 85,
      bikeScore: 88,
      safetyRating: 'A+',
      nearbySchools: [
        { name: 'Hyde-Addison Elementary', type: 'Public', grades: 'K-5', rating: 9, distance: '0.3 mi' }
      ],
      topSpots: [
        { category: 'Dining', name: 'M street dining strip', distance: '0.2 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-06-28', price: 3800, event: 'Listed' }
    ],
    createdAt: '2026-06-28'
  },
  {
    id: 'prop-9',
    title: 'Aspen Mountain Alpine Chalet',
    price: 8900000,
    listingType: 'sale',
    propertyType: 'Single Family',
    address: '710 S Mill St',
    city: 'Aspen',
    state: 'CO',
    zipCode: '81611',
    lat: 39.1882,
    lng: -106.8236,
    beds: 5,
    baths: 6,
    sqft: 5100,
    lotSizeSqFt: 9800,
    yearBuilt: 2021,
    pricePerSqFt: 1745,
    hoaFeePerMonth: 0,
    estMonthlyTax: 8100,
    estInsurance: 920,
    description: 'Ski-in / ski-out luxury chalet at the base of Aspen Mountain. Radiant heated stone floors, floor-to-ceiling mountain view windows, heated driveway, outdoor hot tub overlooking slopes, and dedicated ski equipment locker room.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Smart Home', 'Garage', 'Garden', 'AC', 'Hardwood Floors', 'Wine Cellar'],
    isFeatured: true,
    agent: {
      id: 'agent-4',
      name: 'David Sterling',
      agency: 'Douglas Elliman Aspen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      phone: '(970) 925-1100',
      email: 'd.sterling@elliman.com',
      rating: 4.95,
      reviewsCount: 95,
      responseTime: 'Under 15 mins',
      listingsCount: 15
    },
    neighborhood: {
      walkScore: 92,
      transitScore: 70,
      bikeScore: 85,
      safetyRating: 'A+',
      nearbySchools: [
        { name: 'Aspen Elementary', type: 'Public', grades: 'K-4', rating: 9, distance: '1.1 mi' }
      ],
      topSpots: [
        { category: 'Skiing', name: 'Aspen Mountain Gondola', distance: '0.1 mi' }
      ]
    },
    priceHistory: [
      { date: '2026-02-14', price: 8900000, event: 'Listed' }
    ],
    createdAt: '2026-02-14'
  }
];

export const ALL_AMENITIES_LIST = [
  'Pool',
  'Waterfront',
  'Smart Home',
  'Garage',
  'Garden',
  'AC',
  'Wine Cellar',
  'Hardwood Floors',
  'EV Charger',
  'Gym',
  'Concierge',
  'Balcony',
  'Rooftop Deck',
  'Solar'
];

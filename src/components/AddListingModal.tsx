import React, { useState } from 'react';
import { X, Building2, MapPin, DollarSign, Bed, Bath, Square, Sparkles, PlusCircle } from 'lucide-react';
import { Property, PropertyType, ListingType } from '../types';
import { ALL_AMENITIES_LIST } from '../data/mockProperties';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (property: Property) => void;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  onAddProperty
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [propertyType, setPropertyType] = useState<PropertyType>('Single Family');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('CA');
  const [zipCode, setZipCode] = useState('');
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState(1800);
  const [yearBuilt, setYearBuilt] = useState(2022);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Smart Home', 'Garage', 'AC']);
  const [agentName, setAgentName] = useState('You (Owner / Listing Agent)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !address || !city) return;

    // Approximate coords for user listed items near SF area if unknown
    const newProp: Property = {
      id: `prop-custom-${Date.now()}`,
      title,
      price: Number(price),
      listingType,
      propertyType,
      address,
      city,
      state,
      zipCode: zipCode || '94102',
      lat: 37.7749 + (Math.random() - 0.5) * 0.08,
      lng: -122.4194 + (Math.random() - 0.5) * 0.08,
      beds,
      baths,
      sqft,
      yearBuilt,
      pricePerSqFt: Math.round(Number(price) / (sqft || 1)),
      description: description || 'Beautiful property listing posted by owner.',
      images: [
        imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: selectedAmenities,
      isFeatured: false,
      agent: {
        id: `agent-user-${Date.now()}`,
        name: agentName,
        agency: 'Direct Listing',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        phone: '(555) 019-2831',
        email: 'seller@estatevue.com',
        rating: 5.0,
        reviewsCount: 1,
        responseTime: 'Instant',
        listingsCount: 1
      },
      neighborhood: {
        walkScore: 85,
        transitScore: 80,
        bikeScore: 78,
        safetyRating: 'A',
        nearbySchools: [
          { name: 'Local Community School', type: 'Public', grades: 'K-8', rating: 9, distance: '0.5 mi' }
        ],
        topSpots: [
          { category: 'Parks', name: 'Neighborhood Park', distance: '0.3 mi' }
        ]
      },
      priceHistory: [
        { date: new Date().toISOString().split('T')[0], price: Number(price), event: 'Listed' }
      ],
      createdAt: new Date().toISOString()
    };

    onAddProperty(newProp);
    onClose();
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3E3C38]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E8E6E1] overflow-hidden max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#3E3C38] text-white flex items-center justify-between border-b border-[#3E3C38]">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#8A9A5B]" />
            <h3 className="font-serif font-bold text-lg">Post Your Property Listing</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#4A4844] hover:bg-[#5C5A55] text-[#E8E6E1] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div>
            <label className="text-xs font-bold text-[#3E3C38] block mb-1">Property Title *</label>
            <input
              type="text"
              placeholder="e.g. Modern Sunset Luxury Penthouse"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">Listing Type</label>
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value as ListingType)}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">Price ($) *</label>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              >
                <option value="Single Family">Single Family</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Luxury Villa">Luxury Villa</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">Street Address *</label>
              <input
                type="text"
                placeholder="123 Ocean Blvd"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">City *</label>
              <input
                type="text"
                placeholder="San Francisco"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">ZIP Code</label>
              <input
                type="text"
                placeholder="94105"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">Beds</label>
              <input
                type="number"
                min={1}
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">Baths</label>
              <input
                type="number"
                min={1}
                step={0.5}
                value={baths}
                onChange={(e) => setBaths(Number(e.target.value))}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">Sq Ft</label>
              <input
                type="number"
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#3E3C38] block mb-1">Year Built</label>
              <input
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(Number(e.target.value))}
                className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#3E3C38] block mb-1">Photo Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#3E3C38] block mb-1">Description</label>
            <textarea
              placeholder="Highlight special features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2.5 text-xs text-[#3E3C38] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#3E3C38] block mb-2">Amenities</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_AMENITIES_LIST.map((am) => {
                const checked = selectedAmenities.includes(am);
                return (
                  <button
                    key={am}
                    type="button"
                    onClick={() => toggleAmenity(am)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      checked
                        ? 'bg-[#5C6B4E] border-[#5C6B4E] text-white'
                        : 'bg-[#F3F1ED] border-[#E8E6E1] text-[#3E3C38] hover:bg-[#E8E6E1]'
                    }`}
                  >
                    {am}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E6E1] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#8C8A85] hover:text-[#3E3C38]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Listing</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

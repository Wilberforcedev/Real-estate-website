import React, { useState } from 'react';
import { 
  Heart, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  PhoneCall, 
  Eye, 
  CheckCircle2 
} from 'lucide-react';
import { Property } from '../types';

interface ListingCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenDetailModal: (property: Property) => void;
  onQuickScheduleTour: (property: Property) => void;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  onOpenDetailModal,
  onQuickScheduleTour,
  isHovered,
  onHover
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const formattedPrice = property.listingType === 'rent'
    ? `$${property.price.toLocaleString()}/mo`
    : `$${property.price.toLocaleString()}`;

  return (
    <div
      onClick={() => onOpenDetailModal(property)}
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
        isHovered
          ? 'border-[#8A9A5B] shadow-xl ring-2 ring-[#8A9A5B]/20 -translate-y-1'
          : 'border-[#E8E6E1] shadow-xs hover:shadow-md hover:border-[#8A9A5B]/50'
      }`}
    >
      {/* Photo Gallery Box */}
      <div className="relative aspect-4/3 w-full bg-[#3E3C38] overflow-hidden">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3E3C38]/80 via-transparent to-[#3E3C38]/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs ${
            property.listingType === 'rent' ? 'bg-[#8A9A5B]' : 'bg-[#5C6B4E]'
          }`}>
            For {property.listingType === 'rent' ? 'Rent' : 'Sale'}
          </span>

          <span className="bg-[#3E3C38]/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-xs border border-white/20">
            <Sparkles className="w-3 h-3 text-[#8A9A5B]" /> 3D Tour & Video
          </span>

          {property.isHot && (
            <span className="bg-[#D98E73] text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
              🔥 Hot
            </span>
          )}

          {property.openHouse && (
            <span className="bg-[#3E3C38] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-xs border border-[#E8E6E1]/20">
              <Calendar className="w-3 h-3" /> Open House
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-white text-[#D98E73] shadow-md scale-110'
              : 'bg-[#3E3C38]/50 hover:bg-[#3E3C38]/80 text-white hover:text-[#D98E73]'
          }`}
          title={isFavorite ? 'Remove from Saved' : 'Save Property'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D98E73]' : ''}`} />
        </button>

        {/* Image Arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#3E3C38]/50 hover:bg-[#3E3C38]/80 text-white opacity-0 group-hover:opacity-100 transition-all z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#3E3C38]/50 hover:bg-[#3E3C38]/80 text-white opacity-0 group-hover:opacity-100 transition-all z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {property.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Bottom Price Tag inside photo */}
        <div className="absolute bottom-3 left-3 text-white z-10">
          <span className="font-serif text-2xl font-bold tracking-tight text-white drop-shadow-md">
            {formattedPrice}
          </span>
          {property.pricePerSqFt > 0 && (
            <span className="text-[11px] text-[#E8E6E1] block font-medium drop-shadow-xs">
              ${property.pricePerSqFt}/sqft
            </span>
          )}
        </div>
      </div>

      {/* Listing Content Details */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#5C6B4E] uppercase tracking-wider mb-1">
            <span>{property.propertyType}</span>
            <span className="text-[#8C8A85] font-normal">Built {property.yearBuilt}</span>
          </div>

          <h3 className="font-serif font-bold text-[#3E3C38] text-base leading-snug line-clamp-1 group-hover:text-[#5C6B4E] transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-[#8C8A85] text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#8C8A85] shrink-0" />
            <span className="truncate">{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>

        {/* Specs Pill bar */}
        <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-[#E8E6E1] text-xs font-semibold text-[#3E3C38]">
          <div className="flex items-center gap-1.5 justify-center bg-[#F3F1ED] py-1.5 rounded-xl">
            <Bed className="w-4 h-4 text-[#5C6B4E]" />
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-[#F3F1ED] py-1.5 rounded-xl">
            <Bath className="w-4 h-4 text-[#5C6B4E]" />
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-[#F3F1ED] py-1.5 rounded-xl">
            <Square className="w-3.5 h-3.5 text-[#5C6B4E]" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Agent mini footer + Tour CTA */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-[#E8E6E1]"
            />
            <div className="text-[11px]">
              <span className="font-bold text-[#3E3C38] block truncate max-w-[100px]">{property.agent.name}</span>
              <span className="text-[#8C8A85] text-[10px] truncate block">{property.agent.agency}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickScheduleTour(property);
            }}
            className="bg-[#5C6B4E] hover:bg-[#4A573F] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Tour</span>
          </button>
        </div>
      </div>
    </div>
  );
};

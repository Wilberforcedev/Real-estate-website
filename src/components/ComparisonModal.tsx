import React from 'react';
import { X, Check, Minus, Building2, Bed, Bath, Square, DollarSign, MapPin } from 'lucide-react';
import { Property } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onOpenDetailModal: (property: Property) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onOpenDetailModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#3E3C38]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-3xl max-w-5xl w-full shadow-2xl border border-[#E8E6E1] overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#3E3C38] text-white flex items-center justify-between border-b border-[#3E3C38]">
          <div>
            <h3 className="font-serif font-bold text-lg">Compare Saved Homes</h3>
            <p className="text-xs text-[#E8E6E1]">Comparing {savedProperties.length} saved properties side-by-side</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#4A4844] hover:bg-[#5C5A55] text-[#E8E6E1] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Content */}
        <div className="flex-1 overflow-x-auto p-6">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E8E6E1]">
                <th className="py-3 px-4 font-bold text-xs uppercase text-[#8C8A85] w-40">Features</th>
                {savedProperties.map((prop) => (
                  <th key={prop.id} className="py-3 px-4 min-w-[200px]">
                    <div className="space-y-2">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-28 object-cover rounded-xl cursor-pointer hover:opacity-90"
                        onClick={() => {
                          onClose();
                          onOpenDetailModal(prop);
                        }}
                      />
                      <h4 className="font-bold text-xs text-[#3E3C38] line-clamp-1">{prop.title}</h4>
                      <p className="font-serif font-extrabold text-sm text-[#5C6B4E]">
                        ${prop.price.toLocaleString()}{prop.listingType === 'rent' ? '/mo' : ''}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E6E1] text-xs">
              <tr>
                <td className="py-3 px-4 font-bold text-[#8C8A85]">Property Type</td>
                {savedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 font-semibold text-[#3E3C38]">{p.propertyType}</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#8C8A85]">Location</td>
                {savedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 font-semibold text-[#3E3C38]">{p.city}, {p.state}</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#8C8A85]">Beds / Baths</td>
                {savedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 font-semibold text-[#3E3C38]">{p.beds} beds / {p.baths} baths</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#8C8A85]">Square Footage</td>
                {savedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 font-semibold text-[#3E3C38]">{p.sqft.toLocaleString()} sqft</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#8C8A85]">Price / SqFt</td>
                {savedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 font-semibold text-[#3E3C38]">${p.pricePerSqFt}</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#8C8A85]">Year Built</td>
                {savedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 font-semibold text-[#3E3C38]">{p.yearBuilt}</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#8C8A85]">Walk Score</td>
                {savedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 font-bold text-[#5C6B4E]">{p.neighborhood.walkScore} / 100</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#8C8A85]">Listing Agent</td>
                {savedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 font-semibold text-[#3E3C38]">
                    <div className="flex items-center gap-1.5">
                      <img src={p.agent.avatar} className="w-5 h-5 rounded-full object-cover" />
                      <span>{p.agent.name}</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

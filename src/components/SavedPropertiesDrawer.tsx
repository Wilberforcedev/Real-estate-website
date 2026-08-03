import React from 'react';
import { X, Trash2, ExternalLink, SlidersHorizontal, ArrowRight, Heart } from 'lucide-react';
import { Property } from '../types';

interface SavedPropertiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemoveSaved: (propertyId: string) => void;
  onOpenDetailModal: (property: Property) => void;
  onOpenComparisonModal: () => void;
}

export const SavedPropertiesDrawer: React.FC<SavedPropertiesDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemoveSaved,
  onOpenDetailModal,
  onOpenComparisonModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#3E3C38]/60 backdrop-blur-xs flex justify-end">
      <div className="bg-[#FAF9F6] w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#3E3C38] text-white flex items-center justify-between border-b border-[#3E3C38]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D98E73] fill-[#D98E73]" />
            <h3 className="font-serif font-bold text-lg">Saved Properties ({savedProperties.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#4A4844] hover:bg-[#5C5A55] text-[#E8E6E1] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#8C8A85]">
              <Heart className="w-12 h-12 stroke-[1.5] text-[#8C8A85] mb-3" />
              <p className="font-bold text-[#3E3C38] text-sm">No Saved Properties Yet</p>
              <p className="text-xs text-[#8C8A85] mt-1">Click the heart icon on any listing to save it for quick access and comparison.</p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-[#F3F1ED] rounded-2xl p-3 border border-[#E8E6E1] flex items-center gap-3 hover:border-[#8C8A85] transition-all group"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => onOpenDetailModal(prop)}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#5C6B4E] uppercase tracking-wider block">
                    ${prop.price.toLocaleString()}{prop.listingType === 'rent' ? '/mo' : ''}
                  </span>
                  <h4 
                    onClick={() => onOpenDetailModal(prop)}
                    className="font-bold text-xs text-[#3E3C38] truncate cursor-pointer hover:text-[#5C6B4E]"
                  >
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-[#8C8A85] truncate">{prop.city}, {prop.state}</p>
                  <p className="text-[10px] font-semibold text-[#3E3C38]/80 mt-1">
                    {prop.beds} bds • {prop.baths} ba • {prop.sqft.toLocaleString()} sqft
                  </p>
                </div>
                <button
                  onClick={() => onRemoveSaved(prop.id)}
                  className="p-2 text-[#8C8A85] hover:text-[#D98E73] hover:bg-[#D98E73]/10 rounded-xl transition-all shrink-0"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {savedProperties.length > 0 && (
          <div className="p-4 bg-[#F3F1ED] border-t border-[#E8E6E1] space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenComparisonModal();
              }}
              className="w-full bg-[#5C6B4E] hover:bg-[#4A573F] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8A9A5B]" />
              <span>Compare Saved Homes Side-by-Side</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

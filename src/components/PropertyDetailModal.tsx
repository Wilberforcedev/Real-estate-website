import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Check, 
  Calculator, 
  School, 
  Compass, 
  ShieldCheck, 
  DollarSign, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Video, 
  UserCheck,
  Search,
  ExternalLink,
  Loader2,
  Globe,
  RefreshCw,
  Bot
} from 'lucide-react';
import { Property, TourBooking, AgentInquiry } from '../types';
import { PropertyAiChatbot } from './PropertyAiChatbot';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
  onScheduleTourSubmit: (booking: TourBooking) => void;
  onAgentInquirySubmit: (inquiry: AgentInquiry) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  onScheduleTourSubmit,
  onAgentInquirySubmit
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'neighborhood' | 'history' | 'ai-chat'>('overview');
  const [activeFormTab, setActiveFormTab] = useState<'tour' | 'question' | 'offer'>('tour');

  // Google Search Grounded Local Area Insights State
  const [localInsights, setLocalInsights] = useState<{ insightText: string; sources: Array<{ title: string; uri: string }> } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const fetchLocalInsights = async () => {
    if (loadingInsights) return;
    setLoadingInsights(true);
    setInsightsError(null);

    try {
      const res = await fetch('/api/local-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: property.address,
          title: property.title,
          city: property.city,
          state: property.state
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLocalInsights({
          insightText: data.insightText,
          sources: data.sources || []
        });
      } else {
        setInsightsError(data.error || 'Unable to fetch Google Search insights for this location.');
      }
    } catch (err: any) {
      setInsightsError('Could not connect to local search service.');
    } finally {
      setLoadingInsights(false);
    }
  };

  // Automatically fetch Google Search insights whenever property detail modal opens
  useEffect(() => {
    setLocalInsights(null);
    setInsightsError(null);
    fetchLocalInsights();
  }, [property.id]);

  // Tour Form State
  const [tourType, setTourType] = useState<'in-person' | 'video'>('in-person');
  const [tourDate, setTourDate] = useState('2026-08-10');
  const [tourTimeSlot, setTourTimeSlot] = useState('11:00 AM');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [tourNotes, setTourNotes] = useState('');
  const [isSubmittedTour, setIsSubmittedTour] = useState(false);

  // Question Form State
  const [questionPreset, setQuestionPreset] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [isSubmittedQuestion, setIsSubmittedQuestion] = useState(false);

  // Mortgage Calculator State
  const [calcPrice, setCalcPrice] = useState(property.price);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  // Math calculation for mortgage
  const downPaymentAmount = (calcPrice * downPaymentPct) / 100;
  const loanPrincipal = calcPrice - downPaymentAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  
  const monthlyPrincipalAndInterest = monthlyInterestRate > 0
    ? (loanPrincipal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments))) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)
    : loanPrincipal / totalPayments;

  const monthlyTax = (property.estMonthlyTax || (calcPrice * 0.012) / 12);
  const monthlyInsurance = (property.estInsurance || 200);
  const monthlyHoa = (property.hoaFeePerMonth || 0);

  const totalMonthlyPayment = Math.round(monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + monthlyHoa);

  const handleTourFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPhone) return;

    const booking: TourBooking = {
      id: `tour-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      agentName: property.agent.name,
      tourType,
      date: tourDate,
      timeSlot: tourTimeSlot,
      userName,
      userEmail,
      userPhone,
      notes: tourNotes,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    onScheduleTourSubmit(booking);
    setIsSubmittedTour(true);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg = questionPreset ? `${questionPreset}\n\n${questionText}` : questionText;
    if (!userName || !userEmail || !finalMsg) return;

    const inquiry: AgentInquiry = {
      id: `inquiry-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      agentName: property.agent.name,
      inquiryType: 'question',
      message: finalMsg,
      userName,
      userEmail,
      userPhone,
      createdAt: new Date().toISOString()
    };

    onAgentInquirySubmit(inquiry);
    setIsSubmittedQuestion(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Listing link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3E3C38]/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-[#E8E6E1] overflow-hidden max-h-[94vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#3E3C38] text-white flex items-center justify-between shrink-0 border-b border-[#3E3C38]">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${
              property.listingType === 'rent' ? 'bg-[#8A9A5B]' : 'bg-[#5C6B4E]'
            }`}>
              For {property.listingType === 'rent' ? 'Rent' : 'Sale'}
            </span>
            <span className="text-xs text-[#E8E6E1] font-medium hidden sm:inline">MLS ID: #{property.id.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-[#4A4844] hover:bg-[#5C5A55] text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isFavorite
                  ? 'bg-[#D98E73] text-white'
                  : 'bg-[#4A4844] hover:bg-[#5C5A55] text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#4A4844] hover:bg-[#5C5A55] text-[#E8E6E1] hover:text-white transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-8 bg-[#FAF9F6]">
          
          {/* Hero Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative h-72 sm:h-96 rounded-2xl overflow-hidden group">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3E3C38]/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                  ${property.price.toLocaleString()}
                  {property.listingType === 'rent' && <span className="text-lg font-sans font-normal text-[#E8E6E1]">/mo</span>}
                </span>
                <p className="text-xs text-[#E8E6E1] flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#8A9A5B]" />
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 h-72 sm:h-96">
              {property.images.slice(1, 3).map((img, idx) => (
                <div key={idx} className="relative h-full rounded-2xl overflow-hidden group">
                  <img
                    src={img}
                    alt={`Property interior ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Key Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-[#F3F1ED] p-3.5 rounded-2xl border border-[#E8E6E1] text-center">
              <Bed className="w-5 h-5 text-[#5C6B4E] mx-auto mb-1" />
              <span className="text-base font-extrabold text-[#3E3C38] block">{property.beds}</span>
              <span className="text-[11px] font-bold text-[#8C8A85] uppercase">Bedrooms</span>
            </div>
            <div className="bg-[#F3F1ED] p-3.5 rounded-2xl border border-[#E8E6E1] text-center">
              <Bath className="w-5 h-5 text-[#5C6B4E] mx-auto mb-1" />
              <span className="text-base font-extrabold text-[#3E3C38] block">{property.baths}</span>
              <span className="text-[11px] font-bold text-[#8C8A85] uppercase">Bathrooms</span>
            </div>
            <div className="bg-[#F3F1ED] p-3.5 rounded-2xl border border-[#E8E6E1] text-center">
              <Square className="w-5 h-5 text-[#5C6B4E] mx-auto mb-1" />
              <span className="text-base font-extrabold text-[#3E3C38] block">{property.sqft.toLocaleString()}</span>
              <span className="text-[11px] font-bold text-[#8C8A85] uppercase">Sq Ft</span>
            </div>
            <div className="bg-[#F3F1ED] p-3.5 rounded-2xl border border-[#E8E6E1] text-center">
              <DollarSign className="w-5 h-5 text-[#5C6B4E] mx-auto mb-1" />
              <span className="text-base font-extrabold text-[#3E3C38] block">${property.pricePerSqFt}</span>
              <span className="text-[11px] font-bold text-[#8C8A85] uppercase">Price / SqFt</span>
            </div>
            <div className="bg-[#F3F1ED] p-3.5 rounded-2xl border border-[#E8E6E1] text-center">
              <Calendar className="w-5 h-5 text-[#5C6B4E] mx-auto mb-1" />
              <span className="text-base font-extrabold text-[#3E3C38] block">{property.yearBuilt}</span>
              <span className="text-[11px] font-bold text-[#8C8A85] uppercase">Year Built</span>
            </div>
            <div className="bg-[#F3F1ED] p-3.5 rounded-2xl border border-[#E8E6E1] text-center">
              <Calculator className="w-5 h-5 text-[#5C6B4E] mx-auto mb-1" />
              <span className="text-base font-extrabold text-[#3E3C38] block">${totalMonthlyPayment.toLocaleString()}/mo</span>
              <span className="text-[11px] font-bold text-[#8C8A85] uppercase">Est Payment</span>
            </div>
          </div>

          {/* Two-Column Layout: Main Details vs Integrated Agent Contact Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Details & Tabs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Navigation Tabs */}
              <div className="flex border-b border-[#E8E6E1] gap-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'overview'
                      ? 'border-[#5C6B4E] text-[#5C6B4E]'
                      : 'border-transparent text-[#8C8A85] hover:text-[#3E3C38]'
                  }`}
                >
                  Overview & Amenities
                </button>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'calculator'
                      ? 'border-[#5C6B4E] text-[#5C6B4E]'
                      : 'border-transparent text-[#8C8A85] hover:text-[#3E3C38]'
                  }`}
                >
                  Mortgage Calculator
                </button>
                <button
                  onClick={() => setActiveTab('neighborhood')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === 'neighborhood'
                      ? 'border-[#5C6B4E] text-[#5C6B4E]'
                      : 'border-transparent text-[#8C8A85] hover:text-[#3E3C38]'
                  }`}
                >
                  Neighborhood & Schools
                </button>
                <button
                  onClick={() => setActiveTab('ai-chat')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'ai-chat'
                      ? 'border-[#5C6B4E] text-[#5C6B4E]'
                      : 'border-transparent text-[#8C8A85] hover:text-[#3E3C38]'
                  }`}
                >
                  <Bot className="w-4 h-4 text-[#8A9A5B]" />
                  <span>AI Assistant</span>
                  <span className="bg-[#8A9A5B]/20 text-[#5C6B4E] text-[10px] font-black px-1.5 py-0.5 rounded-full">AI</span>
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* PROMINENT VIRTUAL TOUR & VIDEO WALKTHROUGH SECTION */}
                  <div className="bg-white rounded-2xl p-5 border border-[#E8E6E1] shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#5C6B4E] text-white flex items-center justify-center">
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#3E3C38]">Interactive 3D Virtual Tour & Video Walkthrough</h3>
                          <p className="text-[11px] text-[#8C8A85]">High-definition video tour and 3D space navigation</p>
                        </div>
                      </div>
                      <span className="bg-[#8A9A5B]/15 text-[#5C6B4E] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#8A9A5B]/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#5C6B4E]" /> 3D Guided
                      </span>
                    </div>

                    {/* Embedded Video / Interactive Player Simulation */}
                    <div className="relative rounded-2xl overflow-hidden bg-[#3E3C38] aspect-video group shadow-md border border-[#3E3C38]">
                      {/* Video / Tour Background Frame */}
                      <img
                        src={property.images[1] || property.images[0]}
                        alt="3D Virtual Tour Preview"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3E3C38] via-[#3E3C38]/40 to-transparent flex flex-col justify-between p-4 sm:p-6">
                        
                        {/* Top Badges */}
                        <div className="flex items-center justify-between">
                          <span className="bg-[#3E3C38]/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                            Matterport 3D Tour & HD Video
                          </span>
                          <span className="bg-[#8A9A5B] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                            4K Ultra HD
                          </span>
                        </div>

                        {/* Center Play / Launch Button */}
                        <div className="text-center my-auto">
                          <a
                            href={property.virtualTourUrl || 'https://my.matterport.com/show/?m=sample123'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5C6B4E] hover:bg-[#4A573F] text-white shadow-2xl transition-all duration-300 hover:scale-110 ring-4 ring-white/30"
                            title="Launch Full 3D Walkthrough"
                          >
                            <Video className="w-7 h-7 fill-white ml-0.5" />
                          </a>
                          <p className="text-xs font-bold text-white mt-2 drop-shadow-md">Click to Experience Full 3D Walkthrough</p>
                        </div>

                        {/* Bottom Info */}
                        <div className="flex items-center justify-between text-xs text-white/90">
                          <span className="font-semibold text-white">Full Interior & Floor Plan Tour</span>
                          <a
                            href={property.virtualTourUrl || 'https://my.matterport.com/show/?m=sample123'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8A9A5B] hover:text-white underline font-bold"
                          >
                            Open in New Tab ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI PROPERTY ASSISTANT INTEGRATED CARD */}
                  <PropertyAiChatbot property={property} />

                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#3E3C38] mb-2">Property Description</h3>
                    <p className="text-sm text-[#3E3C38]/80 leading-relaxed">{property.description}</p>
                  </div>

                  {/* Amenities Checklist Grid */}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#3E3C38] mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8A9A5B]" />
                      Key Amenities & Features
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {property.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2 bg-[#F3F1ED] border border-[#E8E6E1] p-2.5 rounded-xl text-xs font-semibold text-[#3E3C38]">
                          <CheckCircle2 className="w-4 h-4 text-[#5C6B4E] shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Overview */}
                  <div className="bg-[#F3F1ED] p-4 rounded-2xl border border-[#E8E6E1] space-y-2">
                    <h4 className="font-bold text-xs text-[#3E3C38] uppercase tracking-wider mb-2">Financial Summary</h4>
                    <div className="flex justify-between text-xs py-1 border-b border-[#E8E6E1]">
                      <span className="text-[#8C8A85]">HOA Fee</span>
                      <span className="font-bold text-[#3E3C38]">${property.hoaFeePerMonth || 0}/mo</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-[#E8E6E1]">
                      <span className="text-[#8C8A85]">Est. Monthly Property Tax</span>
                      <span className="font-bold text-[#3E3C38]">${Math.round(property.estMonthlyTax || 0)}/mo</span>
                    </div>
                    <div className="flex justify-between text-xs py-1">
                      <span className="text-[#8C8A85]">Est. Homeowners Insurance</span>
                      <span className="font-bold text-[#3E3C38]">${property.estInsurance || 0}/mo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MORTGAGE CALCULATOR */}
              {activeTab === 'calculator' && (
                <div className="space-y-6 bg-[#F3F1ED] p-5 rounded-2xl border border-[#E8E6E1]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1]">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#3E3C38]">Interactive Mortgage Estimator</h3>
                      <p className="text-xs text-[#8C8A85]">Calculate estimated monthly principal, interest, tax, and insurance.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#8C8A85] block">Total Monthly</span>
                      <span className="text-2xl font-black text-[#5C6B4E]">${totalMonthlyPayment.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Breakdown Bar */}
                  <div>
                    <div className="h-4 rounded-full overflow-hidden flex bg-[#E8E6E1]">
                      <div style={{ width: `${(monthlyPrincipalAndInterest / totalMonthlyPayment) * 100}%` }} className="bg-[#5C6B4E]" title="Principal & Interest" />
                      <div style={{ width: `${(monthlyTax / totalMonthlyPayment) * 100}%` }} className="bg-[#8A9A5B]" title="Property Tax" />
                      <div style={{ width: `${(monthlyInsurance / totalMonthlyPayment) * 100}%` }} className="bg-[#D98E73]" title="Insurance" />
                      <div style={{ width: `${(monthlyHoa / totalMonthlyPayment) * 100}%` }} className="bg-[#3E3C38]" title="HOA Fee" />
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-[#3E3C38]">
                        <span className="w-3 h-3 rounded-full bg-[#5C6B4E] shrink-0" />
                        <span>P&I: ${Math.round(monthlyPrincipalAndInterest)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#3E3C38]">
                        <span className="w-3 h-3 rounded-full bg-[#8A9A5B] shrink-0" />
                        <span>Tax: ${Math.round(monthlyTax)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#3E3C38]">
                        <span className="w-3 h-3 rounded-full bg-[#D98E73] shrink-0" />
                        <span>Ins: ${Math.round(monthlyInsurance)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#3E3C38]">
                        <span className="w-3 h-3 rounded-full bg-[#3E3C38] shrink-0" />
                        <span>HOA: ${monthlyHoa}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-[#3E3C38] block mb-1">
                        Home Price: ${calcPrice.toLocaleString()}
                      </label>
                      <input
                        type="range"
                        min={100000}
                        max={10000000}
                        step={50000}
                        value={calcPrice}
                        onChange={(e) => setCalcPrice(Number(e.target.value))}
                        className="w-full accent-[#5C6B4E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3E3C38] block mb-1">
                        Down Payment: {downPaymentPct}% (${downPaymentAmount.toLocaleString()})
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={50}
                        step={1}
                        value={downPaymentPct}
                        onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                        className="w-full accent-[#5C6B4E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3E3C38] block mb-1">
                        Interest Rate: {interestRate}%
                      </label>
                      <input
                        type="range"
                        min={3.0}
                        max={10.0}
                        step={0.1}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-[#5C6B4E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3E3C38] block mb-1">
                        Loan Term: {loanTermYears} Years
                      </label>
                      <div className="flex gap-2">
                        {[15, 30].map(term => (
                          <button
                            key={term}
                            onClick={() => setLoanTermYears(term)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                              loanTermYears === term
                                ? 'bg-[#5C6B4E] text-white border-[#5C6B4E]'
                                : 'bg-white text-[#3E3C38] border-[#E8E6E1]'
                            }`}
                          >
                            {term} Years
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NEIGHBORHOOD */}
              {activeTab === 'neighborhood' && (
                <div className="space-y-6">
                  
                  {/* LIVE GOOGLE SEARCH GROUNDED LOCAL AREA INSIGHTS CARD */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#5C6B4E] text-white flex items-center justify-center">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#3E3C38]">Google Search Local Area Insights</h3>
                          <p className="text-[11px] text-[#8C8A85]">Live Google Search analysis for nearby schools, walkability, transit, & amenities</p>
                        </div>
                      </div>

                      <button
                        onClick={fetchLocalInsights}
                        disabled={loadingInsights}
                        className="p-1.5 rounded-xl bg-[#F3F1ED] hover:bg-[#E8E6E1] text-[#3E3C38] transition-all flex items-center gap-1 text-xs font-bold"
                        title="Refresh Search Insights"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingInsights ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                      </button>
                    </div>

                    {loadingInsights ? (
                      <div className="py-8 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-[#5C6B4E] animate-spin mx-auto" />
                        <p className="text-xs font-bold text-[#3E3C38]">Fetching Google Search insights for {property.address}, {property.city}...</p>
                        <p className="text-[11px] text-[#8C8A85]">Analyzing nearby school ratings, walkability scores, transit lines, and local amenities...</p>
                      </div>
                    ) : insightsError ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex justify-between items-center">
                        <span>{insightsError}</span>
                        <button onClick={fetchLocalInsights} className="underline font-bold ml-2">Retry</button>
                      </div>
                    ) : localInsights ? (
                      <div className="space-y-4 text-xs text-[#3E3C38] leading-relaxed">
                        <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E6E1] text-xs space-y-2 whitespace-pre-line font-sans text-[#3E3C38]">
                          {localInsights.insightText}
                        </div>

                        {/* Sources / Citations */}
                        {localInsights.sources.length > 0 && (
                          <div className="pt-3 border-t border-[#E8E6E1] space-y-1.5">
                            <span className="text-[10px] font-bold text-[#8C8A85] uppercase tracking-wider block">Verified Web Search Sources</span>
                            <div className="flex flex-wrap gap-2">
                              {localInsights.sources.map((src, i) => (
                                <a
                                  key={i}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-[#F3F1ED] hover:bg-[#E8E6E1] text-[#5C6B4E] px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border border-[#E8E6E1]"
                                >
                                  <Globe className="w-3 h-3" />
                                  <span className="truncate max-w-[200px]">{src.title}</span>
                                  <ExternalLink className="w-3 h-3 text-[#8C8A85]" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Scores Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#8A9A5B]/15 border border-[#8A9A5B]/30 p-4 rounded-2xl text-center">
                      <span className="text-2xl font-black text-[#5C6B4E] block">{property.neighborhood.walkScore}</span>
                      <span className="text-xs font-bold text-[#5C6B4E]">Walk Score®</span>
                    </div>
                    <div className="bg-[#F3F1ED] border border-[#E8E6E1] p-4 rounded-2xl text-center">
                      <span className="text-2xl font-black text-[#3E3C38] block">{property.neighborhood.transitScore}</span>
                      <span className="text-xs font-bold text-[#3E3C38]">Transit Score®</span>
                    </div>
                    <div className="bg-[#D98E73]/15 border border-[#D98E73]/30 p-4 rounded-2xl text-center">
                      <span className="text-2xl font-black text-[#D98E73] block">{property.neighborhood.bikeScore}</span>
                      <span className="text-xs font-bold text-[#D98E73]">Bike Score®</span>
                    </div>
                  </div>

                  {/* Schools Table */}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#3E3C38] mb-3 flex items-center gap-2">
                      <School className="w-4 h-4 text-[#5C6B4E]" />
                      Assigned & Nearby Schools
                    </h3>
                    <div className="bg-[#F3F1ED] rounded-2xl border border-[#E8E6E1] overflow-hidden divide-y divide-[#E8E6E1]">
                      {property.neighborhood.nearbySchools.map((sch, i) => (
                        <div key={i} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-[#3E3C38] block">{sch.name}</span>
                            <span className="text-[#8C8A85]">{sch.type} • Grades {sch.grades} • {sch.distance}</span>
                          </div>
                          <div className="bg-[#5C6B4E] text-white font-extrabold px-2.5 py-1 rounded-lg">
                            {sch.rating}/10
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: AI CHATBOT ASSISTANT */}
              {activeTab === 'ai-chat' && (
                <div className="space-y-4">
                  <PropertyAiChatbot property={property} />
                </div>
              )}

            </div>

            {/* Right Column: INTEGRATED AGENT CONTACT PANEL (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-6 bg-[#3E3C38] text-white rounded-3xl p-5 shadow-xl border border-[#3E3C38] space-y-5">
                
                {/* Agent Header Card */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#4A4844]">
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#8A9A5B]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-base text-white">{property.agent.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-[#8A9A5B]" />
                    </div>
                    <p className="text-xs text-[#E8E6E1]">{property.agent.agency}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <span className="text-[#D98E73] font-bold">★ {property.agent.rating}</span>
                      <span className="text-[#E8E6E1]/70">({property.agent.reviewsCount} reviews)</span>
                      <span className="text-[#8A9A5B] font-semibold">• {property.agent.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Agent Form Switcher Tabs */}
                <div className="flex bg-[#4A4844] p-1 rounded-xl border border-[#5C5A55]">
                  <button
                    onClick={() => setActiveFormTab('tour')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeFormTab === 'tour'
                        ? 'bg-[#5C6B4E] text-white shadow-xs'
                        : 'text-[#E8E6E1] hover:text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Tour</span>
                  </button>
                  <button
                    onClick={() => setActiveFormTab('question')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeFormTab === 'question'
                        ? 'bg-[#5C6B4E] text-white shadow-xs'
                        : 'text-[#E8E6E1] hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Ask Agent</span>
                  </button>
                </div>

                {/* FORM 1: SCHEDULE TOUR */}
                {activeFormTab === 'tour' && (
                  <div>
                    {isSubmittedTour ? (
                      <div className="bg-[#5C6B4E]/30 border border-[#8A9A5B] p-5 rounded-2xl text-center space-y-2 animate-in fade-in">
                        <CheckCircle2 className="w-10 h-10 text-[#8A9A5B] mx-auto" />
                        <h5 className="font-bold text-white text-base">Tour Request Confirmed!</h5>
                        <p className="text-xs text-[#E8E6E1]">
                          {property.agent.name} will reach out to confirm your {tourType} tour on <strong>{tourDate} at {tourTimeSlot}</strong>.
                        </p>
                        <button
                          onClick={() => setIsSubmittedTour(false)}
                          className="mt-2 text-xs font-bold text-[#8A9A5B] hover:underline"
                        >
                          Book another slot
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleTourFormSubmit} className="space-y-3.5">
                        
                        {/* Tour Type */}
                        <div>
                          <label className="text-[11px] font-bold text-[#E8E6E1]/80 uppercase tracking-wider block mb-1.5">Select Tour Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setTourType('in-person')}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                                tourType === 'in-person'
                                  ? 'bg-[#5C6B4E] text-white border-[#8A9A5B]'
                                  : 'bg-[#4A4844] text-[#E8E6E1] border-[#5C5A55] hover:bg-[#5C5A55]'
                              }`}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>In-Person</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTourType('video')}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                                tourType === 'video'
                                  ? 'bg-[#5C6B4E] text-white border-[#8A9A5B]'
                                  : 'bg-[#4A4844] text-[#E8E6E1] border-[#5C5A55] hover:bg-[#5C5A55]'
                              }`}
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Video Tour</span>
                            </button>
                          </div>
                        </div>

                        {/* Date & Time Slot */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-[#E8E6E1]/80 uppercase tracking-wider block mb-1">Date</label>
                            <input
                              type="date"
                              value={tourDate}
                              onChange={(e) => setTourDate(e.target.value)}
                              className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-[#E8E6E1]/80 uppercase tracking-wider block mb-1">Time Slot</label>
                            <select
                              value={tourTimeSlot}
                              onChange={(e) => setTourTimeSlot(e.target.value)}
                              className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                            >
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="11:30 AM">11:30 AM</option>
                              <option value="1:30 PM">1:30 PM</option>
                              <option value="3:30 PM">3:30 PM</option>
                              <option value="5:00 PM">5:00 PM</option>
                            </select>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div>
                          <input
                            type="text"
                            placeholder="Your Full Name *"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2.5 text-xs text-white placeholder-[#E8E6E1]/60 focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="email"
                            placeholder="Email Address *"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2.5 text-xs text-white placeholder-[#E8E6E1]/60 focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                            required
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number *"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2.5 text-xs text-white placeholder-[#E8E6E1]/60 focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                            required
                          />
                        </div>

                        <textarea
                          placeholder="Special requests or questions for the tour (optional)..."
                          value={tourNotes}
                          onChange={(e) => setTourNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2.5 text-xs text-white placeholder-[#E8E6E1]/60 focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                        />

                        <button
                          type="submit"
                          className="w-full bg-[#5C6B4E] hover:bg-[#4A573F] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Request Private Tour</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* FORM 2: ASK AGENT A QUESTION */}
                {activeFormTab === 'question' && (
                  <div>
                    {isSubmittedQuestion ? (
                      <div className="bg-[#5C6B4E]/30 border border-[#8A9A5B] p-5 rounded-2xl text-center space-y-2 animate-in fade-in">
                        <CheckCircle2 className="w-10 h-10 text-[#8A9A5B] mx-auto" />
                        <h5 className="font-bold text-white text-base">Message Sent to {property.agent.name}!</h5>
                        <p className="text-xs text-[#E8E6E1]">
                          The listing agent has received your query and will reply via email/SMS shortly.
                        </p>
                        <button
                          onClick={() => setIsSubmittedQuestion(false)}
                          className="mt-2 text-xs font-bold text-[#8A9A5B] hover:underline"
                        >
                          Send another message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleQuestionSubmit} className="space-y-3">
                        
                        {/* Preset Buttons */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#E8E6E1]/80 uppercase tracking-wider block">Quick Inquiry Topics</label>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              'HOA & Pet Restrictions',
                              'Request Seller Disclosures',
                              'Is Price Negotiable?',
                              'Virtual 3D Walkthrough Link'
                            ].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setQuestionPreset(preset)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                                  questionPreset === preset
                                    ? 'bg-[#5C6B4E] text-white border-[#8A9A5B]'
                                    : 'bg-[#4A4844] text-[#E8E6E1] border-[#5C5A55] hover:bg-[#5C5A55]'
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          placeholder="Type your message to the listing agent..."
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          rows={3}
                          className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2.5 text-xs text-white placeholder-[#E8E6E1]/60 focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                          required
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Your Name *"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2.5 text-xs text-white placeholder-[#E8E6E1]/60"
                            required
                          />
                          <input
                            type="email"
                            placeholder="Your Email *"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full bg-[#4A4844] border border-[#5C5A55] rounded-xl p-2.5 text-xs text-white placeholder-[#E8E6E1]/60"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#5C6B4E] hover:bg-[#4A573F] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Inquiry Now</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Direct Agent Contact Buttons */}
                <div className="pt-3 border-t border-[#4A4844] flex items-center gap-2">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex-1 bg-[#4A4844] hover:bg-[#5C5A55] text-white py-2 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all border border-[#5C5A55]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8A9A5B]" />
                    <span>Call Agent</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}?subject=Inquiry regarding ${property.title}`}
                    className="flex-1 bg-[#4A4844] hover:bg-[#5C5A55] text-white py-2 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all border border-[#5C5A55]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#8A9A5B]" />
                    <span>Email Direct</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

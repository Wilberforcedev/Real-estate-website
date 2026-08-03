import React from 'react';
import { X, Calendar, Clock, MapPin, UserCheck, Video, CheckCircle2, Trash2 } from 'lucide-react';
import { TourBooking } from '../types';

interface ScheduledToursModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourBookings: TourBooking[];
  onCancelTour: (tourId: string) => void;
}

export const ScheduledToursModal: React.FC<ScheduledToursModalProps> = ({
  isOpen,
  onClose,
  tourBookings,
  onCancelTour
}) => {
  if (!isOpen) return null;

  const downloadIcsCalendar = (tour: TourBooking) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EstateVue Real Estate//Tour Appointment//EN
BEGIN:VEVENT
SUMMARY:Real Estate Tour: ${tour.propertyTitle}
DESCRIPTION:Property Tour with Agent ${tour.agentName}. Tour type: ${tour.tourType}
LOCATION:${tour.propertyTitle}
DTSTART:${tour.date.replace(/-/g, '')}T100000Z
DTEND:${tour.date.replace(/-/g, '')}T110000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tour-${tour.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3E3C38]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E8E6E1] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#3E3C38] text-white flex items-center justify-between border-b border-[#3E3C38]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#8A9A5B]" />
            <h3 className="font-serif font-bold text-lg">My Scheduled Tours ({tourBookings.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#4A4844] hover:bg-[#5C5A55] text-[#E8E6E1] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tourBookings.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#8C8A85]">
              <Calendar className="w-12 h-12 stroke-[1.5] text-[#8C8A85] mb-3" />
              <p className="font-bold text-[#3E3C38] text-sm">No Scheduled Tours</p>
              <p className="text-xs text-[#8C8A85] mt-1">Browse properties and click "Schedule Tour" to request a private in-person or live video walkthrough.</p>
            </div>
          ) : (
            tourBookings.map((tour) => (
              <div
                key={tour.id}
                className="bg-[#F3F1ED] rounded-2xl p-4 border border-[#E8E6E1] space-y-3 relative hover:border-[#8C8A85] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#5C6B4E]/15 text-[#5C6B4E] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-[#5C6B4E]" /> Confirmed
                    </span>
                    <h4 className="font-bold text-sm text-[#3E3C38]">{tour.propertyTitle}</h4>
                    <p className="text-xs text-[#8C8A85]">Agent: {tour.agentName}</p>
                  </div>

                  <button
                    onClick={() => onCancelTour(tour.id)}
                    className="text-[#8C8A85] hover:text-[#D98E73] hover:bg-[#D98E73]/10 p-1.5 rounded-lg transition-all"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-[#E8E6E1] text-xs font-semibold text-[#3E3C38]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5C6B4E]" />
                    <span>{tour.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#5C6B4E]" />
                    <span>{tour.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tour.tourType === 'video' ? <Video className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <UserCheck className="w-3.5 h-3.5 text-[#5C6B4E]" />}
                    <span className="capitalize">{tour.tourType} Tour</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#8C8A85]">For: <strong>{tour.userName}</strong> ({tour.userPhone})</span>
                  <button
                    onClick={() => downloadIcsCalendar(tour)}
                    className="text-xs font-bold text-[#5C6B4E] hover:text-[#4A573F] hover:underline flex items-center gap-1"
                  >
                    <span>Download Calendar (.ics)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

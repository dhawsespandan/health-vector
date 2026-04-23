import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from 'date-fns';

const BookingCalendar = ({ onDateSelect, selectedDate, bookedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad days to start on correct weekday
  const startPadding = monthStart.getDay(); // 0 = Sunday
  const paddingDays = Array(startPadding).fill(null);

  const isBooked = (day) => bookedDates.some((d) => isSameDay(new Date(d), day));
  const isPast = (day) => isBefore(day, today);
  const isSelected = (day) => selectedDate && isSameDay(day, selectedDate);
  const isToday = (day) => isSameDay(day, today);

  const getDayStyle = (day) => {
    if (isSelected(day)) return {
      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      color: 'white',
      fontWeight: 700,
    };
    if (isPast(day) || isBooked(day)) return {
      background: 'rgba(0,0,0,0.02)',
      color: '#1e293b',
      cursor: 'not-allowed',
    };
    if (isToday(day)) return {
      background: 'rgba(6, 182, 212, 0.15)',
      color: '#06b6d4',
      border: '1px solid rgba(6, 182, 212, 0.3)',
    };
    return {
      background: 'rgba(0,0,0,0.03)',
      color: '#94a3b8',
      cursor: 'pointer',
    };
  };

  return (
    <div className="mac-panel" style={{ padding: 24 }}>
      {/* Month navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={16} />
        </button>
        <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 16, color: '#18181b' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#475569', fontWeight: 600, padding: '4px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
        {days.map((day) => {
          const disabled = isPast(day) || isBooked(day);
          return (
            <button key={day.toISOString()}
              onClick={() => !disabled && onDateSelect(day)}
              disabled={disabled}
              style={{
                width: '100%', aspectRatio: '1', borderRadius: 8, border: 'none', fontSize: 13, fontFamily: 'Inter',
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...getDayStyle(day),
              }}
              onMouseEnter={(e) => { if (!disabled && !isSelected(day)) e.currentTarget.style.background = 'rgba(6,182,212,0.1)'; }}
              onMouseLeave={(e) => { if (!disabled && !isSelected(day)) e.currentTarget.style.background = getDayStyle(day).background; }}>
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#71717a' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }} /> Today
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#71717a' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }} /> Selected
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#71717a' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(0,0,0,0.02)' }} /> Unavailable
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;

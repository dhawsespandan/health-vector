import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import BookingCalendar from '../components/BookingCalendar';
import { format } from 'date-fns';
import { Check, X, RefreshCcw, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM'];
const ASSESSMENT_TYPES = ['Individual', 'Corporate', 'Online Consultation'];
const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#10b981', cancelled: '#ef4444', completed: '#06b6d4' };

const Booking = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1=type, 2=date/time, 3=details, 4=confirm, 5=done
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    api.get('/appointments/my').then((res) => setMyBookings(res.data)).catch(() => {})
      .finally(() => setLoadingBookings(false));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      setSelectedSlot('');
      api.get(`/appointments/slots?date=${selectedDate.toISOString()}`).then((res) => setSlots(res.data)).catch(() => {})
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/appointments/book', {
        assessmentType: selectedType,
        date: selectedDate,
        timeSlot: selectedSlot,
        ...form,
      });
      setBookingId(res.data._id);
      setStep(5);
      const updated = await api.get('/appointments/my');
      setMyBookings(updated.data);
      toast.success('Booking confirmed! Check your email for confirmation.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      setMyBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Appointment cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div style={{ padding: '0 0 60px' }}>
      <div style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.06) 0%, transparent 100%)', padding: '48px 0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="section-container">
          <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 32, color: '#18181b', marginBottom: 8 }}>Book a Session</h1>
          <p style={{ color: '#71717a', fontSize: 15 }}>Schedule an in-person or online wellness assessment with our experts.</p>
        </div>
      </div>

      <div className="section-container" style={{ paddingTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 32 }}>
          {/* Booking flow */}
          <div>
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
              {['Type', 'Date & Time', 'Details', 'Confirm'].map((label, i) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? '#10b981' : step === i + 1 ? '#06b6d4' : 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: step >= i + 1 ? 'white' : '#475569', transition: 'all 0.3s' }}>
                      {step > i + 1 ? <Check size={14} /> : i + 1}
                    </div>
                    <span style={{ fontSize: 10, color: step === i + 1 ? '#06b6d4' : '#475569', fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#10b981' : 'rgba(0,0,0,0.06)', margin: '0 8px', marginBottom: 22, transition: 'background 0.3s' }} />}
                </div>
              ))}
            </div>

            {/* Step 1: Type */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 20 }}>Choose Assessment Type</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ASSESSMENT_TYPES.map((type) => (
                    <button key={type} onClick={() => { setSelectedType(type); setStep(2); }}
                      style={{ padding: '20px 24px', borderRadius: 12, border: `2px solid ${selectedType === type ? '#06b6d4' : 'rgba(0,0,0,0.08)'}`, background: selectedType === type ? 'rgba(6,182,212,0.08)' : 'rgba(0,0,0,0.02)', color: '#18181b', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{type}</div>
                      <div style={{ fontSize: 13, color: '#71717a' }}>
                        {type === 'Individual' && 'Personal one-on-one wellness diagnostic session'}
                        {type === 'Corporate' && 'For teams and organizations — group wellness assessment'}
                        {type === 'Online Consultation' && 'Remote video call with our wellness expert'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date + Slot */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 20 }}>Select Date & Time</h2>
                <BookingCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

                {selectedDate && (
                  <div style={{ marginTop: 24 }}>
                    <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 16 }}>
                      Available slots for {format(selectedDate, 'MMMM d, yyyy')}
                    </h3>
                    {loadingSlots ? (
                      <div style={{ textAlign: 'center', padding: 24 }}><div className="spinner" /></div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        {slots.map(({ slot, available }) => (
                          <button key={slot} disabled={!available}
                            onClick={() => setSelectedSlot(slot)}
                            style={{ padding: '12px', borderRadius: 10, border: `2px solid ${selectedSlot === slot ? '#06b6d4' : available ? 'rgba(0,0,0,0.08)' : 'transparent'}`, background: selectedSlot === slot ? 'rgba(6,182,212,0.12)' : available ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.01)', color: !available ? '#1e293b' : selectedSlot === slot ? '#06b6d4' : '#94a3b8', cursor: available ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 500, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <Clock size={13} /> {slot}
                          </button>
                        ))}
                      </div>
                    )}
                    {selectedSlot && (
                      <button className="mac-btn-primary justify-center" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} onClick={() => setStep(3)}>
                        Continue <Check size={16} />
                      </button>
                    )}
                  </div>
                )}
                <button className="mac-btn-secondary justify-center" style={{ marginTop: 16 }} onClick={() => setStep(1)}>&larr; Back</button>
              </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 20 }}>Your Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input className="mac-input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label className="form-label">Email</label>
                      <input className="mac-input w-full" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Phone (optional)</label>
                      <input className="mac-input w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Notes (optional)</label>
                    <textarea className="mac-input w-full" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any specific concerns or expectations..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button className="mac-btn-secondary justify-center" onClick={() => setStep(2)}>&larr; Back</button>
                  <button className="mac-btn-primary justify-center" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(4)}>Review Booking</button>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 20 }}>Confirm Booking</h2>
                <div className="mac-panel" style={{ padding: 28, marginBottom: 20 }}>
                  {[
                    { label: 'Type', value: selectedType },
                    { label: 'Date', value: selectedDate ? format(selectedDate, 'MMMM d, yyyy (EEEE)') : '' },
                    { label: 'Time', value: selectedSlot },
                    { label: 'Name', value: form.name },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <span style={{ color: '#71717a', fontSize: 14 }}>{label}</span>
                      <span style={{ color: '#18181b', fontWeight: 500, fontSize: 14 }}>{value}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>A confirmation email will be sent to {form.email}.</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="mac-btn-secondary justify-center" onClick={() => setStep(3)}>&larr; Edit</button>
                  <button id="confirm-booking" className="mac-btn-primary justify-center" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Booking...</> : <>Confirm Booking</>}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Done */}
            {step === 5 && (
              <div className="mac-panel" style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Check size={36} color="white" />
                </div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 24, color: '#18181b', marginBottom: 12 }}>Booking Confirmed!</h2>
                <p style={{ color: '#71717a', marginBottom: 8 }}>Booking ID: <code style={{ color: '#06b6d4' }}>{bookingId}</code></p>
                <p style={{ color: '#71717a', marginBottom: 32 }}>A confirmation has been sent to {form.email}</p>
                <button className="mac-btn-primary justify-center" onClick={() => { setStep(1); setSelectedDate(null); setSelectedSlot(''); setSelectedType(''); }} style={{ justifyContent: 'center' }}>
                  Book Another Session
                </button>
              </div>
            )}
          </div>

          {/* My Bookings sidebar */}
          <div>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: '#18181b', marginBottom: 20 }}>My Appointments</h2>
            {loadingBookings ? (
              <div className="spinner" />
            ) : myBookings.length === 0 ? (
              <div className="mac-panel" style={{ padding: 24, textAlign: 'center', color: '#71717a', fontSize: 14 }}>No appointments yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {myBookings.map((b) => (
                  <div key={b._id} className="mac-panel" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#18181b' }}>{b.assessmentType}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLORS[b.status], background: `${STATUS_COLORS[b.status]}18`, padding: '3px 8px', borderRadius: 9999 }}>{b.status.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#71717a' }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {format(new Date(b.date), 'MMM d, yyyy')} · {b.timeSlot}
                    </p>
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button onClick={() => handleCancel(b._id)} style={{ marginTop: 10, background: 'none', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <X size={12} /> Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

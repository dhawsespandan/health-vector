import { useState } from 'react';
import api from '../utils/api';
import { MapPin, Mail, Phone, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SUBJECTS = ['General Inquiry', 'Partnership', 'Technical Support', 'Booking', 'Media'];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/admin/contact', form);
      setSent(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    } catch {
      toast.error('Failed to send message. Try emailing us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">

      {/* Content */}
      <section className="py-20 bg-white border-y border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info column */}
            <div className="flex flex-col gap-6">
              <div className="mac-panel p-8">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-6">Contact information</h2>
                <div className="flex flex-col gap-6">
                  {[
                    { icon: <Mail size={18} />, label: 'Email', value: 'hello@healthvector.com', href: 'mailto:hello@healthvector.com' },
                    { icon: <Phone size={18} />, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                    { icon: <MapPin size={18} />, label: 'Location', value: 'Pune, Maharashtra, India', href: null },
                  ].map(({ icon, label, value, href }) => (
                    <div key={label} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 text-zinc-500 flex items-center justify-center flex-shrink-0">
                        {icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
                        {href ? (
                          <a href={href} className="text-sm text-zinc-700 hover:text-blue-600 transition-colors">{value}</a>
                        ) : (
                          <p className="text-sm text-zinc-700">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mac-panel p-8">
                <h3 className="text-base font-semibold text-zinc-900 mb-4">Business hours</h3>
                <div className="flex flex-col divide-y divide-zinc-100">
                  {[
                    { day: 'Mon – Fri', time: '9:00 AM – 7:00 PM IST' },
                    { day: 'Saturday', time: '10:00 AM – 4:00 PM IST' },
                    { day: 'Sunday', time: 'Closed' },
                  ].map(({ day, time }) => (
                    <div key={day} className="flex justify-between text-sm py-3">
                      <span className="text-zinc-600">{day}</span>
                      <span className="text-zinc-400">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="mac-panel p-12 lg:p-16 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-3">Message sent</h3>
                  <p className="text-zinc-500 mb-8">We'll get back to you within 24 hours at {form.email}</p>
                  <button
                    className="mac-btn-secondary"
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mac-panel p-8 flex flex-col gap-5">
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Send a message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full name</label>
                      <input className="mac-input" placeholder="Priya Sharma"
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="form-label">Email address</label>
                      <input type="email" className="mac-input" placeholder="priya@example.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Subject</label>
                    <select className="mac-input" value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                      <option value="">Select a subject</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Message</label>
                    <textarea className="mac-input" rows={6} placeholder="Tell us what's on your mind..."
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <button id="contact-submit" type="submit" className="mac-btn-primary self-start" disabled={sending}>
                    {sending ? 'Sending...' : <><Send size={15} /> Send message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

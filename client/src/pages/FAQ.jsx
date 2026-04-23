import { useState } from 'react';
import { ChevronDown, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'How is the Wellness Index calculated?',
    a: 'Your Wellness Index is calculated from 25 questions spanning three dimensions: Physical (8 questions, 35% weight), Mental (9 questions, 40% weight), and Emotional (8 questions, 25% weight). Each dimension is scored 0–100, then combined using the weighted formula. The scoring also accounts for reverse-scored items.',
  },
  {
    q: 'Is this a medical diagnosis?',
    a: 'No. Health Vector is a wellness assessment platform, not a medical diagnostic tool. Our assessments measure subjective wellness indicators and provide general wellness guidance. For medical concerns, always consult a qualified healthcare professional. Our recommendations complement — but do not replace — medical advice.',
  },
  {
    q: 'How is my data stored and protected?',
    a: 'All data is encrypted in transit (HTTPS) and at rest. Passwords are hashed using bcrypt and never stored in plain text. Your assessment data is private to your account. We never share individual data with organisations — org dashboards only show anonymised aggregates. You can delete your account and all associated data at any time from your Profile page.',
  },
  {
    q: 'What happens during an in-person assessment?',
    a: 'An in-person session (60–90 minutes) includes: a detailed conversation about your lifestyle and health goals; physical assessment including pulse diagnosis (nadi pariksha) and body type evaluation; review of your digital wellness results; acupressure meridian assessment; and a personalised report with dietary, lifestyle, and therapeutic recommendations.',
  },
  {
    q: 'Can I share my results with my doctor?',
    a: 'Yes. From your Dashboard, you can download a PDF report of your assessment results, scores, and recommendations. This report is formatted to be readable and useful for healthcare discussions.',
  },
  {
    q: 'What does my Prakriti type mean?',
    a: "Prakriti is your Ayurvedic constitutional type — a pattern of physical and psychological characteristics. The three types are Vata (air+space: creative, variable, light), Pitta (fire+water: sharp, focused, intense), and Kapha (earth+water: stable, nurturing, steady). Knowing your Prakriti helps personalise diet, exercise, and lifestyle recommendations.",
  },
  {
    q: 'How often should I retake the assessment?',
    a: "We recommend retaking the wellness assessment every 30 days. This interval is long enough for lifestyle changes to produce measurable results, and short enough to track meaningful trends. You can set up a monthly email reminder from your Profile page.",
  },
  {
    q: 'How does the organizational dashboard work?',
    a: 'Organizational admins can register their company, invite employees via email, and access an aggregate wellness dashboard. All individual data is kept private — the dashboard only shows group averages, zone distributions, and department comparisons.',
  },
  {
    q: 'Can I use this platform for free?',
    a: 'Yes. The core wellness assessment, dashboard, recommendations, and blog are completely free. The Pro plan adds advanced reports, priority booking, and historical trend analysis. The Organizational plan is for companies wanting the corporate dashboard and employee invite features.',
  },
  {
    q: 'What is the science behind Health Vector?',
    a: 'Health Vector integrates multiple evidence-based frameworks: validated psychometric instruments for stress, anxiety, and emotional wellbeing; WHO wellness dimensions as the scoring framework; Ayurvedic Prakriti science with modern genomic validation; and recommendations grounded in clinical evidence from behaviour change science.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col min-h-screen pb-20">

      {/* FAQ list */}
      <section className="pt-8 pb-20 bg-white border-b border-zinc-200/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-zinc-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  id={`faq-${i}`}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full py-6 flex justify-between items-center gap-6 text-left bg-transparent border-0 cursor-pointer"
                >
                  <h3 className={`font-medium text-base leading-snug transition-colors ${openIndex === i ? 'text-zinc-900' : 'text-zinc-700'}`}>
                    {faq.q}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-zinc-400 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === i && (
                  <div className="pb-6 pr-10">
                    <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-5xl mx-auto px-4 w-full">
        <div className="mac-panel p-12 lg:p-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-semibold text-zinc-900 tracking-tight mb-4">
              Still have questions?
            </h2>
            <p className="text-zinc-500 mb-8 text-lg">
              Our team is here to help. Reach out and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="mac-btn-primary text-base px-6 py-3">
                <MessageSquare size={18} /> Contact Us
              </Link>
              <a href="mailto:hello@healthvector.com" className="mac-btn-secondary text-base px-6 py-3">
                <Mail size={18} /> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;

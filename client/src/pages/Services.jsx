import { Link } from 'react-router-dom';
import { Check, ArrowRight, Activity, Building2, Leaf } from 'lucide-react';

const PLANS = [
  {
    name: 'Free', price: '0', period: 'forever',
    features: ['1 wellness assessment', 'Basic Wellness Index', 'Personalised recommendations', 'FAQ & Blog access'],
    cta: 'Get Started Free', href: '/register', featured: false,
  },
  {
    name: 'Individual Pro', price: '499', period: '/month',
    features: ['Unlimited assessments', 'Full Wellness Index + Prakriti', 'Advanced recommendations', 'PDF reports', 'Assessment history & trends', 'Priority booking', 'Monthly email reminders'],
    cta: 'Start Pro Trial', href: '/register', featured: true,
  },
  {
    name: 'Organizational', price: '4,999', period: '/month',
    features: ['Everything in Pro', 'Org wellness dashboard', 'Department analytics', 'Employee invite system', 'Aggregate PDF reports', 'HR integration support', 'Dedicated account manager'],
    cta: 'Contact Sales', href: '/contact', featured: false,
  },
];

const SERVICES_LIST = [
  {
    icon: Activity, title: 'Individual Wellness Assessment', iconBg: 'bg-blue-50', iconColor: 'text-blue-500',
    desc: 'A comprehensive 35-question assessment evaluating your Physical, Mental, and Emotional wellness. Includes Prakriti typing and personalised recommendations.',
    includes: ['35-question clinical assessment', 'Wellness Index (0–100)', 'Prakriti constitutional typing', 'Personalised recommendation plan', '7-day action plan', 'Historical trend tracking'],
  },
  {
    icon: Building2, title: 'Organizational Wellness Index', iconBg: 'bg-violet-50', iconColor: 'text-violet-500',
    desc: "Enterprise wellness analytics for HR teams, schools, and healthcare organizations. Understand your team's wellness profile at scale.",
    includes: ['Team dashboard with aggregate scores', 'Department-level comparison', 'Critical zone employee identification', 'Monthly org PDF reports', 'Employee invite management', 'Org-level recommendations'],
  },
  {
    icon: Leaf, title: 'In-Person Advanced Diagnostic', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500',
    desc: '90-minute one-on-one session combining Nadi Pariksha (pulse diagnosis), acupressure meridian assessment, and review of your digital results.',
    includes: ['Nadi Pariksha (pulse diagnosis)', 'Acupressure meridian mapping', 'Digital assessment review', 'Personalised diet protocol', 'Supplement & herb recommendations', 'Follow-up digital report'],
  },
];

const Services = () => (
  <div className="flex flex-col min-h-screen pb-20">

    {/* Services list */}
    <section className="pt-8 pb-20 bg-white border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Services</span>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">What we provide</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Three core offerings, each designed around a different level of depth and scale.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES_LIST.map(({ icon: Icon, title, desc, iconBg, iconColor, includes }) => (
            <div key={title} className="mac-panel p-8 hover:shadow-md transition-shadow flex flex-col">
              <div className={`w-12 h-12 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center mb-6`}>
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3 tracking-tight">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">{desc}</p>
              <div className="flex flex-col gap-2 mt-auto">
                {includes.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-zinc-500">
                    <Check size={14} className="text-zinc-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Pricing</span>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Start free. Upgrade whenever you're ready.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(({ name, price, period, featured, features, cta, href }) => (
            <div key={name} className={`mac-panel p-8 flex flex-col relative ${featured ? 'ring-2 ring-zinc-900' : ''}`}>
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">{name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-zinc-400 font-medium">₹</span>
                  <span className="text-4xl font-bold text-zinc-900 tracking-tight">{price}</span>
                  <span className="text-sm text-zinc-400">{period}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-8 flex-1">
                {features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-zinc-500">
                    <Check size={14} className="text-zinc-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Link to={href} className={featured ? 'mac-btn-primary w-full justify-center' : 'mac-btn-secondary w-full justify-center'}>
                {cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-4 max-w-5xl mx-auto px-4 w-full">
      <div className="mac-panel p-12 lg:p-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-semibold text-zinc-900 tracking-tight mb-4">
            Not sure where to start?
          </h2>
          <p className="text-zinc-500 mb-8 text-lg">
            Take the free assessment — it takes 10 minutes and gives you a complete wellness picture.
          </p>
          <Link to="/register" className="mac-btn-primary inline-flex text-base px-6 py-3">
            Start for Free <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Services;

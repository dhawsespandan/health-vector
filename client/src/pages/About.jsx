import { Link } from 'react-router-dom';
import { Brain, Leaf, Building2, Activity, CheckCircle } from 'lucide-react';

const TEAM = [
  { name: 'Dr. Priya Sharma', role: 'Chief Wellness Officer · MBBS, Ayurveda (BHU)', initials: 'PS' },
  { name: 'Rahul Mehta', role: 'Head of Data Science · IIT Bombay', initials: 'RM' },
  { name: 'Vaidya Anita Kulkarni', role: 'Ayurvedic Consultant · 20 years experience', initials: 'AK' },
  { name: 'Dr. Sneha Joshi', role: 'Clinical Psychologist · TISS Mumbai', initials: 'SJ' },
];

const DIFFS = [
  { icon: <Activity size={24} />, title: 'Holistic Scoring', desc: 'Physical, Mental, and Emotional dimensions combined into one Wellness Index — not just a mood tracker.' },
  { icon: <Leaf size={24} />, title: 'Prakriti Integration', desc: 'The only platform that overlays Ayurvedic constitutional analysis on modern wellness data.' },
  { icon: <Brain size={24} />, title: 'Evidence-Based', desc: 'Scoring framework validated against WHO wellness dimensions and clinical psychometric tools.' },
  { icon: <Building2 size={24} />, title: 'Enterprise Ready', desc: 'Built for individual users and organizations alike, with privacy-first aggregate dashboards.' },
];

const About = () => (
  <div className="flex flex-col min-h-screen pb-20">

    {/* Hero */}
    <section className="relative pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Our Story</span>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-zinc-900 mb-6 leading-[1.05]">
          Built on Science.<br />
          <span className="text-zinc-400">Driven by Purpose.</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          A team of clinicians, technologists, and wellness practitioners united by one goal — making personalised health guidance accessible to all.
        </p>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-20 bg-white border-y border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mac-panel p-8 border-l-2 border-blue-500">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3 block">Mission</span>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-3">Why we exist</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              To make personalised, science-backed wellness guidance accessible to every individual and organisation — bridging the gap between clinical insight and daily life through intelligent technology and ancient wisdom.
            </p>
          </div>
          <div className="mac-panel p-8 border-l-2 border-violet-500">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 block">Vision</span>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-3">Where we're headed</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              A world where every person understands their own wellness profile and has a clear, personalised path to living optimally — regardless of their background, budget, or location.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">The Origin</span>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">Why we built Health Vector</h2>
        <p className="text-zinc-500 leading-relaxed mb-4">
          In 2022, our founding team observed a critical gap: wellness platforms were either purely symptomatic (track your steps, count calories) or purely subjective (how do you feel today?).
        </p>
        <p className="text-zinc-500 leading-relaxed mb-4">
          The deeper problem: <strong className="text-zinc-700 font-medium">nobody was measuring all three dimensions of wellness in an integrated, personalised way.</strong> And nobody was connecting modern data with the millennia-old science of Ayurveda.
        </p>
        <p className="text-zinc-500 leading-relaxed">
          Health Vector was built to solve exactly this. Today, we serve individual users, corporate HR teams, educational institutions, and healthcare providers — all with one shared goal: make wellness visible, measurable, and actionable.
        </p>
      </div>
    </section>

    {/* Our Approach */}
    <section className="py-20 bg-white border-y border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Methodology</span>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">Our approach</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Science and ancient wisdom, unified into a single platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mac-panel p-8">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-3 tracking-tight">Scientific Foundation</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Our scoring model is grounded in the WHO wellness framework, validated psychometric tools for stress and anxiety, and evidence-based behavioural change science. Every recommendation links back to peer-reviewed research.
            </p>
          </div>
          <div className="mac-panel p-8">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
              <Leaf size={24} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-3 tracking-tight">Holistic Wisdom</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Ayurveda's Prakriti system, acupressure meridian theory, and yogic science form the holistic layer of our platform — integrated into the core scoring and recommendation engine.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* What Makes Us Different */}
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Differentiators</span>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">What makes us different</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">We built what didn't exist — a platform that treats wellness as a complete, measurable system.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DIFFS.map(({ icon, title, desc }) => (
            <div key={title} className="mac-panel p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center mb-6">{icon}</div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3 tracking-tight">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-20 bg-white border-y border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">The Team</span>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">Expert advisory panel</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Built with guidance from leading practitioners across medicine, psychology, and Ayurveda.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAM.map(({ name, role, initials }) => (
            <div key={name} className="mac-panel p-8 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-600 flex-shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-zinc-900">{name}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 max-w-5xl mx-auto px-4 w-full">
      <div className="mac-panel p-12 lg:p-16 text-center">
        <div className="max-w-3xl mx-auto">
          <CheckCircle size={32} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-semibold text-zinc-900 tracking-tight mb-4">
            Ready to know your wellness?
          </h2>
          <p className="text-zinc-500 mb-8 text-lg">
            Take the free 35-question assessment and get your personalised Wellness Index today.
          </p>
          <Link to="/assessment" className="mac-btn-primary inline-flex text-base px-6 py-3">
            Take Free Assessment
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;

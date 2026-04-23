import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Shield, Brain, Heart, ArrowRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden px-4">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 text-blue-600 text-sm font-medium mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Health Vector 2.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-zinc-900 mb-6 leading-[1.05]">
            Wellness Intelligence, <br />
            <span className="text-zinc-400">Refined for You.</span>
          </h1>
          
          <p className="text-lg text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover your core baseline through our advanced 35-point assessment. Uniting modern quantitative science with tailored restorative protocols.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? "/assessment" : "/register"} className="mac-btn-primary text-base px-6 py-3 w-full sm:w-auto">
              {isAuthenticated ? "Take Assessment" : "Start Free Assessment"}
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/about" className="mac-btn-secondary text-base px-6 py-3 w-full sm:w-auto">
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-white border-y border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">A complete picture of your health</h2>
             <p className="text-zinc-500 max-w-xl mx-auto">Skip the guesswork. Our platform measures across three core dimensions to generate an actionable wellness index.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="mac-panel p-8 hover:shadow-md transition-shadow">
               <div className="w-12 h-12 rounded-lg bg-red-50 text-red-500 flex items-center justify-center mb-6">
                 <Heart size={24} />
               </div>
               <h3 className="text-xl font-semibold text-zinc-900 mb-3 tracking-tight">Physical</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">
                 Deep insights into your sleep architecture, metabolic resilience, dietary habits, and overall systemic endurance.
               </p>
            </div>
            <div className="mac-panel p-8 hover:shadow-md transition-shadow">
               <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
                 <Brain size={24} />
               </div>
               <h3 className="text-xl font-semibold text-zinc-900 mb-3 tracking-tight">Mental</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">
                 Evaluating cognitive load, sharp focus retention, chronic stress adaptation, and neurological clarity.
               </p>
            </div>
            <div className="mac-panel p-8 hover:shadow-md transition-shadow">
               <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
                 <Shield size={24} />
               </div>
               <h3 className="text-xl font-semibold text-zinc-900 mb-3 tracking-tight">Emotional</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">
                 Mapping internal processing, coping thresholds, relational health, and emotional baselines under pressure.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Layer */}
      <section className="py-24 max-w-5xl mx-auto px-4 w-full">
        <div className="mac-panel overflow-hidden relative p-12 lg:p-16 text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-semibold text-zinc-900 tracking-tight mb-4">
              Ready to define your baseline?
            </h2>
            <p className="text-zinc-500 mb-8 text-lg">
              Join thousands of professionals optimizing their daily performance.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="mac-btn-primary inline-flex">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

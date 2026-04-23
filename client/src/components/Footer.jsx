import { Link } from 'react-router-dom';
import { Activity, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-zinc-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shadow-sm">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-semibold text-lg text-zinc-900 tracking-tight">Health Vector</span>
            </Link>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm">
              Your holistic wellness intelligence platform. Uniting modern science with refined, native performance.
            </p>

          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4 text-sm tracking-wide uppercase">Platform</h4>
            <div className="flex flex-col gap-3">
              <Link to="/assessment" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Take Assessment</Link>
              <Link to="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">My Dashboard</Link>
              <Link to="/profile" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">My Plan</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4 text-sm tracking-wide uppercase">Company</h4>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">About Us</Link>
              <Link to="/services" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Services</Link>
              <Link to="/blog" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4 text-sm tracking-wide uppercase">Get in Touch</h4>
            <div className="text-sm text-zinc-500 mb-2 flex items-center gap-2">
              <Mail size={14} /> hello@healthvector.com
            </div>
            <div className="text-sm text-zinc-500 mb-4">
              Pune, Maharashtra, India
            </div>
            <Link to="/contact" className="mac-btn-secondary inline-flex text-sm">Contact Us</Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} Health Vector Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-zinc-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-[#E5252B]/15 text-[#E5252B] border border-[#E5252B]/30 flex items-center justify-center mb-4">
        <Flame className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
      <p className="text-lg font-bold text-slate-200 mt-2">Page Not Found</p>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">
        The requested admin route or equipment resource does not exist in the safemete cluster.
      </p>
      <Link
        to="/dashboard"
        id="btn-404-home"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5252B] hover:bg-[#C22126] text-white text-sm font-bold shadow-lg shadow-[#E5252B]/20 transition-all cursor-pointer"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

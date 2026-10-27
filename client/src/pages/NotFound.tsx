import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] bg-cream-100 flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-gold-500/25 shadow-warm space-y-6">
        <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-900 flex items-center justify-center mx-auto">
          <Trees className="w-8 h-8 text-gold-500" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Error 404
          </span>
          <h1 className="font-display text-3xl font-bold text-forest-900">
            Page Not Found
          </h1>
          <p className="text-xs text-charcoal-800 leading-relaxed">
            The holiday path you're looking for seems to have wandered off into the snowy pines of Chardon.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold uppercase text-xs tracking-wider transition-colors shadow-warm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Market Home
          </Link>
        </div>
      </div>
    </div>
  );
};

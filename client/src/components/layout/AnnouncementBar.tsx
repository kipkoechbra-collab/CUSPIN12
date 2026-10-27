import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnnouncementBarProps {
  customText?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ customText }) => {
  const defaultText = "Bringing the Magic of European Christmas Markets to Chardon Square • Vendor & Sponsor Applications Now Open";

  return (
    <div className="bg-forest-950 text-gold-300 py-2.5 px-4 text-center text-xs sm:text-sm font-medium tracking-wide border-b border-gold-500/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 animate-pulse" />
        <span>{customText || defaultText}</span>
        <Link
          to="/become-vendor"
          className="underline hover:text-white font-semibold ml-1.5 transition-colors"
        >
          Apply Now &rarr;
        </Link>
      </div>
    </div>
  );
};

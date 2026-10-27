import React from 'react';
import { Calendar, Clock, MapPin, Compass, Car, Sparkles, Coffee, Music, Heart, Info, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventDetails: React.FC = () => {
  const weekendsData = [
    {
      title: 'Weekend 1 • Grand Opening Celebration',
      dates: 'November 28–29, 2026',
      hours: 'Saturday: 10:00 AM – 8:00 PM | Sunday: 11:00 AM – 6:00 PM',
      highlight: 'Official Market Opening Ceremony & Heritage Tree Lighting at dusk on Saturday. Complimentary mulled cider for the first 200 visitors.',
    },
    {
      title: 'Weekend 2 • St. Nicholas & Confections Weekend',
      dates: 'December 4–6, 2026',
      hours: 'Friday: 5:00 PM – 9:00 PM | Saturday: 10:00 AM – 8:00 PM | Sunday: 11:00 AM – 6:00 PM',
      highlight: 'Authentic European St. Nicholas appearances, gingerbread decorating workshops, and specialty German stollen and Austrian pastries.',
    },
    {
      title: 'Weekend 3 • Artisan & Master Woodcraft Weekend',
      dates: 'December 11–13, 2026',
      hours: 'Friday: 5:00 PM – 9:00 PM | Saturday: 10:00 AM – 8:00 PM | Sunday: 11:00 AM – 6:00 PM',
      highlight: 'Live woodworking demonstrations, glassblowing, handcrafted holiday ornaments, and acoustic holiday folk ensembles.',
    },
    {
      title: 'Weekend 4 • Solstice & Grand Holiday Finale',
      dates: 'December 18–20, 2026',
      hours: 'Friday: 5:00 PM – 9:00 PM | Saturday: 10:00 AM – 8:00 PM | Sunday: 11:00 AM – 6:00 PM',
      highlight: 'Candlelight evening walk around Chardon Square, final holiday shopping, and festive brass fanfare performance.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Visitor Guide & Schedule
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-forest-900">
            Event Details
          </h1>
          <p className="font-editorial text-lg sm:text-xl text-charcoal-800 italic max-w-2xl mx-auto">
            Everything you need to know for a memorable holiday outing at the Chardon Holiday Market.
          </p>
        </div>

        {/* Quick Facts Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gold-500/25 shadow-sm space-y-2">
            <MapPin className="w-6 h-6 text-gold-600" />
            <h3 className="font-display text-base font-bold text-forest-900">Location</h3>
            <p className="text-xs text-charcoal-800">
              Historic Chardon Square<br />
              Chardon, OH 44024
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gold-500/25 shadow-sm space-y-2">
            <Calendar className="w-6 h-6 text-gold-600" />
            <h3 className="font-display text-base font-bold text-forest-900">Dates</h3>
            <p className="text-xs text-charcoal-800">
              4 Weekends<br />
              Nov 28 – Dec 20, 2026
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gold-500/25 shadow-sm space-y-2">
            <Clock className="w-6 h-6 text-gold-600" />
            <h3 className="font-display text-base font-bold text-forest-900">General Hours</h3>
            <p className="text-xs text-charcoal-800">
              Fri: 5–9PM | Sat: 10AM–8PM<br />
              Sun: 11AM–6PM
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gold-500/25 shadow-sm space-y-2">
            <Heart className="w-6 h-6 text-gold-600" />
            <h3 className="font-display text-base font-bold text-forest-900">Admission</h3>
            <p className="text-xs text-charcoal-800">
              100% Free Entry<br />
              Open to the Public
            </p>
          </div>
        </div>

        {/* 4 Weekends Detailed Schedule */}
        <div className="space-y-6">
          <div className="border-b border-cream-300 pb-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
              Detailed Weekend Schedule
            </h2>
          </div>

          <div className="space-y-6">
            {weekendsData.map((w, index) => (
              <div
                key={w.title}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-gold-500/25 shadow-warm hover:border-gold-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-200 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
                      Weekend {index + 1}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-forest-900">
                      {w.title}
                    </h3>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-forest-50 text-forest-900 text-xs font-bold self-start md:self-center border border-forest-200">
                    {w.dates}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-charcoal-800">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-forest-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-600" />
                      Market Hours
                    </span>
                    <p className="text-xs">{w.hours}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-forest-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                      Featured Experience
                    </span>
                    <p className="text-xs leading-relaxed">{w.highlight}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parking, Accessibility, & Family Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl p-8 border border-gold-500/25 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-forest-900">
                Parking & Transportation
              </h3>
            </div>
            <p className="text-sm text-charcoal-800 leading-relaxed">
              Downtown Chardon offers plenty of convenient parking options:
            </p>
            <ul className="space-y-2 text-xs text-charcoal-800 list-disc list-inside">
              <li>Free parking surrounding Chardon Square and adjacent public lots.</li>
              <li>Designated accessible parking spaces along Main Street and Court Street.</li>
              <li>Free weekend overflow shuttle from the Chardon High School parking facility.</li>
              <li>Ride-share pickup/drop-off zone located at the North Square entrance.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gold-500/25 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-forest-900">
                Visitor Amenities
              </h3>
            </div>
            <p className="text-sm text-charcoal-800 leading-relaxed">
              We strive to make every guest’s visit comfortable and joyful:
            </p>
            <ul className="space-y-2 text-xs text-charcoal-800 list-disc list-inside">
              <li>Heated warming tent with cozy seating and hot beverage service.</li>
              <li>Stroller-friendly and wheelchair accessible brick pathways.</li>
              <li>Heated clean public restrooms located at Chardon Heritage House.</li>
              <li>Leashed, friendly dogs welcome in all outdoor market zones.</li>
            </ul>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-forest-900 text-cream-50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-warm-lg bg-festive-pattern">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Are You An Artisan Or Gourmet Maker?
          </h2>
          <p className="text-cream-200/90 text-sm sm:text-base max-w-xl mx-auto">
            Spaces fill quickly each year. Apply online today for single weekend or full season participation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/become-vendor"
              className="px-8 py-3.5 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold uppercase text-xs tracking-wider transition-all shadow-warm"
            >
              Apply as a Vendor
            </Link>
            <Link
              to="/vendors"
              className="px-8 py-3.5 rounded-full bg-forest-950 hover:bg-forest-800 text-cream-100 border border-gold-500/30 font-bold uppercase text-xs tracking-wider transition-all"
            >
              Explore Vendors
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

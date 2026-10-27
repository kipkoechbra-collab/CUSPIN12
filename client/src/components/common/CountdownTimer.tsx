import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<{ targetDate?: string }> = ({ targetDate = '2026-11-28T10:00:00' }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="inline-flex items-center gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-forest-950/80 backdrop-blur-md border border-gold-500/30 shadow-warm-lg">
      {units.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center min-w-[55px] sm:min-w-[75px]">
            <span className="font-display text-2xl sm:text-4xl font-extrabold text-gold-400 tracking-wider">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-cream-200/75 uppercase mt-0.5">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="text-gold-500/50 font-display text-xl sm:text-2xl font-bold pb-4">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface PrepTimerProps {
  approvedAt?: string;
  prepTime?: number;
  onFinish?: () => void;
}

export const PrepTimer = ({ approvedAt, prepTime, onFinish }: PrepTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!approvedAt || !prepTime) return;

    const calculateTimeLeft = () => {
      const start = new Date(approvedAt).getTime();
      const end = start + prepTime * 60 * 1000;
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      return diff;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        if (onFinish) onFinish();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [approvedAt, prepTime, onFinish]);

  if (timeLeft === null || timeLeft <= 0) {
    if (timeLeft === 0) return (
        <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 text-rose-600 animate-bounce">
            <Clock size={12} />
            <p className="text-[10px] font-black uppercase tracking-tighter">Time Up! Check Order</p>
        </div>
    );
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${
        isUrgent 
        ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse' 
        : 'bg-emerald-50 border-emerald-100 text-emerald-700'
    }`}>
      <Clock size={12} className={isUrgent ? 'animate-pulse' : 'animate-spin-slow'} />
      <p className="text-[10px] font-black uppercase tracking-tighter">
        {minutes}:{seconds.toString().padStart(2, '0')} Remaining
      </p>
    </div>
  );
};

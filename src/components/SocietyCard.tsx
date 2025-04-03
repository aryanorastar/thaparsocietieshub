import React, { useState } from 'react';
import { type Society } from '../types';
import { type Theme } from '../lib/theme';
import { MapPin, Clock, Lock, CheckCircle2, Info, Mail, UserCircle } from 'lucide-react';

interface SocietyCardProps {
  society: Society;
  theme: Theme;
}

export function SocietyCard({ society, theme }: SocietyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardBackgroundClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white shadow-lg text-gray-800';

  return (
    <div 
      className={`relative w-full h-full cursor-pointer`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* FRONT SIDE */}
      <div className={`absolute w-full h-full rounded-xl overflow-hidden p-6 transition-transform duration-200 ease-in ${isFlipped ? 'hidden' : 'block'} ${cardBackgroundClass}`}>
        <h3 className="text-xl font-bold">{society.name}</h3>
        <p className="text-sm mb-4">{society.description}</p>

        {society.faculty_head && (
          <div className="flex items-center mb-2">
            <UserCircle className="h-4 w-4 mr-2 text-brand-red" />
            <span>Faculty Head: {society.faculty_head}</span>
          </div>
        )}
        {society.email && (
          <div className="flex items-center mb-2">
            <Mail className="h-4 w-4 mr-2 text-brand-red" />
            <a href={`mailto:${society.email}`} className="hover:text-brand-red transition-colors">{society.email}</a>
          </div>
        )}

        <div className="absolute bottom-2 right-2 text-gray-400">
          <Info size={16} />
        </div>
      </div>

      {/* BACK SIDE */}
      <div className={`absolute w-full h-full rounded-xl overflow-hidden p-6 transition-transform duration-200 ease-in ${isFlipped ? 'block' : 'hidden'} ${cardBackgroundClass}`}>
        <h3 className="text-xl font-bold mb-4">About {society.name}</h3>
        <p className="text-sm">{society.description}</p>

        {society.faculty_head && (
          <div className="flex items-center mb-2">
            <UserCircle className="h-4 w-4 mr-2 text-brand-red" />
            <span>Faculty Head: {society.faculty_head}</span>
          </div>
        )}
        {society.email && (
          <div className="flex items-center mb-2">
            <Mail className="h-4 w-4 mr-2 text-brand-red" />
            <a href={`mailto:${society.email}`} className="hover:text-brand-red transition-colors">{society.email}</a>
          </div>
        )}
        <div className="absolute bottom-2 right-2 text-gray-400">
          <Clock size={16} />
        </div>
      </div>
    </div>
  );
}

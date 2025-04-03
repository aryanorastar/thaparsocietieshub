import React, { useState } from 'react';
import { type Society } from '../types';
import { type Theme } from '../lib/theme';
import { Instagram, Twitter, Linkedin, Facebook, ExternalLink, MapPin, ArrowRight, Clock, Lock, CheckCircle2, Info, Image as ImageIcon, Mail, Phone, UserCircle } from 'lucide-react';

interface SocietyCardProps {
  society: Society;
  theme: Theme;
}

export function SocietyCard({ society, theme }: SocietyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getRegistrationButton = () => {
    switch (society.registrationStatus) {
      case 'open':
        return (
          <a
            href={society.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center px-4 py-2 w-full justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <CheckCircle2 size={16} className="mr-2" />
            Register Now
            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </a>
        );
      case 'coming-soon':
        return (
          <button disabled className="group inline-flex items-center px-4 py-2 w-full justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg cursor-not-allowed opacity-90">
            <Clock size={16} className="mr-2 animate-pulse" />
            Coming Soon
          </button>
        );
      case 'closed':
        return (
          <button disabled className="group inline-flex items-center px-4 py-2 w-full justify-center bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg cursor-not-allowed opacity-80">
            <Lock size={16} className="mr-2" />
            Registration Closed
          </button>
        );
    }
  };

  return (
    <div className="relative w-full h-full cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`w-full h-full transition-transform duration-700 transform ${isFlipped ? 'rotate-y-180' : ''} relative preserve-3d`}>
        {/* Front of card */}
        <div className={`absolute w-full h-full backface-hidden p-6 rounded-xl ${theme === 'dark' ? 'glass-effect' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              {!imageError && society.logo_url ? (
                <img src={society.logo_url} alt={society.name} className="w-full h-full object-cover" onError={() => setImageError(true)} />
              ) : (
                <ImageIcon className="w-8 h-8 text-indigo-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-gradient' : 'text-light-text'}`}>{society.name}</h3>
              <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200">
                {society.category}
              </span>
            </div>
          </div>

          <p className={`mb-6 line-clamp-3 transition-all duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {society.description}
          </p>

          {society.faculty_head && (
            <div className={`flex items-center mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <UserCircle className="h-4 w-4 mr-2 text-brand-red" />
              Faculty Head: {society.faculty_head}
            </div>
          )}

          {society.room && (
            <div className={`flex items-center mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <MapPin className="h-4 w-4 mr-2 text-brand-red" />
              {society.room}
            </div>
          )}

          {society.email && (
            <div className={`flex items-center mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <Mail className="h-4 w-4 mr-2 text-brand-red" />
              <a href={`mailto:${society.email}`} className="hover:text-brand-red">{society.email}</a>
            </div>
          )}

          <div className="flex space-x-4 mb-6">
            {society.socialMedia.instagram && (
              <a href={society.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700" onClick={(e) => e.stopPropagation()}>
                <Instagram size={22} />
              </a>
            )}
            {society.socialMedia.twitter && (
              <a href={society.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500" onClick={(e) => e.stopPropagation()}>
                <Twitter size={22} />
              </a>
            )}
          </div>

          {getRegistrationButton()}
        </div>

        {/* Back of card */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 p-6 rounded-xl ${theme === 'dark' ? 'glass-effect-dark' : 'bg-light-card'}`}>
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}>About {society.name}</h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>{society.description}</p>
          <div className="space-y-2">
            {society.faculty_head && (
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                <UserCircle className="h-4 w-4 mr-2 text-brand-red" />
                Faculty Head: {society.faculty_head}
              </div>
            )}
            {society.room && (
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                <MapPin className="h-4 w-4 mr-2 text-brand-red" />
                Location: {society.room}
              </div>
            )}
            <div className={`flex items-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
              <Clock className="h-4 w-4 mr-2 text-brand-red" />
              Status: {society.registrationStatus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            className="group inline-flex items-center px-4 py-2 w-full justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden button-effect"
          >
            <span className="relative z-10 flex items-center">
              <CheckCircle2 size={16} className="mr-2" />
              Register Now
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        );
      case 'coming-soon':
        return (
          <button
            disabled
            className="group inline-flex items-center px-4 py-2 w-full justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg cursor-not-allowed relative overflow-hidden opacity-90"
          >
            <span className="relative z-10 flex items-center">
              <Clock size={16} className="mr-2 animate-pulse" />
              Coming Soon
            </span>
          </button>
        );
      case 'closed':
        return (
          <button
            disabled
            className="group inline-flex items-center px-4 py-2 w-full justify-center bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg cursor-not-allowed relative overflow-hidden opacity-80"
          >
            <span className="relative z-10 flex items-center">
              <Lock size={16} className="mr-2" />
              Registration Closed
            </span>
          </button>
        );
    }
  };

  const cardBackgroundClass = theme === 'dark' ? 'glass-effect' : 'bg-white shadow-lg';

  return (
    <div 
      className={`hover-card-effect cursor-pointer perspective-1000 transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="relative w-full h-full">
        <div className={`rounded-xl overflow-hidden gradient-border p-6 ${isFlipped ? 'hidden' : 'block'} ${cardBackgroundClass}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              {society.logo_url && !imageError ? (
                <img
                  src={society.logo_url}
                  alt={society.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-indigo-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-gradient' : 'text-light-text'}`}>
                {society.name}
              </h3>
              <span className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 font-medium border border-indigo-200/20">
                {society.category}
              </span>
            </div>
          </div>
          
          <p className={`mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {society.description}
          </p>

          {society.faculty_head && (
            <div className={`flex items-center mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <UserCircle className="h-4 w-4 mr-2 text-brand-red" />
              <span className="group-hover:text-brand-red transition-colors duration-300">
                Faculty Head: {society.faculty_head}
              </span>
            </div>
          )}
          
          {society.room && (
            <div className={`flex items-center mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <MapPin className="h-4 w-4 mr-2 text-brand-red" />
              <span className="group-hover:text-brand-red transition-colors duration-300">{society.room}</span>
            </div>
          )}

          {society.email && (
            <div className={`flex items-center mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Mail className="h-4 w-4 mr-2 text-brand-red" />
              <a href={`mailto:${society.email}`} className="hover:text-brand-red transition-colors duration-300">{society.email}</a>
            </div>
          )}

          {society.phone_number && (
            <div className={`flex items-center mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Phone className="h-4 w-4 mr-2 text-brand-red" />
              <a href={`tel:${society.phone_number}`} className="hover:text-brand-red transition-colors duration-300">{society.phone_number}</a>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6">
            {society.socialMedia.instagram && (
              <a
                href={society.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-110 transition-transform duration-300 text-pink-600 hover:text-pink-700 relative pulse-ring bounce-hover"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram size={22} />
              </a>
            )}
            {society.socialMedia.twitter && (
              <a
                href={society.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-110 transition-transform duration-300 text-blue-400 hover:text-blue-500 relative pulse-ring bounce-hover"
                onClick={(e) => e.stopPropagation()}
              >
                <Twitter size={22} />
              </a>
            )}
            {society.socialMedia.linkedin && (
              <a
                href={society.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-110 transition-transform duration-300 text-blue-600 hover:text-blue-700 relative pulse-ring bounce-hover"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={22} />
              </a>
            )}
            {society.socialMedia.facebook && (
              <a
                href={society.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-110 transition-transform duration-300 text-blue-800 hover:text-blue-900 relative pulse-ring bounce-hover"
                onClick={(e) => e.stopPropagation()}
              >
                <Facebook size={22} />
              </a>
            )}
          </div>

          {getRegistrationButton()}
          
          <div className="absolute bottom-2 right-2 text-gray-400 animate-bounce">
            <Info size={16} />
          </div>
        </div>

        <div className={`rounded-xl overflow-hidden gradient-border p-6 absolute top-0 w-full h-full ${isFlipped ? 'block rotate-y-180' : 'hidden'} ${cardBackgroundClass}`}>
          <div className="transform rotate-y-180">
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-light-text'
            }`}>About {society.name}</h3>
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
            }`}>{society.description}</p>
            <div className="space-y-2">
              {society.faculty_head && (
                <div className={`flex items-center ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>
                  <UserCircle className="h-4 w-4 mr-2 text-brand-red" />
                  <span>Faculty Head: {society.faculty_head}</span>
                </div>
              )}
              {society.room && (
                <div className={`flex items-center ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>
                  <MapPin className="h-4 w-4 mr-2 text-brand-red" />
                  <span>Location: {society.room}</span>
                </div>
              )}
              {society.email && (
                <div className={`flex items-center ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>
                  <Mail className="h-4 w-4 mr-2 text-brand-red" />
                  <a href={`mailto:${society.email}`} className="hover:text-brand-red">{society.email}</a>
                </div>
              )}
              {society.phone_number && (
                <div className={`flex items-center ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>
                  <Phone className="h-4 w-4 mr-2 text-brand-red" />
                  <a href={`tel:${society.phone_number}`} className="hover:text-brand-red">{society.phone_number}</a>
                </div>
              )}
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
              }`}>
                <Clock className="h-4 w-4 mr-2 text-brand-red" />
                <span>Status: {society.registrationStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

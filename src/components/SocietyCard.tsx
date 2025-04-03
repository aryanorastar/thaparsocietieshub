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
            className="group inline-flex items-center px-4 py-2 w-full justify-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden button-effect"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="relative z-10 flex items-center font-medium">
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
            className="group inline-flex items-center px-4 py-2 w-full justify-center bg-amber-500 text-white rounded-lg cursor-not-allowed relative overflow-hidden opacity-90"
          >
            <span className="relative z-10 flex items-center font-medium">
              <Clock size={16} className="mr-2 animate-pulse" />
              Coming Soon
            </span>
          </button>
        );
      case 'closed':
        return (
          <button
            disabled
            className="group inline-flex items-center px-4 py-2 w-full justify-center bg-gray-600 text-white rounded-lg cursor-not-allowed relative overflow-hidden opacity-80"
          >
            <span className="relative z-10 flex items-center font-medium">
              <Lock size={16} className="mr-2" />
              Registration Closed
            </span>
          </button>
        );
    }
  };

  return (
    <div 
      className="flip-card hover:shadow-xl transition-shadow duration-300"
      style={{ perspective: "1000px", height: "450px" }}
    >
      <div 
        className="flip-card-inner w-full h-full relative transition-transform duration-700 transform-style-preserve-3d"
        style={{ 
          transformStyle: "preserve-3d", 
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" 
        }}
      >
        {/* Front of card */}
        <div 
          className={`flip-card-front w-full h-full absolute ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl overflow-hidden border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          } p-6 shadow-md`}
          style={{ backfaceVisibility: "hidden" }}
          onClick={() => setIsFlipped(true)}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {society.logo_url && !imageError ? (
                <img
                  src={society.logo_url}
                  alt={society.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {society.name}
              </h3>
              <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600 font-medium">
                {society.category}
              </span>
            </div>
          </div>
          
          <p className={`mb-6 line-clamp-3 transition-all duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          } font-normal leading-relaxed`}>
            {society.description}
          </p>

          {society.faculty_head && (
            <div className={`flex items-center mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <UserCircle className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
              <span className="transition-colors duration-300 font-medium">
                Faculty Head: <span className="font-normal">{society.faculty_head}</span>
              </span>
            </div>
          )}
          
          {society.room && (
            <div className={`flex items-center mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <MapPin className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
              <span className="transition-colors duration-300 font-normal">{society.room}</span>
            </div>
          )}

          {society.email && (
            <div className={`flex items-center mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Mail className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
              <a 
                href={`mailto:${society.email}`} 
                className="hover:text-indigo-600 transition-colors duration-300 font-normal"
                onClick={(e) => e.stopPropagation()}
              >
                {society.email}
              </a>
            </div>
          )}

          {society.phone_number && (
            <div className={`flex items-center mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Phone className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
              <a 
                href={`tel:${society.phone_number}`} 
                className="hover:text-indigo-600 transition-colors duration-300 font-normal"
                onClick={(e) => e.stopPropagation()}
              >
                {society.phone_number}
              </a>
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
            <span className="text-xs font-medium">Tap for info</span>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className={`flip-card-back w-full h-full absolute ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl overflow-hidden border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          } p-6 shadow-md`}
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
          onClick={() => setIsFlipped(false)}
        >
          <h3 className={`text-xl font-bold mb-4 tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>About {society.name}</h3>
          
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
          } font-normal leading-relaxed`}>{society.description}</p>
          
          <div className="space-y-3 mb-6">
            {society.faculty_head && (
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
              }`}>
                <UserCircle className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
                <span className="font-medium">Faculty Head: <span className="font-normal">{society.faculty_head}</span></span>
              </div>
            )}
            {society.room && (
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
              }`}>
                <MapPin className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
                <span className="font-medium">Location: <span className="font-normal">{society.room}</span></span>
              </div>
            )}
            {society.email && (
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
              }`}>
                <Mail className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
                <span className="font-medium">Email: </span>
                <a 
                  href={`mailto:${society.email}`} 
                  className="hover:text-indigo-600 font-normal ml-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {society.email}
                </a>
              </div>
            )}
            {society.phone_number && (
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
              }`}>
                <Phone className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
                <span className="font-medium">Phone: </span>
                <a 
                  href={`tel:${society.phone_number}`} 
                  className="hover:text-indigo-600 font-normal ml-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {society.phone_number}
                </a>
              </div>
            )}
            <div className={`flex items-center ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
            }`}>
              <Clock className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
              <span className="font-medium">Status: <span className="font-normal capitalize">{society.registrationStatus}</span></span>
            </div>
          </div>
          
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
            <ArrowRight size={16} className="transform rotate-180" />
            <span className="text-xs font-medium">Tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { type Society } from '../types';
import { type Theme } from '../lib/theme';
import { Instagram, Twitter, Linkedin, Facebook, ExternalLink, MapPin, ArrowRight, Clock, Lock, CheckCircle2, Info, Image as ImageIcon, Mail, Phone, UserCircle, ChevronLeft } from 'lucide-react';

interface SocietyCardProps {
  society: Society;
  theme: Theme;
}

export function SocietyCard({ society, theme }: SocietyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
            aria-label={`Register for ${society.name}`}
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
            aria-label="Registration coming soon"
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
            aria-label="Registration closed"
          >
            <span className="relative z-10 flex items-center font-medium">
              <Lock size={16} className="mr-2" />
              Registration Closed
            </span>
          </button>
        );
    }
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div 
      className="flip-card group transition-all duration-500"
      style={{ 
        perspective: "1000px", 
        height: "450px",
        transformStyle: "preserve-3d"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`flip-card-inner w-full h-full relative transition-transform duration-700 shadow-md ${isHovered ? 'shadow-lg' : ''}`}
        style={{ 
          transformStyle: "preserve-3d", 
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" 
        }}
      >
        {/* Front of card */}
        <div 
          className={`flip-card-front absolute w-full h-full ${bgColor} rounded-xl overflow-hidden border ${borderColor} shadow-sm hover:shadow-md transition-shadow duration-300`}
          style={{ backfaceVisibility: "hidden" }}
          onClick={() => setIsFlipped(true)}
          role="button"
          tabIndex={0}
          aria-label={`View details about ${society.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsFlipped(true);
            }
          }}
        >
          {/* Add a subtle gradient overlay at the top */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-600/10 to-transparent z-0"></div>
          
          <div className="p-6 relative z-10">
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border-2 border-indigo-100 shadow-sm">
                {society.logo_url && !imageError ? (
                  <img
                    src={society.logo_url}
                    alt={`${society.name} logo`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold tracking-tight ${textColor} mb-1`}>
                  {society.name}
                </h3>
                <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600 font-medium inline-block">
                  {society.category}
                </span>
              </div>
            </div>
            
            <div className={`mb-6 ${subTextColor} font-normal leading-relaxed`}>
              <p className="line-clamp-3">
                {society.description}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {society.faculty_head && (
                <div className={`flex items-center ${subTextColor} group`}>
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 mr-2">
                    <UserCircle className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  </div>
                  <span className="font-medium group-hover:text-indigo-500 transition-colors">
                    Faculty Head: <span className="font-normal">{society.faculty_head}</span>
                  </span>
                </div>
              )}
              
              {society.room && (
                <div className={`flex items-center ${subTextColor} group`}>
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 mr-2">
                    <MapPin className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  </div>
                  <span className="font-normal group-hover:text-indigo-500 transition-colors">{society.room}</span>
                </div>
              )}

              {society.email && (
                <div className={`flex items-center ${subTextColor} group`}>
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 mr-2">
                    <Mail className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  </div>
                  <a 
                    href={`mailto:${society.email}`} 
                    className="hover:text-indigo-600 font-normal truncate group-hover:text-indigo-500 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Email ${society.name} at ${society.email}`}
                  >
                    {society.email}
                  </a>
                </div>
              )}

              {society.phone_number && (
                <div className={`flex items-center ${subTextColor} group`}>
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 mr-2">
                    <Phone className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  </div>
                  <a 
                    href={`tel:${society.phone_number}`} 
                    className="hover:text-indigo-600 font-normal group-hover:text-indigo-500 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Call ${society.name} at ${society.phone_number}`}
                  >
                    {society.phone_number}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6 pl-1">
              {society.socialMedia.instagram && (
                <a
                  href={society.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform duration-300 text-pink-600 hover:text-pink-700 relative pulse-ring bounce-hover"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${society.name} Instagram`}
                >
                  <div className="p-2 hover:bg-pink-50 rounded-full transition-colors">
                    <Instagram size={20} />
                  </div>
                </a>
              )}
              {society.socialMedia.twitter && (
                <a
                  href={society.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform duration-300 text-blue-400 hover:text-blue-500 relative pulse-ring bounce-hover"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${society.name} Twitter`}
                >
                  <div className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <Twitter size={20} />
                  </div>
                </a>
              )}
              {society.socialMedia.linkedin && (
                <a
                  href={society.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform duration-300 text-blue-600 hover:text-blue-700 relative pulse-ring bounce-hover"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${society.name} LinkedIn`}
                >
                  <div className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <Linkedin size={20} />
                  </div>
                </a>
              )}
              {society.socialMedia.facebook && (
                <a
                  href={society.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform duration-300 text-blue-800 hover:text-blue-900 relative pulse-ring bounce-hover"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${society.name} Facebook`}
                >
                  <div className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <Facebook size={20} />
                  </div>
                </a>
              )}
            </div>

            {getRegistrationButton()}
            
            <div className="absolute bottom-3 right-3 flex items-center text-indigo-500 bg-indigo-50 rounded-full px-3 py-1 text-sm animate-pulse shadow-sm">
              <Info size={14} className="mr-1" />
              <span className="text-xs font-medium">Tap for info</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className={`flip-card-back absolute w-full h-full ${bgColor} rounded-xl overflow-hidden border ${borderColor} p-6 shadow-md`}
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
          onClick={() => setIsFlipped(false)}
          role="button"
          tabIndex={0}
          aria-label={`Return to ${society.name} summary`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsFlipped(false);
            }
          }}
        >
          {/* Add a subtle gradient overlay at the top */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-600/10 to-transparent z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 hover:bg-indigo-100 transition-colors"
                aria-label="Flip card back"
              >
                <ChevronLeft size={18} className="text-indigo-600" />
              </button>
              <h3 className={`text-xl font-bold tracking-tight ${textColor}`}>
                About {society.name}
              </h3>
            </div>
            
            <div className={`mb-6 ${subTextColor} font-normal leading-relaxed`}>
              <div className="rounded-lg bg-indigo-50/30 p-4 max-h-48 overflow-y-auto custom-scrollbar backdrop-blur-sm border border-indigo-100/30">
                {society.description}
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {society.faculty_head && (
                <div className={`flex items-center ${subTextColor} group hover:bg-indigo-50/30 p-2 rounded-lg transition-colors`}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 mr-3">
                    <UserCircle className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-medium text-indigo-600">Faculty Head</span>
                    <p className="font-normal">{society.faculty_head}</p>
                  </div>
                </div>
              )}

              {society.room && (
                <div className={`flex items-center ${subTextColor} group hover:bg-indigo-50/30 p-2 rounded-lg transition-colors`}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 mr-3">
                    <MapPin className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-medium text-indigo-600">Location</span>
                    <p className="font-normal">{society.room}</p>
                  </div>
                </div>
              )}

              {society.email && (
                <div className={`flex items-center ${subTextColor} group hover:bg-indigo-50/30 p-2 rounded-lg transition-colors`}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 mr-3">
                    <Mail className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-medium text-indigo-600">Email</span>
                    <p>
                      <a 
                        href={`mailto:${society.email}`} 
                        className="hover:text-indigo-600 font-normal"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Email ${society.name}`}
                      >
                        {society.email}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {society.phone_number && (
                <div className={`flex items-center ${subTextColor} group hover:bg-indigo-50/30 p-2 rounded-lg transition-colors`}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 mr-3">
                    <Phone className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  </div>
                  <div>
                    <span className="font-medium text-indigo-600">Phone</span>
                    <p>
                      <a 
                        href={`tel:${society.phone_number}`} 
                        className="hover:text-indigo-600 font-normal"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Call ${society.name}`}
                      >
                        {society.phone_number}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <div className={`flex items-center ${subTextColor} group hover:bg-indigo-50/30 p-2 rounded-lg transition-colors`}>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 mr-3">
                  <Clock className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                </div>
                <div>
                  <span className="font-medium text-indigo-600">Status</span>
                  <p className="font-normal capitalize">
                    {society.registrationStatus === 'open' && (
                      <span className="text-emerald-600 font-medium">Open for Registration</span>
                    )}
                    {society.registrationStatus === 'coming-soon' && (
                      <span className="text-amber-600 font-medium">Coming Soon</span>
                    )}
                    {society.registrationStatus === 'closed' && (
                      <span className="text-gray-600 font-medium">Registration Closed</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-2 ${textColor}`}>Connect with {society.name}</h4>
              <div className="flex items-center space-x-2">
                {society.socialMedia.instagram && (
                  <a
                    href={society.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${society.name} Instagram`}
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {society.socialMedia.twitter && (
                  <a
                    href={society.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-400 text-white rounded-lg hover:shadow-md transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${society.name} Twitter`}
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {society.socialMedia.linkedin && (
                  <a
                    href={society.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${society.name} LinkedIn`}
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {society.socialMedia.facebook && (
                  <a
                    href={society.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-800 text-white rounded-lg hover:shadow-md transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${society.name} Facebook`}
                  >
                    <Facebook size={18} />
                  </a>
                )}
              </div>
            </div>

            {getRegistrationButton()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS for custom scrollbar
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}
*/

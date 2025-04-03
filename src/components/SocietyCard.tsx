import React, { useState } from 'react';
import { type Society } from '../types';
import { type Theme } from '../lib/theme';
import { Instagram, Twitter, Linkedin, Facebook, ExternalLink, MapPin, ArrowRight, Clock, Lock, CheckCircle2, Info, Image as ImageIcon, Mail, Phone, UserCircle, RotateCcw } from 'lucide-react';

interface SocietyCardProps {
  society: Society;
  theme: Theme;
}

export function SocietyCard({ society, theme }: SocietyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleEmailClick = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
  };

  return (
    <div className="relative w-full max-w-md cursor-pointer transition-transform duration-700">
      <div className={`relative w-full h-full transform ${isFlipped ? 'rotate-y-180' : ''} transition-transform duration-700`}>
        {/* Front Side */}
        <div className={`absolute w-full h-full p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {society.logo_url && !imageError ? (
                <img
                  src={society.logo_url}
                  alt={society.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{society.name}</h3>
              {society.tagline && <p className="text-sm text-gray-500 italic">{society.tagline}</p>}
              <span className="px-3 py-1 text-sm rounded-full bg-red-200 text-red-800 font-medium">{society.category}</span>
            </div>
          </div>
          <p className="mb-6 text-gray-600 line-clamp-3">{society.description}</p>
          {society.email && (
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2 text-red-600" />
              <button 
                onClick={(e) => handleEmailClick(e, society.email!)}
                className="hover:text-red-600 transition-colors"
              >
                {society.email}
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <button onClick={() => setIsFlipped(!isFlipped)} className="px-3 py-1 bg-blue-500 text-white rounded-lg flex items-center">
              <RotateCcw size={16} className="mr-2" /> More Info
            </button>
          </div>
        </div>

        {/* Back Side */}
        <div className={`absolute w-full h-full p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} transform rotate-y-180`}>
          <h3 className="text-xl font-bold mb-4">More About {society.name}</h3>
          <p className="mb-4 text-gray-700">{society.description}</p>
          {society.faculty_head && (
            <div className="flex items-center mb-2">
              <UserCircle className="h-4 w-4 mr-2 text-red-600" />
              <span>Faculty Head: {society.faculty_head}</span>
            </div>
          )}
          <div className="mt-4 flex justify-between items-center">
            <button onClick={() => setIsFlipped(!isFlipped)} className="px-3 py-1 bg-gray-600 text-white rounded-lg flex items-center">
              <RotateCcw size={16} className="mr-2" /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

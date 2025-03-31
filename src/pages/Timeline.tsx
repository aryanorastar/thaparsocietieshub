import React, { useState, useEffect } from 'react';
import { Calendar, Star, Trophy, Sparkles, GraduationCap, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TimelineEvent } from '../types';
import toast from 'react-hot-toast';

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  Star,
  Trophy,
  Sparkles,
  GraduationCap
};

export function Timeline() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      setTimelineEvents(data || []);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      toast.error('Failed to load timeline events');
    } finally {
      setIsLoading(false);
    }
  };

  const formatEventDuration = (event: TimelineEvent) => {
    const startDate = new Date(event.event_date);
    
    if (event.end_date) {
      const endDate = new Date(event.end_date);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return `${days} days`;
    }

    if (event.duration_hours) {
      return `${event.duration_hours} hours`;
    }

    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-brand-teal">
          TIET Event Timeline
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Mark your calendar for these exciting events throughout the academic year
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-brand-red to-brand-teal rounded-full"></div>

          {/* Timeline Events */}
          <div className="space-y-8 md:space-y-16">
            {timelineEvents.map((event, index) => {
              const Icon = iconMap[event.icon] || Calendar;
              const duration = formatEventDuration(event);
              
              return (
                <div
                  key={event.id}
                  className={`flex flex-col md:flex-row items-start md:items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? 'md:text-right md:pr-8 pl-8 md:pl-0' : 'md:text-left md:pl-8 pl-8'
                  }`}>
                    <div className={`p-6 rounded-xl bg-white dark:bg-brand-grey border border-gray-200 dark:border-brand-grey transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${event.color} bg-opacity-10`}>
                        <Icon className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                      <div className={`text-sm font-semibold mb-3 bg-gradient-to-r ${event.color} bg-clip-text text-transparent`}>
                        {formatDate(event.event_date)}
                        {event.end_date && ` - ${formatDate(event.end_date)}`}
                      </div>
                      {duration && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Clock className="w-4 h-4" />
                          <span>{duration}</span>
                        </div>
                      )}
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
                      {event.venue && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline Point */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${event.color} shadow-lg transform transition-transform duration-300 hover:scale-110`}></div>
                  </div>

                  {/* Empty Space for Alignment */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Stat, PageContent, TimelineEvent } from '../types';
import { Users, Award, Calendar, Mail, Plus, Trash2, GraduationCap, Star, Trophy, Sparkles, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const iconMap: Record<string, React.ElementType> = {
  Users,
  Award,
  Calendar,
  Mail,
  GraduationCap,
  Star,
  Trophy,
  Sparkles
};

const colorOptions = [
  { label: 'Purple to Indigo', value: 'from-purple-500 to-indigo-500' },
  { label: 'Blue to Cyan', value: 'from-blue-500 to-cyan-500' },
  { label: 'Pink to Rose', value: 'from-pink-500 to-rose-500' },
  { label: 'Amber to Orange', value: 'from-amber-500 to-orange-500' },
  { label: 'Emerald to Teal', value: 'from-emerald-500 to-teal-500' }
];

interface ContentManagerProps {
  activeTab: 'content' | 'timeline';
}

export function ContentManager({ activeTab }: ContentManagerProps) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      
      const [statsData, contentData, timelineData] = await Promise.all([
        supabase.from('stats').select('*').order('order', { ascending: true }),
        supabase.from('page_content').select('*'),
        supabase.from('timeline_events').select('*').order('order', { ascending: true })
      ]);

      if (statsData.error) throw statsData.error;
      if (contentData.error) throw contentData.error;
      if (timelineData.error) throw timelineData.error;

      setStats(statsData.data || []);
      setPageContent(contentData.data || []);
      setTimelineEvents(timelineData.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (table: string, data: any) => {
    try {
      const { error } = await supabase
        .from(table)
        .upsert(data);

      if (error) throw error;

      toast.success('Content updated successfully');
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleDelete = async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Content deleted successfully');
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Page Content</h2>
            <button
              onClick={() => handleSave('page_content', {
                section: 'new-section',
                title: 'New Section',
                content: 'Section content'
              })}
              className="flex items-center px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </button>
          </div>
          
          <div className="grid gap-4">
            {pageContent.map((content) => (
              <div key={content.id} className="p-4 bg-white rounded-lg shadow">
                <input
                  value={content.section}
                  onChange={(e) => handleSave('page_content', { ...content, section: e.target.value })}
                  placeholder="Section ID"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  value={content.title}
                  onChange={(e) => handleSave('page_content', { ...content, title: e.target.value })}
                  placeholder="Title"
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={content.content}
                  onChange={(e) => handleSave('page_content', { ...content, content: e.target.value })}
                  placeholder="Content"
                  className="w-full p-2 mb-2 border rounded"
                  rows={4}
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete('page_content', content.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Timeline Events</h2>
            <button
              onClick={() => handleSave('timeline_events', {
                event_date: new Date().toISOString().split('T')[0],
                title: 'New Event',
                description: 'Event description',
                venue: 'Event Venue',
                icon: 'Calendar',
                color: 'from-purple-500 to-indigo-500',
                order: timelineEvents.length
              })}
              className="flex items-center px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </div>
          
          <div className="grid gap-4">
            {timelineEvents.map((event) => (
              <div key={event.id} className="p-4 bg-white rounded-lg shadow">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={event.event_date}
                      onChange={(e) => handleSave('timeline_events', { ...event, event_date: e.target.value })}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                    <input
                      type="date"
                      value={event.end_date || ''}
                      onChange={(e) => handleSave('timeline_events', { ...event, end_date: e.target.value || null })}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration in Hours (Optional)</label>
                  <input
                    type="number"
                    value={event.duration_hours || ''}
                    onChange={(e) => handleSave('timeline_events', { 
                      ...event, 
                      duration_hours: e.target.value ? parseFloat(e.target.value) : null,
                      end_date: null // Clear end_date if duration_hours is set
                    })}
                    placeholder="e.g., 2.5"
                    className="p-2 border rounded w-full"
                    step="0.5"
                    min="0"
                  />
                </div>

                <input
                  value={event.title}
                  onChange={(e) => handleSave('timeline_events', { ...event, title: e.target.value })}
                  
                  placeholder="Title"
                  className="w-full p-2 mb-4 border rounded"
                />
                
                <textarea
                  value={event.description}
                  onChange={(e) => handleSave('timeline_events', { ...event, description: e.target.value })}
                  placeholder="Description"
                  className="w-full p-2 mb-4 border rounded"
                  rows={2}
                />
                
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <input
                    value={event.venue}
                    onChange={(e) => handleSave('timeline_events', { ...event, venue: e.target.value })}
                    placeholder="Venue"
                    className="flex-1 p-2 border rounded"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <select
                    value={event.icon}
                    onChange={(e) => handleSave('timeline_events', { ...event, icon: e.target.value })}
                    className="p-2 border rounded"
                  >
                    {Object.keys(iconMap).map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <select
                    value={event.color}
                    onChange={(e) => handleSave('timeline_events', { ...event, color: e.target.value })}
                    className="p-2 border rounded"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <input
                    type="number"
                    value={event.order}
                    onChange={(e) => handleSave('timeline_events', { ...event, order: parseInt(e.target.value) })}
                    placeholder="Order"
                    className="w-20 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleDelete('timeline_events', event.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
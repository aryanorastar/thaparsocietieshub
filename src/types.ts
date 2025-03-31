export interface Society {
  id: string;
  name: string;
  description: string;
  room?: string;
  email?: string;
  phone_number?: string;
  registrationLink?: string;
  registrationStatus: 'open' | 'coming-soon' | 'closed';
  socialMedia: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  category: 'technical' | 'cultural' | 'sports' | 'academic' | 'travel' | 'internship';
  logo_url?: string;
  faculty_head?: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
  order: number;
  created_at: string;
}

export interface PageContent {
  id: string;
  section: string;
  title: string;
  content: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  month: string;
  event_date: string;
  end_date?: string;
  duration_hours?: number;
  title: string;
  description: string;
  venue: string;
  icon: string;
  color: string;
  order: number;
  created_at: string;
}
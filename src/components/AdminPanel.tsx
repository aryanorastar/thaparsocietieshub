import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { ContentManager } from './ContentManager';

export function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'societies' | 'content' | 'timeline'>('societies');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [society, setSociety] = useState({
    name: '',
    description: '',
    room: '',
    email: '',
    phone_number: '',
    registration_link: '',
    registration_status: 'coming-soon',
    category: 'technical',
    instagram: '',
    twitter: '',
    linkedin: '',
    facebook: '',
    logo_url: '',
    faculty_head: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setIsAuthenticated(true);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Check your email to verify your account!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('society_logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('society_logos')
        .getPublicUrl(fileName);

      setSociety({ ...society, logo_url: publicUrl });
      toast.success('Logo uploaded successfully!');
    } catch (error: any) {
      toast.error('Error uploading logo');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a copy of society data for submission
      const societyData = {
        ...society,
        // Convert phone_number to numeric if it exists
        phone_number: society.phone_number ? society.phone_number.replace(/\D/g, '') : null
      };

      const { error } = await supabase
        .from('societies')
        .insert([societyData]);

      if (error) throw error;

      toast.success('Society added successfully!');
      setSociety({
        name: '',
        description: '',
        room: '',
        email: '',
        phone_number: '',
        registration_link: '',
        registration_status: 'coming-soon',
        category: 'technical',
        instagram: '',
        twitter: '',
        linkedin: '',
        facebook: '',
        logo_url: '',
        faculty_head: ''
      });
      setPreviewUrl(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="glass-effect p-8 rounded-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Admin Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full bg-white text-indigo-600 py-2 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-all duration-300 mt-2"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="glass-effect p-8 rounded-xl max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Admin Dashboard
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('societies')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'societies'
                  ? 'bg-white text-indigo-600'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Manage Societies
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'content'
                  ? 'bg-white text-indigo-600'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Manage Content
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'timeline'
                  ? 'bg-white text-indigo-600'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Manage Timeline
            </button>
          </div>
        </div>

        {activeTab === 'societies' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Logo Upload Section */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Add Logo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {isUploading && (
                <div className="mt-2 text-sm text-indigo-600">Uploading...</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={society.name}
                  onChange={(e) => setSociety({ ...society, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room (Optional)</label>
                <input
                  type="text"
                  value={society.room}
                  onChange={(e) => setSociety({ ...society, room: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={society.email}
                  onChange={(e) => setSociety({ ...society, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={society.phone_number}
                  onChange={(e) => {
                    // Only allow numbers and basic formatting characters
                    const value = e.target.value.replace(/[^\d-+() ]/g, '');
                    setSociety({ ...society, phone_number: value });
                  }}
                  placeholder="e.g., +91 1234567890"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Head</label>
              <input
                type="text"
                value={society.faculty_head}
                onChange={(e) => setSociety({ ...society, faculty_head: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Dr. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={society.description}
                onChange={(e) => setSociety({ ...society, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={society.category}
                  onChange={(e) => setSociety({ ...society, category: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="technical">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="academic">Academic</option>
                  <option value="travel">Travel</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Status</label>
                <select
                  value={society.registration_status}
                  onChange={(e) => setSociety({ ...society, registration_status: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="coming-soon">Coming Soon</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
              <input
                type="url"
                value={society.registration_link}
                onChange={(e) => setSociety({ ...society, registration_link: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="url"
                  value={society.instagram}
                  onChange={(e) => setSociety({ ...society, instagram: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input
                  type="url"
                  value={society.twitter}
                  onChange={(e) => setSociety({ ...society, twitter: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={society.linkedin}
                  onChange={(e) => setSociety({ ...society, linkedin: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="url"
                  value={society.facebook}
                  onChange={(e) => setSociety({ ...society, facebook: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Add Society
            </button>
          </form>
        ) : (
          <ContentManager activeTab={activeTab} />
        )}
      </div>
    </div>
  );
}
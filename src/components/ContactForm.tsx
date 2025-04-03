import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Send data to Supabase
    const { error } = await supabase.from('contacts').insert([{ name, email, message }]);

    if (error) {
      toast.error('Error sending message.');
      console.error(error);
      return;
    }

    toast.success('Message sent successfully!');

    // Construct Gmail URL
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=your-email@gmail.com&su=New Contact Form Submission&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    // Open Gmail in a new tab
    window.open(gmailURL, '_blank');

    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="glass-effect rounded-xl overflow-hidden p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-brand-grey text-gray-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-brand-grey text-gray-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-red focus:border-transparent bg-white dark:bg-brand-grey text-gray-900 dark:text-white"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-red text-white py-2 rounded-lg hover:bg-brand-red/90 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>Send Message</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

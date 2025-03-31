import React from 'react';
import { Users, Calendar, Mail } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';

export function About() {
  return (
    <div className="space-y-20">
      {/* Mission Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          To create a vibrant and inclusive community where every student can discover, 
          join, and thrive in societies that match their interests and aspirations.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Users, label: "Active Societies", value: "50+" },
          { icon: Calendar, label: "Annual Events", value: "100+" },
          { icon: Mail, label: "Student Reach", value: "5000+" }
        ].map((stat, index) => (
          <div key={index} className="text-center p-6 rounded-xl bg-white dark:bg-brand-grey border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="w-12 h-12 mx-auto bg-brand-red/10 dark:bg-brand-red/20 rounded-lg flex items-center justify-center mb-4">
              <stat.icon className="text-brand-red" />
            </div>
            <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Contact Section */}
      <section className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-brand-teal">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300">Have questions about our societies? We're here to help!</p>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
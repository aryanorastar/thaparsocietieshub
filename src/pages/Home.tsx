import React from 'react';
import { ArrowRight, Info, Users, LinkIcon, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsSection } from '../components/NewsSection';

export function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-brand-teal">
          Discover Your College Societies in One Place
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Welcome to the ultimate hub for all college societies! Find everything you need in one convenient location.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/societies"
            className="px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-brand-red/90 transition-all duration-300 flex items-center group"
          >
            Explore Societies
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 border border-brand-red text-brand-red rounded-lg hover:bg-brand-red/10 transition-all duration-300 flex items-center"
          >
            Learn More
            <Info className="ml-2" />
          </Link>
        </div>
      </section>

      {/* News Section */}
      <NewsSection />

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl bg-white dark:bg-brand-grey border border-gray-200 dark:border-brand-grey">
          <div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center mb-4">
            <Users className="text-brand-red" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Access to Information</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant access to society details and updates.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-brand-grey border border-gray-200 dark:border-brand-grey">
          <div className="w-12 h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center mb-4">
            <LinkIcon className="text-brand-gold" />
          </div>
          <h3 className="text-xl font-semibold mb-2">One-Click Registration Links</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Join your favorite societies with just a click.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-brand-grey border border-gray-200 dark:border-brand-grey">
          <div className="w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="text-brand-teal" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Direct Contact Details</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Reach out to societies directly for inquiries.
          </p>
        </div>
      </section>
    </div>
  );
}
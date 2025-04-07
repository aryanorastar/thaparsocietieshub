import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { NewsItem } from '../types';
import { Calendar, Tag, ChevronRight, Newspaper, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export function NewsSection({ compact = false }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', ...new Set(news.map(item => item.category))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredNews = news.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  const handleReadMore = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <div className={compact ? "py-8" : "py-12"}>
      {/* Featured News */}
      {!compact && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-brand-teal flex items-center">
            <Newspaper className="mr-2" />
            Latest News
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {news.filter(item => item.featured).slice(0, 2).map(item => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-brand-grey border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleReadMore(item.id)}
              >
                {item.image_url ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-brand-red/10 to-brand-teal/10 flex items-center justify-center">
                    <Star className="w-12 h-12 text-brand-gold" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 text-sm rounded-full bg-brand-red/10 text-brand-red font-medium">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {item.content}
                  </p>
                  <button 
                    className="mt-4 text-brand-red flex items-center group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadMore(item.id);
                    }}
                  >
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-4">
        <Tag className="w-4 h-4 text-brand-gold flex-shrink-0" />
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 ${
              activeCategory === category
                ? 'bg-brand-red text-white'
                : 'bg-white dark:bg-brand-grey text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        </div>
      ) : (
        <div className={`grid ${compact ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
          {filteredNews.filter(item => !item.featured).slice(0, compact ? 4 : undefined).map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-brand-grey rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleReadMore(item.id)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 text-sm rounded-full bg-brand-red/10 text-brand-red font-medium">
                  {item.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(item.published_at)}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {item.content}
              </p>
              <button 
                className="text-brand-red flex items-center group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReadMore(item.id);
                }}
              >
                Read More
                <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}

      {compact && filteredNews.length > 4 && (
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/news')}
            className="inline-flex items-center px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-brand-red/90 transition-all duration-300"
          >
            View All News
            <ChevronRight className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}
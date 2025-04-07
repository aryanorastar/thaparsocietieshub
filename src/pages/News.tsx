import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { NewsItem } from '../types';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsSection } from '../components/NewsSection';
import toast from 'react-hot-toast';

export function News() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNewsItem(id);
    }
  }, [id]);

  const fetchNewsItem = async (newsId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error) throw error;

      setNewsItem(data);
    } catch (error) {
      console.error('Error fetching news item:', error);
      toast.error('Failed to load news article');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: newsItem?.title,
        text: newsItem?.content,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!id) {
    return <NewsSection />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">News article not found</h2>
        <Link
          to="/news"
          className="text-brand-red hover:text-brand-red/80 flex items-center justify-center"
        >
          <ArrowLeft className="mr-2" />
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Link
        to="/news"
        className="inline-flex items-center text-brand-red hover:text-brand-red/80 mb-8"
      >
        <ArrowLeft className="mr-2" />
        Back to News
      </Link>

      <article className="bg-white dark:bg-brand-grey rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-12">
        {newsItem.image_url && (
          <img
            src={newsItem.image_url}
            alt={newsItem.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}

        <div className="flex items-center justify-between mb-6">
          <span className="px-4 py-2 rounded-full bg-brand-red/10 text-brand-red font-medium">
            {newsItem.category}
          </span>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {newsItem.title}
        </h1>

        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-8">
          <Calendar className="w-5 h-5 mr-2" />
          {formatDate(newsItem.published_at)}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {newsItem.content}
          </p>
        </div>
      </article>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">More News</h2>
        <NewsSection compact />
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Search, Filter, Zap, Menu, X } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { SocietyCard } from './components/SocietyCard';
import { AdminPanel } from './components/AdminPanel';
import { ChatBox } from './components/ChatBox';
import { ThemeToggle } from './components/ThemeToggle';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Timeline } from './pages/Timeline';
import { supabase } from './lib/supabase';
import { Society } from './types';
import { Theme, getTheme, setTheme } from './lib/theme';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [registrationFilter, setRegistrationFilter] = useState<string>('all');
  const [scrollY, setScrollY] = useState(0);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [splineError, setSplineError] = useState<Error | null>(null);
  const [splineLoading, setSplineLoading] = useState(true);
  const [theme, setCurrentTheme] = useState<Theme>(getTheme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoUrl = "https://edidmtoggnzkwvjtxtmo.supabase.co/storage/v1/object/sign/society_logos/8ee85e4b12c233233fcd37e3fa29e51f.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb2NpZXR5X2xvZ29zLzhlZTg1ZTRiMTJjMjMzMjMzZmNkMzdlM2ZhMjllNTFmLmpwZyIsImlhdCI6MTc0MzIzOTM2OCwiZXhwIjoxMDM4MzIzOTM2OH0.EBz5QwZzpZZejJmD6a4OeejA_Gynix64y6h0_EYcdW4";

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  useEffect(() => {
    fetchSocieties();
    checkAdmin();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      document.documentElement.style.setProperty('--parallax-translate', `${scrollY * 0.1}px`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const fetchSocieties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('societies')
        .select('*');
      
      if (error) {
        throw error;
      }

      setSocieties(data.map(society => ({
        id: society.id,
        name: society.name,
        description: society.description,
        room: society.room,
        email: society.email,
        phone_number: society.phone_number,
        registrationLink: society.registration_link,
        registrationStatus: society.registration_status,
        category: society.category,
        logo_url: society.logo_url,
        faculty_head: society.faculty_head,
        socialMedia: {
          instagram: society.instagram,
          linkedin: society.linkedin,
          facebook: society.facebook
        }
      })));
    } catch (error: any) {
      console.error('Error fetching societies:', error);
      toast.error('Failed to load societies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAdmin) {
    return <AdminPanel />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Extract unique categories for filter options
  const categories = ['all', ...new Set(societies.map(society => society.category))];

  return (
    <Router>
      <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-brand-black' : 'bg-light-background'}`}>
        <Toaster position="top-right" />
        
        {/* Background */}
        <div className="fixed inset-0 z-0">
          {splineError || splineLoading ? (
            <div className={`w-full h-full ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-brand-black via-brand-grey to-brand-black' 
                : 'bg-gradient-to-br from-light-background via-light-card to-light-background'
            } animate-gradient`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-red to-transparent" />
            </div>
          ) : (
            <div className={`w-full h-full transition-opacity duration-500 ${
              theme === 'dark' ? 'opacity-30' : 'opacity-10'
            }`}>
              <Spline 
                scene="https://prod.spline.design/particlesflow-84592835d2b4d04a02d44ecc2ee42ba9/scene.splinecode"
                onLoad={() => setSplineLoading(false)}
                onError={(error) => {
                  console.error("Spline loading error:", error);
                  setSplineError(error);
                  setSplineLoading(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Header */}
        <header className={`relative sticky top-0 z-50 border-b ${
          theme === 'dark'
            ? 'glass-effect-dark border-brand-grey'
            : 'bg-white/80 backdrop-blur-md border-light-border'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <img 
                    src={logoUrl}
                    alt="Thapar Logo" 
                    className="h-16 w-auto"
                  />
                </Link>
                <div>
                  <h1 className={`text-xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}>
                    Thapar Societies Hub
                  </h1>
                  <p className="text-sm text-brand-gold flex items-center">
                    Discover. Connect. Thrive
                    <Zap className="h-4 w-4 ml-2 text-brand-red animate-pulse" />
                  </p>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-brand-red/10"
              >
                {isMobileMenuOpen ? (
                  <X className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-light-text'}`} />
                ) : (
                  <Menu className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-light-text'}`} />
                )}
              </button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <nav>
                  <ul className="flex space-x-6">
                    <li>
                      <Link to="/" className={`hover:text-brand-red transition-colors ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}>
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/societies" className={`hover:text-brand-red transition-colors ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}>
                        Societies
                      </Link>
                    </li>
                    <li>
                      <Link to="/timeline" className={`hover:text-brand-red transition-colors ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}>
                        Timeline
                      </Link>
                    </li>
                    <li>
                      <Link to="/about" className={`hover:text-brand-red transition-colors ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}>
                        About
                      </Link>
                    </li>
                  </ul>
                </nav>
                <ThemeToggle currentTheme={theme} onThemeChange={setCurrentTheme} />
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <nav className="lg:hidden mt-4 pb-4">
                <ul className="space-y-4">
                  <li>
                    <Link 
                      to="/" 
                      className={`block hover:text-brand-red transition-colors ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/societies" 
                      className={`block hover:text-brand-red transition-colors ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Societies
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/timeline" 
                      className={`block hover:text-brand-red transition-colors ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Timeline
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/about" 
                      className={`block hover:text-brand-red transition-colors ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <div className="pt-2">
                      <ThemeToggle currentTheme={theme} onThemeChange={setCurrentTheme} />
                    </div>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/societies" element={
              <>
                {/* Search and Filter Section */}
                <div className="mb-12 space-y-6">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-brand-teal rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gold" size={20} />
                      <input
                        type="text"
                        placeholder="Search societies..."
                        className={`pl-10 pr-4 py-2.5 backdrop-blur-sm border-0 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand-red transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-brand-black/90 text-white'
                            : 'bg-light-card text-light-text'
                        }`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Multi-filter section with glow effect */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-teal via-brand-gold to-brand-red rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className={`relative p-4 rounded-lg ${
                      theme === 'dark'
                        ? 'glass-effect-dark border border-brand-grey/30'
                        : 'bg-light-card/80 border border-light-border'
                      }`}>
                      <h3 className={`text-lg font-medium mb-3 flex items-center ${theme === 'dark' ? 'text-white' : 'text-light-text'}`}>
                        <Filter className="h-5 w-5 mr-2 text-brand-gold" />
                        Filters
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Registration Status Filter */}
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-brand-gold rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
                          <div className="relative">
                            <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-white/80' : 'text-light-text/80'}`}>
                              Registration Status
                            </label>
                            <select
                              value={registrationFilter}
                              onChange={(e) => setRegistrationFilter(e.target.value)}
                              className={`backdrop-blur-sm border-0 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-red ${
                                theme === 'dark'
                                  ? 'bg-brand-black/90 text-white'
                                  : 'bg-light-card text-light-text'
                              }`}
                            >
                              <option value="all">All Registrations</option>
                              <option value="open">Open</option>
                              <option value="coming-soon">Coming Soon</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </div>

                        {/* Society Category Filter */}
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-teal rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
                          <div className="relative">
                            <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-white/80' : 'text-light-text/80'}`}>
                              Society Type
                            </label>
                            <select
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className={`backdrop-blur-sm border-0 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-red ${
                                theme === 'dark'
                                  ? 'bg-brand-black/90 text-white'
                                  : 'bg-light-card text-light-text'
                              }`}
                            >
                              <option value="all">All Categories</option>
                              {categories
                                .filter(category => category !== 'all')
                                .sort()
                                .map((category) => (
                                  <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto"></div>
                    <p className="mt-4 text-brand-gold">Loading societies...</p>
                  </div>
                )}

                {/* Societies Grid */}
                {!isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {societies
                      .filter(society => {
                        const matchesSearch = society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           society.description.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesCategory = selectedCategory === 'all' || society.category === selectedCategory;
                        const matchesRegistration = registrationFilter === 'all' || society.registrationStatus === registrationFilter;
                        return matchesSearch && matchesCategory && matchesRegistration;
                      })
                      .map((society, index) => (
                        <div
                          key={society.id}
                          className="society-card transform hover:scale-105 transition-all duration-300"
                          style={{ '--animation-delay': `${index * 0.1}s` } as React.CSSProperties}
                        >
                          <SocietyCard society={society} theme={theme} />
                        </div>
                      ))
                    }
                  </div>
                )}

                {/* No Results */}
                {!isLoading && societies.filter(society => {
                  const matchesSearch = society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     society.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = selectedCategory === 'all' || society.category === selectedCategory;
                  const matchesRegistration = registrationFilter === 'all' || society.registrationStatus === registrationFilter;
                  return matchesSearch && matchesCategory && matchesRegistration;
                }).length === 0 && (
                  <div className="relative group mb-12">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-brand-teal rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className={`relative text-center py-12 rounded-lg ${
                      theme === 'dark'
                        ? 'glass-effect-dark'
                        : 'bg-light-card'
                    }`}>
                      <p className="text-brand-gold text-lg">No societies found matching your search criteria.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setRegistrationFilter('all');
                        }}
                        className="mt-4 px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red/80 transition transform hover:scale-105"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </>
            } />
          </Routes>
        </main>

        {/* Chat Box */}
        <ChatBox theme={theme} />
      </div>
    </Router>
  );
}

export default App;

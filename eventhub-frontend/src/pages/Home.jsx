import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEvents } from '../services/eventService';
import CardEvent from '../components/CardEvent';
import { LayoutGrid, Loader2, Search, Filter, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const CATEGORIES = ['Semua', 'Teknologi', 'Musik', 'Bisnis'];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.error) {
      setToast({ show: true, message: location.state.error });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Gagal mengambil data event. Apakah backend berjalan?');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 pt-24 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-200 text-sm font-semibold mb-6 border border-blue-400/30 backdrop-blur-sm">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Platform Event No.1 di Indonesia
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Temukan <span className="text-blue-400">Pengalaman</span> Tak Terlupakan
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light">
            EventHub menghubungkan Anda dengan workshop, konferensi, dan meetup paling inspiratif di kota Anda. Jangan sampai terlewatkan!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16 relative z-20 pb-20">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-12 flex flex-col lg:flex-row gap-4 justify-between items-center border border-gray-100">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white transition-colors sm:text-sm font-medium"
              placeholder="Cari nama event, topik, atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
            <div className="hidden lg:flex items-center justify-center bg-gray-100 w-10 h-10 rounded-full mr-2">
              <Filter className="w-5 h-5 text-gray-500" />
            </div>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === category 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium text-lg">Memuat event keren untukmu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-10 text-center max-w-2xl mx-auto shadow-sm">
            <p className="text-red-600 font-bold text-xl mb-2">Oops! Terjadi Kesalahan</p>
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center max-w-3xl mx-auto shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6 border-8 border-white shadow-sm">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Tidak ada event yang cocok</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori filter yang lain.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
              className="px-8 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition-colors"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <CardEvent key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 flex items-center px-6 py-4 rounded-xl shadow-2xl z-50 text-white font-medium bg-red-600"
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;

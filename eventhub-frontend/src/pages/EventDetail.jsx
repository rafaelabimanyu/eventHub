import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventById } from '../services/eventService';
import { bookTicket, checkRegistration } from '../services/ticketService';
import { AuthContext } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';
import { Calendar, MapPin, ArrowLeft, Loader2, Tag, Users, CheckCircle, Ticket } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Registration States
  const [registered, setRegistered] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
        
        // If logged in, check if already registered
        if (user) {
          const check = await checkRegistration(id);
          if (check.isRegistered) {
            setRegistered(true);
            setTicketData(check.ticket);
          }
        }
      } catch (err) {
        setError('Gagal memuat detail event. Event mungkin tidak ditemukan.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, user]);

  const handleBooking = async () => {
    if (!user) {
      showToast('Silakan login terlebih dahulu untuk mendaftar', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setBookingLoading(true);
    try {
      const response = await bookTicket(id);
      showToast('Pendaftaran Berhasil!');
      setRegistered(true);
      setTicketData(response.ticket);
      setEvent(prev => ({ ...prev, quota: prev.quota - 1 })); // Decrement real-time quota
      setShowTicketModal(true);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Gagal mendaftar event', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat detail event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 px-4">
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-semibold mb-2">Oops!</p>
          <p className="text-red-500 mb-6">{error || 'Event tidak ditemukan'}</p>
          <Link to="/" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Event
        </Link>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="px-8 pb-10">
            <div className="relative -mt-12 flex justify-between items-end mb-8">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-50">
                <div className="bg-blue-50 text-blue-700 font-bold px-6 py-4 rounded-xl text-center">
                  <div className="text-sm uppercase tracking-wider mb-1">{new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}</div>
                  <div className="text-3xl">{new Date(event.date).getDate()}</div>
                </div>
              </div>
              <div className="flex space-x-3 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Tag className="w-3.5 h-3.5 mr-1.5" />
                  {event.category || 'Umum'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  Sisa Kuota: {event.quota}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {event.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2.5 rounded-xl mr-4 text-blue-600 mt-0.5">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">Tanggal & Waktu</h3>
                    <p className="text-slate-600">{formattedDate} WIB</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2.5 rounded-xl mr-4 text-blue-600 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">Lokasi</h3>
                    <p className="text-slate-600">{event.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
                <h3 className="font-semibold text-slate-900 mb-2">Pendaftaran Event</h3>
                <p className="text-slate-500 text-sm mb-5">
                  {registered ? 'Tiket Anda sudah diterbitkan dan aman.' : `Segera daftar sebelum kehabisan kuota! Hanya tersisa ${event.quota} kursi.`}
                </p>
                
                {registered ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-center py-3 px-4 rounded-xl bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Anda Sudah Terdaftar
                    </div>
                    <button 
                      onClick={() => setShowTicketModal(true)}
                      className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 border border-indigo-100 transition-colors shadow-sm"
                    >
                      <Ticket className="w-5 h-5 mr-2" />
                      Lihat E-Ticket Saya
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleBooking}
                    disabled={event.quota <= 0 || bookingLoading}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (event.quota > 0 ? 'Daftar Event Sekarang' : 'Kuota Penuh')}
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                Tentang Event Ini
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TicketModal 
        isOpen={showTicketModal} 
        onClose={() => setShowTicketModal(false)} 
        ticket={ticketData} 
        event={event} 
        user={user} 
      />

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 flex items-center px-6 py-4 rounded-xl shadow-2xl z-50 text-white font-medium ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <div className="w-5 h-5 mr-3 font-bold">!</div>}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventDetail;

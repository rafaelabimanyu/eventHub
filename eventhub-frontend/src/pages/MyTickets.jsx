import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { getMyTickets } from '../services/ticketService';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, MapPin, Tag, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';

const MyTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle className="w-3.5 h-3.5 mr-1" /> BERHASIL</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5 mr-1" /> MENUNGGU PEMBAYARAN</span>;
      case 'CHECKED_IN':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><CheckCircle className="w-3.5 h-3.5 mr-1" /> CHECKED IN</span>;
      case 'FAILED':
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><XCircle className="w-3.5 h-3.5 mr-1" /> GAGAL</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Tiket Saya</h1>
          <p className="text-slate-500">Kelola tiket dan riwayat pendaftaran event Anda.</p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Tag className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Tiket</h3>
            <p className="text-slate-500 mb-6">Anda belum mendaftar ke event manapun.</p>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Cari Event Sekarang
            </Link>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <motion.div key={ticket.id} variants={itemVariants} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex h-full flex-col">
                  {/* Event Image */}
                  <div className="h-32 bg-gray-200 relative overflow-hidden">
                     {ticket.event.image ? (
                        <img src={`http://localhost:5000${ticket.event.image}`} alt={ticket.event.title} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                     )}
                     <div className="absolute top-3 right-3">
                        {getStatusBadge(ticket.status)}
                     </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{ticket.event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-slate-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(ticket.event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center text-slate-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="truncate">{ticket.event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 pt-0 mt-auto border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                       <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Ticket ID</span>
                       <span className="font-mono text-xs font-semibold text-slate-700">{ticket.id.substring(0, 8).toUpperCase()}</span>
                    </div>
                    <Link to={`/event/${ticket.eventId}`} className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                      Lihat Event <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;

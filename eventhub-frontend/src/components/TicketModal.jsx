import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { X, Calendar, MapPin, Ticket, User } from 'lucide-react';

const TicketModal = ({ isOpen, onClose, ticket, event, user }) => {
  if (!isOpen || !ticket || !event || !user) return null;

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md relative"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button outside ticket */}
          <button 
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Ticket Design */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Top Pattern */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              <h2 className="text-white text-xl font-bold tracking-widest uppercase relative z-10">E-Ticket</h2>
            </div>

            {/* Ticket Info */}
            <div className="p-8 pt-6 relative bg-white">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{event.title}</h3>
                <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
                  {event.category}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-slate-700">
                  <User className="w-5 h-5 mr-3 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Nama Peserta</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center text-slate-700">
                  <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Waktu Pelaksanaan</p>
                    <p className="font-semibold text-sm">{formattedDate} WIB</p>
                  </div>
                </div>
                <div className="flex items-center text-slate-700">
                  <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Lokasi</p>
                    <p className="font-semibold text-sm">{event.location}</p>
                  </div>
                </div>
              </div>

              {/* Dotted Line Separator */}
              <div className="relative flex items-center my-6">
                <div className="absolute -left-12 w-6 h-6 bg-slate-900/60 rounded-full"></div>
                <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                <div className="absolute -right-12 w-6 h-6 bg-slate-900/60 rounded-full"></div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Scan untuk Masuk</p>
                <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                  <QRCodeSVG 
                    value={ticket.id} 
                    size={160}
                    bgColor={"#ffffff"}
                    fgColor={"#0f172a"}
                    level={"Q"}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-4 font-mono">TICKET ID: {ticket.id.split('-')[0]}</p>
              </div>
            </div>
            
            {/* Bottom Color Bar */}
            <div className="h-4 bg-blue-600"></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TicketModal;

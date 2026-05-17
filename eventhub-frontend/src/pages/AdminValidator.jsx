import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkInTicket } from '../services/ticketService';
import { ScanLine, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AdminValidator = () => {
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success: boolean, message: string, data?: any }

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await checkInTicket(ticketId.trim());
      setResult({
        success: true,
        message: 'Check-in Berhasil!',
        data: response.ticket
      });
      setTicketId(''); // Reset input on success
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Check-in gagal. ID tidak valid atau tiket belum lunas.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <ScanLine className="w-6 h-6 mr-2 text-blue-600" />
          Validator Tiket
        </h1>
        <p className="text-gray-500">Scan QR Code atau masukkan Ticket ID untuk check-in pengunjung.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleCheckIn}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket ID</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Masukkan ID Tiket..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
              required
            />
            <button
              type="submit"
              disabled={loading || !ticketId.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center shadow-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Verifikasi'}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.success ? 'success' : 'error'}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`rounded-2xl p-6 border ${
              result.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start">
              {result.success ? (
                <div className="bg-emerald-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
              
              <div>
                <h3 className={`text-xl font-bold mb-1 ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
                  {result.message}
                </h3>
                {result.success && result.data && (
                  <div className="mt-4 bg-white/60 rounded-xl p-4">
                    <p className="text-sm text-emerald-900 mb-1"><span className="font-semibold">Nama Pengunjung:</span> {result.data.user?.name}</p>
                    <p className="text-sm text-emerald-900"><span className="font-semibold">Ticket ID:</span> <span className="font-mono">{result.data.id}</span></p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminValidator;

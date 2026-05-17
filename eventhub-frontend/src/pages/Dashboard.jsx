import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { getOrganizerEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import { AuthContext } from '../context/AuthContext';
import EventModal from '../components/EventModal';
import { CalendarDays, Users, Ticket, Plus, Edit2, Trash2, Calendar, MapPin, LayoutDashboard, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not logged in or not an organizer/admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchMyEvents = async () => {
    try {
      const data = await getOrganizerEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await createEvent(formData);
      }
      setIsModalOpen(false);
      fetchMyEvents();
    } catch (error) {
      alert(error?.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus event ini?')) {
      try {
        await deleteEvent(id);
        fetchMyEvents();
      } catch (error) {
        alert('Gagal menghapus event');
      }
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const totalEvents = events.length;
  const totalQuota = events.reduce((sum, e) => sum + e.quota, 0);

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex min-h-[calc(100vh-64px)] bg-gray-50 overflow-hidden"
    >
      {/* Sidebar - Animated Width */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-gray-200 hidden md:flex flex-col z-10 whitespace-nowrap"
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-50 h-16">
          {sidebarOpen && <span className="font-bold text-gray-700 px-2">Organizer Menu</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 mx-auto"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center w-full p-3 rounded-xl bg-blue-50 text-blue-700 font-medium transition-colors">
            <CalendarDays className="w-5 h-5 min-w-[20px]" />
            {sidebarOpen && <span className="ml-3">My Events</span>}
          </button>
          <button className="flex items-center w-full p-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">
            <Settings className="w-5 h-5 min-w-[20px]" />
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </button>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 w-full">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Event</h1>
              <p className="text-gray-500 mt-1">Kelola dan pantau semua event Anda di sini.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreateModal}
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Buat Event Baru
            </motion.button>
          </div>

          {/* Stats Cards with Stagger Animation */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
              <div className="p-4 bg-blue-100 text-blue-600 rounded-xl mr-5">
                <CalendarDays className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1">Total Event Aktif</p>
                <h3 className="text-3xl font-black text-gray-900">{totalEvents}</h3>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 pointer-events-none"></div>
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl mr-5">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1">Total Tiket/Kuota</p>
                <h3 className="text-3xl font-black text-gray-900">{totalQuota}</h3>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-50 rounded-full opacity-50 pointer-events-none"></div>
              <div className="p-4 bg-purple-100 text-purple-600 rounded-xl mr-5">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1">Peserta Terdaftar</p>
                <h3 className="text-3xl font-black text-gray-900">0</h3>
              </div>
            </motion.div>
          </motion.div>

          {/* Event List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Daftar Event Anda</h2>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-gray-500">Memuat data...</div>
            ) : events.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada event</h3>
                <p className="text-gray-500 mb-6">Anda belum membuat event apa pun. Mulai buat event pertama Anda!</p>
                <button onClick={openCreateModal} className="text-blue-600 font-bold hover:underline">Buat Event Sekarang</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Event</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal & Lokasi</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {events.map((event) => (
                      <motion.tr 
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                        className="transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-500">Kuota: {event.quota}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(event.date).toLocaleDateString('id-ID')}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {event.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(event)}
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(event.id)}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingEvent}
      />
    </motion.div>
  );
};

export default Dashboard;

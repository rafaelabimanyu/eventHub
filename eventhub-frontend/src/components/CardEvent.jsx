import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Tag, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const CardEvent = ({ event }) => {
  const { id, title, date, location, description, category, quota } = event;
  
  const formattedDate = new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white shadow rounded-xl p-5 border border-gray-200 flex flex-col hover:shadow-xl transition-shadow duration-300 h-full"
    >
      
      {/* Image */}
      <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden -mx-5 -mt-5 mb-4 relative">
        {event.image ? (
          <img src={`http://localhost:5000${event.image}`} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow">
          {event.price > 0 ? `Rp ${event.price.toLocaleString('id-ID')}` : 'Gratis'}
        </div>
      </div>

      {/* Badges */}
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700">
          <Tag className="w-3 h-3 mr-1" />
          {category || 'Umum'}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700">
          <Users className="w-3 h-3 mr-1" />
          Sisa: {quota}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
        {title}
      </h3>
      
      {/* Date & Location */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
        {description}
      </p>
      
      {/* Action Button */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link to={`/event/${id}`} className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors duration-200">
          Lihat Detail Event
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </motion.div>
  );
};

export default CardEvent;

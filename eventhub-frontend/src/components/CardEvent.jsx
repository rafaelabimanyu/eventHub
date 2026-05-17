import React from 'react';
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
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative h-full">
      {/* Decorative gradient top bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Badges */}
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            <Tag className="w-3 h-3 mr-1.5" />
            {category || 'Umum'}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Users className="w-3 h-3 mr-1.5" />
            Sisa: {quota}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {title}
        </h3>
        
        {/* Date & Location */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm font-medium">
            <Calendar className="w-4 h-4 mr-2.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm font-medium">
            <MapPin className="w-4 h-4 mr-2.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
          {description}
        </p>
        
        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link to={`/event/${id}`} className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white font-bold text-sm transition-all duration-300 group-hover:shadow-md">
            Lihat Detail Event
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardEvent;

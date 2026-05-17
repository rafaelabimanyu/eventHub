import React from 'react';
import { Calendar, MapPin, ArrowRight, Tag, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const CardEvent = ({ event }) => {
  const { id, title, date, location, description, category, quota } = event;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {category || 'Umum'}
          </span>
          <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            <Users className="w-3 h-3 mr-1" />
            Sisa: {quota}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-slate-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>{location}</span>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-6 flex-grow">
          {description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100">
          <Link to={`/event/${id}`} className="w-full flex items-center justify-center py-2 px-4 rounded-xl bg-slate-50 text-slate-700 font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all duration-200">
            Lihat Detail
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardEvent;

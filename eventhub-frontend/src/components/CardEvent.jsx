import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const CardEvent = ({ event }) => {
  const { title, date, location, description } = event;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-slate-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>{location}</span>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-6">
          {description}
        </p>
        
        <button className="w-full flex items-center justify-center py-2 px-4 rounded-xl bg-slate-50 text-slate-700 font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all duration-200">
          View Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default CardEvent;

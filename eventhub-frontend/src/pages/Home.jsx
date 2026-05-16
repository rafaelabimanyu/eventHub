import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';
import CardEvent from '../components/CardEvent';
import { LayoutGrid, Loader2 } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to fetch events. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Discover Local Events
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mb-4">
            Find Your Next <span className="text-blue-600">Experience</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            EventHub connects you with the best workshops, meetups, and conferences in your area.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading amazing events...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-xl mx-auto">
            <p className="text-red-600 font-semibold mb-2">Oops!</p>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <CardEvent key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Events } from '@/entities';
import { Image } from '@/components/ui/image';

// All event dates are church (South African) calendar days. Wix date fields
// arrive as "YYYY-MM-DD"; read them as plain days so no browser time zone can
// shift them, and compare against today's date in South Africa.
const SA_TIME_ZONE = 'Africa/Johannesburg';

const dayOf = (value?: Date | string): string => {
  if (!value) return '';
  if (value instanceof Date) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: SA_TIME_ZONE }).format(value);
  }
  return String(value).slice(0, 10);
};

// Local-midnight Date for a "YYYY-MM-DD" day, safe to pass to date-fns format.
const toLocalDate = (day: string) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// "Sunday, October 4, 2026" for one day; "29 Sep – 4 Oct 2026" for a range.
const formatEventDates = (start: string, end: string) => {
  if (!end || end <= start) return format(toLocalDate(start), 'EEEE, MMMM d, yyyy');
  const a = toLocalDate(start);
  const b = toLocalDate(end);
  if (a.getFullYear() !== b.getFullYear()) return `${format(a, 'd MMM yyyy')} – ${format(b, 'd MMM yyyy')}`;
  if (a.getMonth() !== b.getMonth()) return `${format(a, 'd MMM')} – ${format(b, 'd MMM yyyy')}`;
  return `${format(a, 'd')} – ${format(b, 'd MMM yyyy')}`;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Events[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const result = await BaseCrudService.getAll<Events>('events');
      // Order: events with no date yet (announced, date TBA) first, then
      // upcoming events soonest first, then past events most recent first.
      // An event stays upcoming until its last day (eventEndDate if set,
      // otherwise eventDate) has passed in South Africa.
      const today = dayOf(new Date());
      const start = (e: Events) => dayOf(e.eventDate);
      const last = (e: Events) => dayOf(e.eventEndDate) || start(e);
      const rank = (e: Events) => (!start(e) ? 0 : last(e) >= today ? 1 : 2);
      const sortedEvents = [...result.items].sort((a, b) => {
        const byGroup = rank(a) - rank(b);
        if (byGroup !== 0) return byGroup;
        if (rank(a) === 1) return start(a).localeCompare(start(b));
        if (rank(a) === 2) return last(b).localeCompare(last(a));
        return 0;
      });
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[linear-gradient(135deg,#FFF0B0_0%,#DCAC53_55%,#A8782E_100%)] py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#102B4E] mb-6">
              Upcoming Events
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-[#061426] max-w-3xl mx-auto leading-relaxed">
              Join us for fellowship, worship, and community gatherings throughout the year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <div className="min-h-[600px]">
            {isLoading ? null : events.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-paragraph text-xl text-dark-slate">
                  No upcoming events at this time. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-12">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden border border-slate-gray/20 hover:border-muted-gold hover:shadow-md transition-all duration-300"
                  >
                    {event.eventImage && (
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={event.eventImage}
                          alt={event.eventTitle || 'Event image'}
                          className="w-full h-full object-cover"
                          width={800}
                        />
                      </div>
                    )}
                    <div className="p-8 md:p-10">
                      <h2 className="font-heading text-2xl md:text-3xl text-royal-blue mb-6">
                        {event.eventTitle}
                      </h2>
                      
                      <div className="space-y-4 mb-8 font-paragraph text-base text-dark-slate">
                        {event.eventDate && (
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted-gold flex-shrink-0" />
                            <span>{formatEventDates(dayOf(event.eventDate), dayOf(event.eventEndDate))}</span>
                          </div>
                        )}
                        {event.eventTime && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-muted-gold flex-shrink-0" />
                            <span>{event.eventTime}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-muted-gold flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      {event.eventDescription && (
                        <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed mb-8 whitespace-pre-line">
                          {event.eventDescription}
                        </p>
                      )}

                      {event.registrationUrl && (
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-royal-blue text-primary-foreground px-8 py-3 rounded-sm font-paragraph font-semibold transition-all duration-300 hover:bg-opacity-90 hover:shadow-md"
                        >
                          Register Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

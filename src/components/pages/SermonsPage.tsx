import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Sermons } from '@/entities';

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermons[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSermon, setSelectedSermon] = useState<Sermons | null>(null);

  useEffect(() => {
    loadSermons();
  }, []);

  const loadSermons = async () => {
    try {
      const result = await BaseCrudService.getAll<Sermons>('sermons');
      const sortedSermons = result.items.sort((a, b) => {
        const dateA = a.sermonDate ? new Date(a.sermonDate).getTime() : 0;
        const dateB = b.sermonDate ? new Date(b.sermonDate).getTime() : 0;
        return dateB - dateA;
      });
      setSermons(sortedSermons);
      if (sortedSermons.length > 0) {
        setSelectedSermon(sortedSermons[0]);
      }
    } catch (error) {
      console.error('Failed to load sermons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-royal-blue py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6">
              Sermon Library
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Faithful exposition of God's Word, preached with clarity and conviction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <div className="min-h-[600px]">
            {isLoading ? null : sermons.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-paragraph text-xl text-dark-slate">
                  No sermons available at this time. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Video Player */}
                <div className="lg:col-span-2">
                  {selectedSermon && (
                    <motion.div
                      key={selectedSermon._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-lg overflow-hidden border border-slate-gray/20 shadow-sm"
                    >
                      <div className="aspect-video">
                        {selectedSermon.youtubeUrl && (
                          <iframe
                            src={getYouTubeEmbedUrl(selectedSermon.youtubeUrl)}
                            title={selectedSermon.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                      <div className="p-8 md:p-12">
                        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-royal-blue mb-6">
                          {selectedSermon.title}
                        </h2>
                        <div className="flex flex-wrap gap-8 mb-8 font-paragraph text-base text-dark-slate">
                          {selectedSermon.speakerName && (
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-muted-gold flex-shrink-0" />
                              <span>{selectedSermon.speakerName}</span>
                            </div>
                          )}
                          {selectedSermon.sermonDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-muted-gold flex-shrink-0" />
                              <span>{format(new Date(selectedSermon.sermonDate), 'MMMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>
                        {selectedSermon.description && (
                          <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed">
                            {selectedSermon.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sermon List */}
                <div className="lg:col-span-1">
                  <h3 className="font-heading text-2xl text-royal-blue mb-8">Recent Sermons</h3>
                  <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
                    {sermons.map((sermon, index) => (
                      <motion.button
                        key={sermon._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        onClick={() => setSelectedSermon(sermon)}
                        className={`w-full text-left p-5 rounded-lg border transition-all duration-300 ${
                          selectedSermon?._id === sermon._id
                            ? 'bg-royal-blue border-royal-blue text-primary-foreground shadow-md'
                            : 'bg-white border-slate-gray/20 hover:border-muted-gold hover:shadow-sm'
                        }`}
                      >
                        <h4 className={`font-heading text-lg mb-2 ${
                          selectedSermon?._id === sermon._id ? 'text-primary-foreground' : 'text-royal-blue'
                        }`}>
                          {sermon.title}
                        </h4>
                        <div className={`font-paragraph text-sm space-y-1 ${
                          selectedSermon?._id === sermon._id ? 'text-primary-foreground/80' : 'text-dark-slate/70'
                        }`}>
                          {sermon.speakerName && <p>{sermon.speakerName}</p>}
                          {sermon.sermonDate && (
                            <p>{format(new Date(sermon.sermonDate), 'MMM d, yyyy')}</p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

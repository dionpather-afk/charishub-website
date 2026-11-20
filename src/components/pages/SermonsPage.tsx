import { useState, useEffect } from 'react';
import { mediaUrl } from '@/lib/media';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Sermons } from '@/entities';
import { Image } from '@/components/ui/image';

// Main Sermons picture: sermons1.jpeg (1536x1024), Media Manager folder "Nags 26sept2026".
const SERMONS_PHOTO_FILE = 'dd740b_31654a43f9cc4113891b5ed93ea46d89.jpeg';
const sermonsPhotoUrl = (w: number) =>
  `/media/${SERMONS_PHOTO_FILE}`;

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

  const isDirectVideoFile = (url?: string) => !!url && !getYouTubeEmbedUrl(url) && /\.(mp4|webm|mov)$/i.test(url);

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
              Sermon Library
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-[#061426] max-w-3xl mx-auto leading-relaxed">
              Faithful exposition of God's Word, preached with clarity and conviction.
            </p>
            {/* Shown whole at its own 3:2 shape, so nothing is cropped; the
                browser picks the Wix copy that matches the screen width. */}
            <div className="mt-10 max-w-6xl mx-auto rounded-2xl overflow-hidden border-4 border-off-white/20">
              <Image
                src={sermonsPhotoUrl(1536)}
                srcSet={`${mediaUrl(sermonsPhotoUrl(1536))} 1536w`}
                sizes="(min-width: 1250px) 1152px, calc(100vw - 48px)"
                width={1536}
                height={1024}
                alt="Sermons at RCA Charisma"
                className="block w-full h-auto aspect-[3/2] object-cover"
              />
            </div>
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
                        {selectedSermon.youtubeUrl && isDirectVideoFile(selectedSermon.youtubeUrl) ? (
                          <video
                            src={mediaUrl(selectedSermon.youtubeUrl)}
                            title={selectedSermon.title}
                            className="w-full h-full"
                            controls
                            playsInline
                          />
                        ) : selectedSermon.youtubeUrl && getYouTubeEmbedUrl(selectedSermon.youtubeUrl) && (
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
                  <h2 className="font-heading text-2xl text-royal-blue mb-8">Recent Sermons</h2>
                  <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
                    {sermons.map((sermon, index) => (
                      <motion.button
                        key={sermon._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        onClick={() => setSelectedSermon(sermon)}
                        className={`group w-full text-left p-5 rounded-lg border transition-all duration-300 ${
                          selectedSermon?._id === sermon._id
                            ? 'bg-gradient-to-br from-[#102B4E] to-[#061426] border-[#102B4E] text-[#DCAC53] shadow-md'
                            : 'bg-white border-slate-gray/20 hover:border-muted-gold hover:shadow-sm'
                        }`}
                      >
                        <h3 className={`font-heading text-lg mb-2 ${
                          selectedSermon?._id === sermon._id ? 'text-[#DCAC53] group-hover:text-[#FFF0B0] transition-colors' : 'text-royal-blue'
                        }`}>
                          {sermon.title}
                        </h3>
                        <div className={`font-paragraph text-sm space-y-1 ${
                          selectedSermon?._id === sermon._id ? 'text-[#DCAC53]/80 group-hover:text-[#FFF0B0]/90 transition-colors' : 'text-dark-slate/70'
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

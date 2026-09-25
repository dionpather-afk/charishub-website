import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { PhotoGallery } from '@/entities';
import { Image } from '@/components/ui/image';

// Friendlier display names for the raw category values stored on each photo.
// Add more entries here as new categories (Youth, Sunday School, Feeding Scheme, etc.)
// get tagged on future photo uploads.
const CATEGORY_LABELS: Record<string, string> = {
  'History': 'History',
  'church and times': 'Church & Times',
  'congregation formal': 'Congregation',
  'Missions and random congregational pics': 'Missions & Outreach',
};

// Photos with no category have no tab of their own; they still show under "All".
const getCategoryLabel = (raw?: string) => (raw && CATEGORY_LABELS[raw]) || raw || undefined;

// Descriptive alt text from the photo's title and category.
const getPhotoAlt = (p: PhotoGallery) => {
  const label = getCategoryLabel(p.eventName);
  return `${p.title || 'Photo'}${label ? ` (${label})` : ''} – RCA Charisma, Laudium`;
};

// Gallery items that are re-uploads of a photo already in the gallery (same
// picture, different file). Hidden here rather than deleted from the CMS so
// the change is reviewable and easy to undo. Kept copy noted on each line.
const DUPLICATE_PHOTO_IDS = new Set([
  '79d908c5-b387-44d5-a4cf-f0a5710fe300', // congregation formal 6  (same as formal 1)
  '64b97adc-ac1a-472e-8bcc-08b7e42ecb89', // congregation formal 10 (same as formal 1)
  '4b58a28e-295a-483e-9384-038bf98dffb2', // congregation formal 18 (same as formal 1)
  '2cf3f2d6-d388-4b65-8738-c31c263cbfba', // congregation formal 26 (same as formal 2)
  'f458ef0b-cdf5-4f11-b6da-79044ce8bd2e', // congregation formal 23 (same as formal 20)
]);

// The same Wix file can be stored as "wix:image://v1/<file>/name.jpg#..." or
// "https://static.wixstatic.com/media/<file>". Compare by the file itself so a
// photo added twice in different formats only shows once.
const getImageKey = (image: string) => {
  const match = image.match(/^wix:image:\/\/v1\/([^/#]+)/) || image.match(/static\.wixstatic\.com\/media\/([^/?#]+)/);
  return match ? match[1] : image;
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<PhotoGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoGallery | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const result = await BaseCrudService.getAll<PhotoGallery>('photogallery');
      const seenImages = new Set<string>();
      const uniquePhotos = result.items.filter((p) => {
        if (DUPLICATE_PHOTO_IDS.has(p._id)) return false;
        if (!p.image) return true;
        const key = getImageKey(p.image);
        if (seenImages.has(key)) return false;
        seenImages.add(key);
        return true;
      });
      const sortedPhotos = uniquePhotos.sort((a, b) => {
        const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : 0;
        const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : 0;
        return dateB - dateA;
      });
      setPhotos(sortedPhotos);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = useMemo(() => {
    const seen = new Map<string, string>();
    photos.forEach((p) => {
      const label = getCategoryLabel(p.eventName);
      if (label && !seen.has(label)) seen.set(label, label);
    });
    return ['All', ...Array.from(seen.keys())];
  }, [photos]);

  const visiblePhotos = useMemo(() => {
    const filtered = activeTab === 'All' ? photos : photos.filter((p) => getCategoryLabel(p.eventName) === activeTab);

    // History is a timeline of ministers/events, so it reads oldest-to-newest
    // rather than the newest-first order used for everything else.
    if (activeTab === 'History') {
      return [...filtered].sort((a, b) => {
        const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : 0;
        const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : 0;
        return dateA - dateB;
      });
    }
    return filtered;
  }, [photos, activeTab]);

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
              Photo Gallery
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-[#061426] max-w-3xl mx-auto leading-relaxed">
              Moments of worship, fellowship, and community life at RCA Charisma.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          {!isLoading && photos.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-paragraph text-sm px-6 py-3 rounded-full border transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-royal-blue text-primary-foreground border-royal-blue'
                      : 'bg-white text-dark-slate border-slate-gray/20 hover:border-muted-gold hover:text-muted-gold'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
          <div className="min-h-[600px]">
            {isLoading ? null : photos.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-paragraph text-xl text-dark-slate">
                  No photos available at this time. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {visiblePhotos.map((photo, index) => (
                  <motion.div
                    key={photo._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="break-inside-avoid"
                  >
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="w-full bg-white rounded-lg overflow-hidden border border-slate-gray/20 hover:border-muted-gold hover:shadow-md transition-all duration-300 group"
                    >
                      {photo.image && (
                        <div className="overflow-hidden">
                          <Image
                            src={photo.image}
                            alt={getPhotoAlt(photo)}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            width={600}
                          />
                        </div>
                      )}
                      {photo.description && (
                        <div className="p-6">
                          {photo.title && (
                            <h2 className="font-heading text-xl text-royal-blue mb-2">
                              {photo.title}
                            </h2>
                          )}
                          <p className="font-paragraph text-sm text-dark-slate/80 leading-relaxed">
                            {photo.description}
                          </p>
                        </div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-dark-slate/95 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 text-off-white hover:text-muted-gold transition-colors duration-300"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedPhoto.image && (
                <div className="mb-6">
                  <Image
                    src={selectedPhoto.image}
                    alt={getPhotoAlt(selectedPhoto)}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                    width={1200}
                  />
                </div>
              )}
              
              <div className="bg-white rounded-lg p-8">
                {selectedPhoto.description && selectedPhoto.title && (
                  <h2 className="font-heading text-3xl text-royal-blue mb-4">
                    {selectedPhoto.title}
                  </h2>
                )}
                
                <div className="flex flex-wrap gap-6 mb-4 font-paragraph text-base text-dark-slate">
                  {selectedPhoto.dateTaken && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-muted-gold" />
                      <span>{format(new Date(selectedPhoto.dateTaken), 'MMMM d, yyyy')}</span>
                    </div>
                  )}
                  {selectedPhoto.photographer && (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-muted-gold" />
                      <span>{selectedPhoto.photographer}</span>
                    </div>
                  )}
                </div>

                {selectedPhoto.description && (
                  <p className="font-paragraph text-base text-dark-slate leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

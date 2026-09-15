import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Devotional {
  _id: string;
  title?: string;
  content?: string;
  publishDate?: Date | string;
  author?: string;
  featuredImage?: string;
}

export default function DevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);

  useEffect(() => {
    const loadDevotionals = async () => {
      try {
        const result = await BaseCrudService.getAll<Devotional>('devotionals', {}, { limit: 50 });
        // Sort by publish date, newest first
        const sorted = (result.items || []).sort((a, b) => {
          const dateA = new Date(a.publishDate || 0).getTime();
          const dateB = new Date(b.publishDate || 0).getTime();
          return dateB - dateA;
        });
        setDevotionals(sorted);
      } catch (error) {
        console.error('Error loading devotionals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevotionals();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-royal-blue to-royal-blue/90 text-off-white py-16 md:py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-5xl md:text-6xl mb-6">Weekly Devotionals</h1>
              <p className="font-paragraph text-lg md:text-xl text-off-white/90 max-w-2xl">
                Reflections and spiritual insights from our pastoral team to nourish your faith journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Devotionals Content */}
        <section className="py-16 md:py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : devotionals.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-paragraph text-lg text-slate-gray">
                  No devotionals available yet. Check back soon for weekly reflections.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                  {selectedDevotional ? (
                    <motion.div
                      key={selectedDevotional._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-gray/10"
                    >
                      {selectedDevotional.featuredImage && (
                        <div className="w-full h-96 overflow-hidden">
                          <Image
                            src={selectedDevotional.featuredImage}
                            alt={selectedDevotional.title || 'Devotional image'}
                            width={800}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-8 md:p-12">
                        <div className="mb-6">
                          <h2 className="font-heading text-4xl text-royal-blue mb-4">
                            {selectedDevotional.title}
                          </h2>
                          <div className="flex items-center gap-4 text-slate-gray font-paragraph">
                            {selectedDevotional.publishDate && (
                              <span>
                                {format(new Date(selectedDevotional.publishDate), 'MMMM d, yyyy')}
                              </span>
                            )}
                            {selectedDevotional.author && (
                              <>
                                <span>•</span>
                                <span>By {selectedDevotional.author}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="prose prose-lg max-w-none">
                          <p className="font-paragraph text-lg text-dark-slate leading-relaxed whitespace-pre-wrap">
                            {selectedDevotional.content}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedDevotional(null)}
                          className="mt-8 font-paragraph text-royal-blue hover:text-muted-gold transition-colors"
                        >
                          ← Back to all devotionals
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {devotionals.map((devotional, index) => (
                        <motion.div
                          key={devotional._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onClick={() => setSelectedDevotional(devotional)}
                          className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-gray/10 hover:shadow-md hover:border-muted-gold/30 transition-all cursor-pointer"
                        >
                          <div className="flex flex-col md:flex-row">
                            {devotional.featuredImage && (
                              <div className="w-full md:w-48 h-48 overflow-hidden flex-shrink-0">
                                <Image
                                  src={devotional.featuredImage}
                                  alt={devotional.title || 'Devotional image'}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-6 md:p-8 flex-1">
                              <h3 className="font-heading text-2xl text-royal-blue mb-2">
                                {devotional.title}
                              </h3>
                              <div className="flex items-center gap-4 text-slate-gray font-paragraph text-sm mb-4">
                                {devotional.publishDate && (
                                  <span>
                                    {format(new Date(devotional.publishDate), 'MMM d, yyyy')}
                                  </span>
                                )}
                                {devotional.author && (
                                  <>
                                    <span>•</span>
                                    <span>{devotional.author}</span>
                                  </>
                                )}
                              </div>
                              <p className="font-paragraph text-dark-slate line-clamp-3">
                                {devotional.content}
                              </p>
                              <div className="mt-4 text-muted-gold font-paragraph font-semibold">
                                Read more →
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar - Recent Devotionals */}
                {!selectedDevotional && (
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg p-8 border border-slate-gray/10 sticky top-24">
                      <h3 className="font-heading text-2xl text-royal-blue mb-6">Recent Reflections</h3>
                      <div className="space-y-4">
                        {devotionals.slice(0, 5).map((devotional) => (
                          <button
                            key={devotional._id}
                            onClick={() => setSelectedDevotional(devotional)}
                            className="text-left hover:text-muted-gold transition-colors group"
                          >
                            <p className="font-paragraph text-sm text-slate-gray group-hover:text-muted-gold">
                              {devotional.publishDate &&
                                format(new Date(devotional.publishDate), 'MMM d')}
                            </p>
                            <p className="font-heading text-lg text-royal-blue group-hover:text-muted-gold line-clamp-2">
                              {devotional.title}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

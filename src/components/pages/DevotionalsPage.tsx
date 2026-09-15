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
            <div className="grid md:grid-cols-2 gap-12 items-center">
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl overflow-hidden border-4 border-off-white/20"
              >
                <Image
                  src="https://static.wixstatic.com/media/dd740b_3baa8776540549479e076af81e81c9c3~mv2.jpg"
                  alt="Our Pastor"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bible Reading Plan */}
        <section className="py-16 md:py-24 bg-white border-t border-slate-gray/10">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center mb-12"
            >
              <h2 className="font-heading text-4xl md:text-5xl text-royal-blue mb-6">
                A Bible Reading Plan for You
              </h2>
              <p className="font-paragraph text-lg text-dark-slate/80 leading-relaxed">
                God's Word is a lamp for our feet and a light for our path. Whether you're just
                beginning your walk with the Lord or have been in the Word for years, we'd love
                for you to journey through Scripture with us. Here's a simple daily rhythm to
                help you stay rooted in God's Word this week.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto bg-off-white rounded-lg border border-slate-gray/20 overflow-hidden">
              {[
                { day: 'Monday', reading: 'Psalm 1 – 5' },
                { day: 'Tuesday', reading: 'Proverbs 1 – 3' },
                { day: 'Wednesday', reading: 'Matthew 1 – 4' },
                { day: 'Thursday', reading: 'Genesis 1 – 3' },
                { day: 'Friday', reading: 'John 1 – 3' },
                { day: 'Saturday', reading: 'Romans 1 – 3' },
                { day: 'Sunday', reading: 'Psalm 100; 103; 150 (Day of rest & worship)' },
              ].map((item, index) => (
                <div
                  key={item.day}
                  className={`flex items-center justify-between px-8 py-5 ${
                    index !== 6 ? 'border-b border-slate-gray/10' : ''
                  }`}
                >
                  <span className="font-heading text-lg text-royal-blue">{item.day}</span>
                  <span className="font-paragraph text-base text-dark-slate/80">{item.reading}</span>
                </div>
              ))}
            </div>

            <p className="font-paragraph text-base text-dark-slate/60 text-center max-w-2xl mx-auto mt-8">
              A new weekly plan will be posted here regularly. If you'd like a printed copy for
              home or a longer plan to read through the whole Bible in a year, please reach out
              to us on the Contact page — we'd love to help you get started.
            </p>
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
                  Our pastoral team is preparing weekly reflections to share with you soon —
                  check back shortly, and God bless you in the meantime.
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

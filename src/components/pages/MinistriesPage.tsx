import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Image } from '@/components/ui/image';

interface Ministry {
  _id: string;
  name?: string;
  description?: string;
  photo?: string;
  sortOrder?: number;
}

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMinistries = async () => {
      try {
        const result = await BaseCrudService.getAll<Ministry>('ministries', {}, { limit: 50 });
        const sorted = (result.items || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setMinistries(sorted);
      } catch (error) {
        console.error('Error loading ministries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMinistries();
  }, []);

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[linear-gradient(135deg,#FFF0B0_0%,#DCAC53_55%,#A8782E_100%)] py-24 md:py-32">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#102B4E] mb-6">
              Ministries
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-[#061426] max-w-3xl mx-auto leading-relaxed">
              Every believer has a place to serve. Find where you belong in the life of our church.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          {isLoading ? null : ministries.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-paragraph text-xl text-dark-slate">
                Ministry information will be available soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {ministries.map((ministry, index) => (
                <motion.div
                  key={ministry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="bg-white rounded-lg overflow-hidden border border-slate-gray/20 hover:border-muted-gold hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-gray/10 flex items-center justify-center">
                    {ministry.photo ? (
                      <Image
                        src={ministry.photo}
                        alt={ministry.name || 'Ministry'}
                        className="w-full h-full object-cover"
                        width={400}
                      />
                    ) : (
                      <p className="font-paragraph text-sm text-dark-slate/50 italic px-6 text-center">
                        Photo coming soon
                      </p>
                    )}
                  </div>
                  <div className="p-8">
                    <h2 className="font-heading text-2xl text-royal-blue mb-3">
                      {ministry.name}
                    </h2>
                    <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed">
                      {ministry.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

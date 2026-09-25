import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { GivingMethods } from '@/entities';
import { Image } from '@/components/ui/image';
import iconInfo from '@/assets/icons/icon-giving-info.svg?url';
import iconExternalLink from '@/assets/icons/icon-giving-external-link.svg?url';

export default function GivingPage() {
  const [givingMethods, setGivingMethods] = useState<GivingMethods[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGivingMethods();
  }, []);

  const loadGivingMethods = async () => {
    try {
      const result = await BaseCrudService.getAll<GivingMethods>('givingmethods');
      const activeMethods = result.items.filter(method => method.isActive !== false);
      setGivingMethods(activeMethods);
    } catch (error) {
      console.error('Failed to load giving methods:', error);
    } finally {
      setIsLoading(false);
    }
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
              Faithful Giving
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Your generous support enables us to continue proclaiming the Gospel, 
              serving our community, and advancing God's kingdom.
            </p>
            <div className="mt-12 max-w-5xl mx-auto rounded-2xl overflow-hidden border-4 border-off-white/20">
              <Image
                src="https://static.wixstatic.com/media/dd740b_9a679137889e40c49e6cbb1e7afa93d4~mv2.jpeg"
                alt="Our Pastor and his wife"
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="w-full py-24 md:py-32 bg-off-white">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <blockquote className="font-heading text-2xl md:text-3xl text-royal-blue mb-4 leading-relaxed">
              "Each one must give as he has decided in his heart, not reluctantly or under compulsion, 
              for God loves a cheerful giver."
            </blockquote>
            <p className="font-paragraph text-lg text-dark-slate">
              2 Corinthians 9:7
            </p>
          </motion.div>
        </div>
      </section>

      {/* Giving Methods Section */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-6">
              Ways to Give
            </h2>
            <p className="font-paragraph text-lg text-dark-slate/80 max-w-3xl mx-auto leading-relaxed">
              We offer several convenient methods for you to support the ministry of RCA Charisma.
            </p>
          </motion.div>

          <div className="min-h-[400px]">
            {isLoading ? null : givingMethods.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-paragraph text-xl text-dark-slate">
                  Giving information will be available soon. Please contact the church office for details.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {givingMethods.map((method, index) => (
                  <motion.div
                    key={method._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg border border-slate-gray/20 overflow-hidden hover:border-muted-gold hover:shadow-md transition-all duration-300"
                  >
                    {method.qrCodeImage && (
                      <div className="bg-off-white p-10 flex items-center justify-center">
                        <Image
                          src={method.qrCodeImage}
                          alt={`${method.methodName} QR Code`}
                          className="w-48 h-48 object-contain"
                          width={192}
                        />
                      </div>
                    )}
                    <div className="p-8 md:p-10">
                      <h3 className="font-heading text-2xl text-royal-blue mb-4">
                        {method.methodName}
                      </h3>
                      {method.shortDescription && (
                        <p className="font-paragraph text-base text-dark-slate/80 mb-6 leading-relaxed">
                          {method.shortDescription}
                        </p>
                      )}
                      {method.instructions && (
                        <div className="bg-off-white rounded-lg p-5 mb-8">
                          <div className="flex items-start gap-2 mb-3">
                            <img src={iconInfo} alt="" aria-hidden="true" className="w-7 h-7 flex-shrink-0 -mt-0.5" />
                            <p className="font-paragraph text-sm font-semibold text-royal-blue">
                              Instructions:
                            </p>
                          </div>
                          <p className="font-paragraph text-sm text-dark-slate/80 leading-relaxed whitespace-pre-line">
                            {method.instructions}
                          </p>
                        </div>
                      )}
                      {method.methodLink && (
                        <a
                          href={method.methodLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-muted-gold font-paragraph font-semibold hover:text-royal-blue transition-colors duration-300"
                        >
                          Learn More
                          <img src={iconExternalLink} alt="" aria-hidden="true" className="w-7 h-7" />
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

      {/* Impact Section */}
      <section className="w-full py-24 md:py-32 bg-off-white">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-8">
              Your Impact
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                title: 'Ministry Support',
                description: 'Enabling faithful preaching, teaching, and pastoral care for our congregation.'
              },
              {
                title: 'Community Outreach',
                description: 'Supporting missions, evangelism, and service to those in need.'
              },
              {
                title: 'Facility Maintenance',
                description: 'Maintaining our worship space and resources for effective ministry.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="font-heading text-2xl text-royal-blue mb-4">
                  {item.title}
                </h3>
                <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

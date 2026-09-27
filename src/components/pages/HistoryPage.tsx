import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { PhotoGallery } from '@/entities';
import { Image } from '@/components/ui/image';

// Historic photos (Media Manager folder "Nags 26sept2026"), in order hist1-hist8.
// All are 1280x853 originals.
const HISTORIC_PHOTO_FILES = [
  'dd740b_2d93cdb706c0418cb17fdd3a2912c546~mv2.jpg', // hist1
  'dd740b_6484fdbdebe44209964005e961f7d344~mv2.jpg', // hist2
  'dd740b_88176ade9d5a4991bb3be8384399424b~mv2.jpg', // hist3
  'dd740b_fa68910bcb574e978193550497fb0866~mv2.jpg', // hist4
  'dd740b_f78cbd724e084fba83bb40344e609962~mv2.jpg', // hist5
  'dd740b_d036945a94bc4fc69235fcbd2a736916~mv2.jpg', // hist6
  'dd740b_b5dd66901ece4c02bdca7a2df8c5818e~mv2.jpg', // hist7
  'dd740b_31b4fc6a3a0d4753ba928d41c9308f37~mv2.jpg', // hist8
];
const HISTORIC_PHOTO_ALT = 'Historic photo of RCA Charisma';

// Grid thumbnails are a small 3:2 copy from Wix's image service; the full
// photo only downloads when it is opened.
const historicThumbUrl = (file: string) =>
  `https://static.wixstatic.com/media/${file}/v1/fill/w_600,h_400,q_80,enc_auto/${file}`;
const historicFullUrl = (file: string) =>
  `https://static.wixstatic.com/media/${file}/v1/fit/w_1280,h_1280,q_85,enc_auto/${file}`;

export default function HistoryPage() {
  const [ministers, setMinisters] = useState<PhotoGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'reverends'>('history');
  const [openPhoto, setOpenPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadMinisters();
  }, []);

  // While a photo is open: Escape closes it and the page behind stays still
  // (same behaviour as the Gallery pop-up).
  useEffect(() => {
    if (!openPhoto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPhoto(null);
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [openPhoto]);

  const loadMinisters = async () => {
    try {
      const result = await BaseCrudService.getAll<PhotoGallery>('photogallery');
      // Previous ministers live in the same "photogallery" collection, tagged
      // eventName: "History". A handful of other History-tagged items have no
      // dateTaken (they're placeholders with no write-up yet), so filtering on
      // dateTaken reliably isolates just the six documented ministers.
      const previousMinisters = (result.items || [])
        .filter((p) => p.eventName === 'History' && !!p.dateTaken)
        .sort((a, b) => {
          const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : 0;
          const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : 0;
          return dateA - dateB;
        });
      setMinisters(previousMinisters);
    } catch (error) {
      console.error('Failed to load previous ministers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[linear-gradient(135deg,#FFF0B0_0%,#DCAC53_55%,#A8782E_100%)] py-24 md:py-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#102B4E] mb-6">
              Our History
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-[#061426] max-w-3xl mx-auto leading-relaxed">
              From the Declaration that still shapes our convictions, to the shepherds who carried
              this congregation through the decades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs: only one section shows at a time */}
      <div className="w-full bg-white pt-12">
        <div className="flex flex-wrap justify-center gap-3 px-6" role="tablist">
          {([
            ['history', 'Our History'],
            ['reverends', 'Historic Reverends'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              className={`font-paragraph text-sm px-6 py-3 rounded-full border transition-all duration-300 ${
                activeTab === key
                  ? 'bg-royal-blue text-primary-foreground border-royal-blue'
                  : 'bg-white text-dark-slate border-slate-gray/20 hover:border-muted-gold hover:text-muted-gold'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'history' && (
        <>
          {/* Church construction, 1972 */}
          <section className="w-full pt-12 pb-4 bg-white">
            <figure className="max-w-5xl mx-auto px-6 md:px-12">
              <Image
                src="https://static.wixstatic.com/media/dd740b_fb1ddded32bd4767bb0782c976bd36a5~mv2.jpeg"
                alt="Church construction, 1972"
                className="w-full h-auto object-contain rounded-lg border border-slate-gray/20"
              />
              <figcaption className="font-paragraph text-sm text-dark-slate/70 text-center mt-4">
                Church construction, 1972
              </figcaption>
            </figure>
          </section>

          {/* Declaration of Laudium */}
          <section className="w-full py-24 md:py-32 bg-white border-b border-slate-gray/10">
            <div className="max-w-[100rem] mx-auto px-8">
              <div className="grid md:grid-cols-2 gap-16 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="rounded-lg overflow-hidden border border-slate-gray/20 shadow-sm"
                >
                  <Image
                    src="https://static.wixstatic.com/media/dd740b_e2c019f03fa1440792fb30ab4455c6b6~mv2.jpg"
                    alt="The Declaration of Laudium"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="font-heading text-4xl md:text-5xl text-royal-blue mb-4">
                    The Declaration of Laudium
                  </h2>
                  <p className="font-paragraph text-sm text-[#7A5A14] font-semibold uppercase tracking-wide mb-6">
                    Adopted at the Sixth Synod of the Reformed Church in Africa, October 1990
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      { title: 'The Biblical Gospel', desc: 'Every person is born in sin and lost without Christ, and salvation is found in no other name.' },
                      { title: "The Holy Spirit's Witness", desc: 'Evangelism bears no fruit apart from the Spirit, and a holy life gives that witness its credibility.' },
                      { title: 'Evangelistic Witness & Compassionate Service', desc: 'The whole Gospel is proclaimed to the whole world, with real care for the poor and those in need.' },
                      { title: 'Unity', desc: 'Unity is affirmed with all born-again believers, and racism within the church is named a denial of the Gospel.' },
                      { title: 'Prophetic Witness', desc: "The church speaks against injustice and oppression, while remaining free from any political ideology or movement." },
                    ].map((point) => (
                      <li key={point.title} className="flex gap-3">
                        <span className="text-[#7A5A14] font-bold mt-1">•</span>
                        <div>
                          <span className="font-heading text-lg text-royal-blue">{point.title}</span>
                          <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed">{point.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-off-white border-l-4 border-muted-gold p-6 rounded">
                    <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed mb-3">
                      This declaration is more than history — it's a promise our church stands on. It was
                      personally presented to RCA Charisma on 25 April 2004, and it still shapes how we
                      read Scripture, love our neighbours, and stand for truth today.
                    </p>
                    <p className="font-paragraph text-sm text-dark-slate/60 italic">
                      Presented to the Reformed Church in Africa, Charisma Congregation, 25 April 2004 —
                      Rev PJP de Beer, Moderator.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Historic photos */}
          <section className="w-full py-16 md:py-24 bg-white">
            <div className="max-w-[100rem] mx-auto px-4 md:px-12">
              <h2 className="font-heading text-4xl md:text-5xl text-royal-blue text-center mb-10">
                Historic Photos
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {HISTORIC_PHOTO_FILES.map((file) => (
                  <button
                    key={file}
                    type="button"
                    onClick={() => setOpenPhoto(file)}
                    className="block w-full aspect-[3/2] overflow-hidden rounded-lg border border-slate-gray/20 bg-slate-gray/10 hover:border-muted-gold transition-colors duration-300 group"
                    aria-label={`${HISTORIC_PHOTO_ALT} (open full size)`}
                  >
                    <Image
                      src={historicThumbUrl(file)}
                      alt={HISTORIC_PHOTO_ALT}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'reverends' && (
        <>
          {/* Historic Reverends */}
          <section className="w-full pt-12 pb-4 bg-off-white">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
              <h2 className="font-heading text-4xl md:text-5xl text-[#7A5A14] text-center mb-8">
                Historic Reverends of RCA Charisma
              </h2>
              {/* The source image (1536x1024) has a misspelled title strip in its
                  top ~8.5%. The frame is 91% of the image's height and anchored to
                  the bottom, so the top 9% is always clipped at every width. */}
              <div
                className="w-full overflow-hidden rounded-lg border border-slate-gray/20"
                style={{ aspectRatio: '1536 / 932' }}
              >
                <Image
                  src="https://static.wixstatic.com/media/dd740b_713aacf31f8d41d6a8aa7803e87be0fa~mv2.jpeg"
                  alt="Historic Reverends of RCA Charisma"
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
            </div>
          </section>

          {/* Previous Ministers Timeline */}
          <section className="w-full py-24 md:py-32 bg-off-white">
            <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-6">
                  Our Previous Ministers
                </h2>
                <p className="font-paragraph text-lg text-dark-slate/80 max-w-3xl mx-auto leading-relaxed">
                  Shepherds who have led this congregation since its founding, in the order they served.
                </p>
              </motion.div>

              <div className="min-h-[400px]">
                {isLoading ? null : ministers.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-paragraph text-xl text-dark-slate">
                      Minister history will be available soon.
                    </p>
                  </div>
                ) : (
                  <div className="max-w-5xl mx-auto space-y-16">
                    {ministers.map((minister, index) => (
                      <motion.div
                        key={minister._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        className="bg-white rounded-lg overflow-hidden border border-slate-gray/20 shadow-sm"
                      >
                        <div className="grid md:grid-cols-[280px_1fr] gap-0">
                          {minister.image && (
                            <div className="aspect-square md:aspect-auto overflow-hidden bg-slate-gray/10">
                              <Image
                                src={minister.image}
                                alt={minister.title || 'Previous minister'}
                                className="w-full h-full object-cover object-top"
                                width={400}
                              />
                            </div>
                          )}
                          <div className="p-8 md:p-10 flex flex-col justify-center">
                            <h3 className="font-heading text-2xl md:text-3xl text-royal-blue mb-4">
                              {minister.title}
                            </h3>
                            {minister.description && (
                              <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed">
                                {minister.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Historic photo pop-up (same style as the Gallery) */}
      <AnimatePresence>
        {openPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-dark-slate/95 overflow-y-auto overscroll-contain"
            onClick={() => setOpenPhoto(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setOpenPhoto(null)}
              className="fixed top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-[#102B4E] border border-[#AD843D] text-[#DCAC53] shadow-lg hover:text-[#FFF0B0] transition-colors duration-300"
              aria-label="Close"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Tapping anywhere outside the photo closes the pop-up. */}
            <div className="min-h-full flex items-center justify-center px-4 py-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl w-full"
              >
                <Image
                  src={historicFullUrl(openPhoto)}
                  alt={HISTORIC_PHOTO_ALT}
                  className="block mx-auto w-auto max-w-full h-auto max-h-[90vh] object-contain rounded-lg"
                  width={1280}
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

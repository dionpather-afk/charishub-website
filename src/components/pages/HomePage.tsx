// HPI 1.7-G
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, ArrowRight, Clock, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import iconBiblicalTeaching from '@/assets/icons/icon-biblical-teaching.svg?url';
import iconCommunityEvents from '@/assets/icons/icon-community-events.svg?url';
import iconFaithfulGiving from '@/assets/icons/icon-faithful-giving.svg?url';
import iconLeadership from '@/assets/icons/icon-leadership.svg?url';

// --- Canonical Data Sources ---
const ICON_BASE = "https://static.wixstatic.com/shapes/";
// Hero photo: Homepage2.jpeg, Media Manager folder "Nags 26sept2026".
const HERO_PHOTO_FILE = "dd740b_290880b8bfe34a809220f31ffecee390~mv2.jpeg";
const HERO_PHOTO_BASE = `https://static.wixstatic.com/media/${HERO_PHOTO_FILE}`;
const serviceTimes = [
  { title: "Sunday Service", time: "Sunday · 9:00 – 10:30 AM", icon: ICON_BASE + "dd740b_dc72a648e65d40d6b7093c1b39d2d235.svg", desc: "Come worship the Lord with us through prayer, praise, and the faithful preaching of His Word." },
  { title: "Sunday School", time: "Sunday · 9:30 – 10:30 AM", icon: ICON_BASE + "dd740b_158537e800a14a77946916f12eae3e34.svg", desc: "Grow in the knowledge of Christ through Bible teaching and discipleship for every age, while the Sunday Service is in progress." },
  { title: "Prayer Meeting", time: "Tuesday · 7:00 – 8:00 PM", icon: ICON_BASE + "dd740b_afa6d6b9af86411aa4f1a694e13bf4e2.svg", desc: "Join us as we seek God together and lift up our church, our neighbours, and our community in prayer." },
  { title: "Home Fellowship", time: "Thursday · 7:00 – 8:00 PM", icon: ICON_BASE + "dd740b_80d409b327ff4f3d8b579e818b52423f.svg", desc: "Share life and Scripture in homes across the community, encouraging one another to walk faithfully with Christ." },
  { title: "Youth Meeting", time: "Friday · 7:30 – 9:30 PM", icon: ICON_BASE + "dd740b_0e168e5ff5954381b001bb35371705bb.svg", desc: "A welcoming place for young people to deepen their faith, build lasting friendships, and discover the joy of serving God." },
  { title: "Laudium Outreach", time: "Monday · 6:30 – 7:30 PM", icon: ICON_BASE + "dd740b_c21cb2fb61ff43558cbe8d90b0c3b9a4.svg", desc: "Carry the love of Christ into Laudium through the Gospel, compassionate service, and practical care." }
];

const foundations = [
  {
    icon: iconBiblicalTeaching,
    title: 'Biblical Teaching',
    description: 'Expository preaching that honors the truth and absolute authority of Scripture in all matters of faith and life.',
    link: '/sermons',
    number: '01'
  },
  {
    icon: iconCommunityEvents,
    title: 'Community Events',
    description: 'Intentional gatherings that strengthen our fellowship, encourage one another, and facilitate our outreach ministry.',
    link: '/events',
    number: '02'
  },
  {
    icon: iconFaithfulGiving,
    title: 'Faithful Giving',
    description: 'Supporting God\'s work through generous, joyful stewardship and service to our local community.',
    link: '/giving',
    number: '03'
  },
  {
    icon: iconLeadership,
    title: 'Our Leadership',
    description: 'Qualified shepherds called to serve, teach, and care for the congregation with biblical fidelity and grace.',
    link: '/about',
    number: '04'
  }
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const foundationRef = useRef<HTMLDivElement>(null);
  const breatherRef = useRef<HTMLDivElement>(null);

  // Parallax effects
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const { scrollYProgress: breatherScroll } = useScroll({
    target: breatherRef,
    offset: ["start end", "end start"]
  });
  const breatherY = useTransform(breatherScroll, [0, 1], ["-20%", "20%"]);

  return (
    <div className="min-h-screen bg-off-white text-dark-slate selection:bg-muted-gold selection:text-white font-paragraph">
      <Header />

      {/* --- HERO SECTION: The Grand Entrance --- */}
      <section ref={heroRef} className="relative w-full h-[100vh] min-h-[800px] overflow-clip bg-royal-blue flex items-center justify-center">
        {/* Homepage2.jpeg (1600x900) fills the whole hero on every screen.
            Phones get a portrait copy cropped by Wix (small, fast download);
            larger screens get the full photo. */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y: heroY }}
        >
          <picture className="block w-full h-full">
            <source
              media="(max-width: 767px)"
              srcSet={`${HERO_PHOTO_BASE}/v1/fill/w_720,h_1280,q_80,enc_auto/${HERO_PHOTO_FILE}`}
            />
            <Image
              src={`${HERO_PHOTO_BASE}/v1/fit/w_1600,h_900,q_85,enc_auto/${HERO_PHOTO_FILE}`}
              alt="RCA Charisma church building in Laudium"
              className="w-full h-full object-cover object-center brightness-110 contrast-[1.05] saturate-[1.2]"
            />
          </picture>
        </motion.div>
        {/* Tablet/desktop: the same soft navy fade as on phones (clear at the
            top, ~55% navy from the middle down), spread across the full-width
            photo so the heading and paragraph stay readable. */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(6,20,38,0)_0%,rgba(6,20,38,0.55)_50%,rgba(6,20,38,0.55)_100%)]"
        />

        <motion.div
          className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center text-center mt-20"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* Phones: soft navy shade behind the text so the white paragraph
                reads clearly over the bright sky (clear at the top, ~55% navy
                from the paragraph down). */}
            <div
              aria-hidden="true"
              className="md:hidden absolute -inset-x-6 -top-8 -bottom-8 -z-10 pointer-events-none bg-[linear-gradient(to_bottom,rgba(6,20,38,0)_0%,rgba(6,20,38,0.55)_50%,rgba(6,20,38,0.55)_100%)]"
            />
            <span className="text-muted-gold tracking-[0.2em] uppercase text-sm md:text-base font-semibold mb-6 block">
              Reformed Church in Africa
            </span>
            <h1 className="font-heading text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] text-muted-gold mb-8 tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
              Welcome to <br/>
              <span className="italic text-muted-gold">RCA Charisma</span>
            </h1>
            <p className="font-paragraph text-lg md:text-2xl text-off-white/80 max-w-3xl mx-auto mb-4 leading-relaxed font-light [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
              A community rooted in Scripture, devoted to reverent worship, and committed to serving God with grace and truth in South Africa.
            </p>
            <p className="font-heading italic text-muted-gold text-lg md:text-xl mb-12">
              "Using God's Gifts to Serve Our Community"
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/contact"
                className="group relative overflow-hidden bg-muted-gold text-royal-blue px-10 py-5 rounded-sm font-paragraph font-semibold transition-all duration-500 hover:shadow-[0_0_40px_rgba(184,134,11,0.4)] min-w-[220px] text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Visit Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </Link>
              <Link
                to="/sermons"
                className="group relative overflow-hidden bg-royal-blue text-off-white border border-royal-blue px-10 py-5 rounded-sm font-paragraph font-semibold transition-all duration-500 hover:border-muted-gold hover:text-muted-gold min-w-[220px] text-center"
              >
                <span className="relative z-10">Watch Sermons</span>
                <div className="absolute inset-0 bg-royal-blue/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out -z-0" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-off-white/50 text-xs tracking-widest uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">Scroll</span>
          <div className="w-[1px] h-16 bg-off-white/20 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-muted-gold"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      </section>

      {/* --- FEATURED: RCA Synod 2026 banner --- */}
      <section className="w-full py-16 md:py-24 bg-white relative z-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Image
            src="https://static.wixstatic.com/media/dd740b_c04f61e1a871440f89168edd2c414b95~mv2.jpeg"
            alt="RCA National Synod 2026, hosted by RCA Charisma, 29 September – 4 October 2026"
            className="w-full h-auto object-contain rounded-lg border border-slate-gray/20 shadow-sm"
          />
        </div>
      </section>

      {/* --- SERVICE TIMES: The Rhythm of Worship (Sticky Layout) --- */}
      <section ref={serviceRef} className="w-full py-32 md:py-48 bg-off-white relative z-20">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

            {/* Sticky Left Column */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-40">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-[1px] bg-muted-gold" />
                    <span className="text-[#7A5A14] tracking-widest uppercase text-sm font-semibold">Gatherings</span>
                  </div>
                  <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-8 leading-tight">
                    The Rhythm <br/>
                    <span className="italic text-slate-gray">of Worship</span>
                  </h2>
                  <p className="text-lg text-dark-slate/80 leading-relaxed mb-10 max-w-md">
                    We gather to hear God's Word, offer our prayers, and encourage one another. You are warmly invited to join us in reverent and joyful worship.
                  </p>
                  <Link to="/contact" className="relative after:absolute after:content-[''] after:-inset-x-1 after:-inset-y-3 inline-flex items-center gap-2 text-royal-blue font-semibold hover:text-muted-gold transition-colors group">
                    <MapPin className="w-5 h-5" />
                    <span>Get Directions</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Image
                    src="https://static.wixstatic.com/media/dd740b_24288f64270b43fe9eca2514f4c0ee1f~mv2.jpeg"
                    alt="Bible verse: Matthew 11:28"
                    className="w-full max-w-xs h-auto object-contain rounded-lg border border-slate-gray/20 shadow-sm mt-10"
                  />
                </motion.div>
              </div>
            </div>

            {/* Scrolling Right Column */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {serviceTimes.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group bg-white rounded-lg border border-slate-gray/20 p-8 hover:border-muted-gold hover:shadow-md transition-all duration-300"
                  >
                    <img src={service.icon} alt="" aria-hidden="true" className="w-14 h-14 mb-6" loading="lazy" />
                    <h3 className="font-heading text-3xl text-royal-blue group-hover:text-muted-gold transition-colors duration-300 mb-2">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-gray font-semibold tracking-wide mb-4">
                      <Clock className="w-4 h-4 text-muted-gold" />
                      {service.time}
                    </div>
                    <p className="text-dark-slate/70 leading-relaxed">
                      {service.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- VISUAL BREATHER: Parallax Transition --- */}
      <section ref={breatherRef} className="w-full h-[60vh] min-h-[500px] relative overflow-clip flex items-center justify-center">
        <motion.div
          className="absolute inset-0 w-full h-[140%] -top-[20%]"
          style={{ y: breatherY }}
        >
          <Image src="https://static.wixstatic.com/media/dd740b_a6ebba7a293d495fa08f3a2d5bae58b4~mv2.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-royal-blue/80 mix-blend-multiply" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <BookOpen className="w-12 h-12 text-muted-gold mx-auto mb-8 opacity-80" strokeWidth={1} />
            <h2 className="font-heading text-4xl md:text-6xl text-off-white leading-tight italic">
              "Your word is a lamp to my feet and a light to my path."
            </h2>
            <p className="mt-6 text-muted-gold tracking-widest uppercase text-sm font-semibold">Psalm 119:105</p>
          </motion.div>
        </div>
      </section>

      {/* --- SOLA SCRIPTURA: Our Foundation (Architectural Grid) --- */}
      <section ref={foundationRef} className="w-full py-32 md:py-48 bg-off-white relative">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-gray/20 to-transparent" />

        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <span className="text-[#7A5A14] tracking-widest uppercase text-sm font-semibold mb-4 block">Our Foundation</span>
            <h2 className="font-heading text-6xl md:text-8xl text-royal-blue mb-2">
              God's Word Alone
            </h2>
            <p className="font-paragraph text-base text-dark-slate/60 italic mb-8">
              (Sola Scriptura)
            </p>
            <p className="font-paragraph text-xl text-dark-slate/80 max-w-3xl mx-auto leading-relaxed">
              We are a community grounded in the absolute authority of God's Word,
              committed to the historic Reformed tradition, and passionate about proclaiming the Gospel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {foundations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group relative flex flex-col h-full"
              >
                {/* Top Hairline Rule that expands on hover */}
                <div className="w-full h-[1px] bg-slate-gray/20 mb-8 relative">
                  <div className="absolute top-0 left-0 h-full bg-muted-gold w-0 group-hover:w-full transition-all duration-700 ease-out" />
                </div>

                <div className="flex justify-between items-start mb-8">
                  <img src={item.icon} alt="" aria-hidden="true" className="w-14 h-14" loading="lazy" />
                  <span className="font-heading text-4xl text-slate-gray/30 group-hover:text-muted-gold/50 transition-colors duration-500">
                    {item.number}
                  </span>
                </div>

                <h3 className="font-heading text-3xl text-royal-blue mb-4">{item.title}</h3>
                <p className="font-paragraph text-base text-dark-slate/70 leading-relaxed mb-8 flex-grow">
                  {item.description}
                </p>

                <Link
                  to={item.link}
                  className="relative after:absolute after:content-[''] after:-inset-x-1 after:-inset-y-3.5 inline-flex items-center gap-2 text-sm font-semibold text-royal-blue uppercase tracking-wider group/link mt-auto"
                >
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover/link:-translate-y-full">Explore</span>
                    <span className="absolute inset-0 text-[#7A5A14] transition-transform duration-300 translate-y-full group-hover/link:translate-y-0">Explore</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-gold transform group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION: The Invitation --- */}
      <section className="w-full py-32 md:py-40 bg-[linear-gradient(135deg,#FFF0B0_0%,#DCAC53_55%,#A8782E_100%)] relative overflow-hidden">
        {/* Subtle background texture/pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#F5F5DC 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-[1px] bg-[#102B4E] mb-8" />
            <h2 className="font-heading text-5xl md:text-7xl text-[#102B4E] mb-8 leading-tight">
              Join Us This Sunday
            </h2>
            <p className="font-paragraph text-xl text-[#061426] max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Whether you are seeking a church home, exploring the Christian faith, or visiting the area,
              we welcome you to worship with us and experience the grace of our Lord Jesus Christ.
            </p>
            <Link
              to="/contact"
              className="group relative overflow-hidden bg-gradient-to-br from-[#102B4E] to-[#061426] text-[#DCAC53] hover:text-[#FFF0B0] px-12 py-5 rounded-sm font-paragraph font-semibold transition-all duration-500 hover:shadow-[0_0_30px_rgba(184,134,11,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Plan Your Visit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

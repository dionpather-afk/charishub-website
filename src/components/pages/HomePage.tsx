// HPI 1.7-G
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, BookOpen, Heart, Users, ArrowRight, Clock, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import heroPhoto from '@/assets/photos/rca-photo-1.jpg';
import breatherPhoto from '@/assets/photos/rca-outreach.jpg';

// --- Canonical Data Sources ---
const serviceTimes = [
  { title: "Sunday Morning Service", time: "9:00 AM - 11:00 AM", desc: "Our primary gathering for corporate worship, prayer, and expository preaching." },
  { title: "Sunday Evening Service", time: "5:00 PM - 6:30 PM", desc: "A time of deeper theological reflection and evening prayer." },
  { title: "Wednesday Bible Study", time: "7:00 PM - 8:30 PM", desc: "Mid-week gathering for intensive study of the Scriptures." },
  { title: "Friday Youth Service", time: "6:00 PM - 8:00 PM", desc: "Fellowship and biblical teaching tailored for our younger generation." }
];

const foundations = [
  {
    icon: BookOpen,
    title: 'Biblical Teaching',
    description: 'Expository preaching that honors the truth and absolute authority of Scripture in all matters of faith and life.',
    link: '/sermons',
    number: '01'
  },
  {
    icon: Calendar,
    title: 'Community Events',
    description: 'Intentional gatherings that strengthen our fellowship, encourage one another, and facilitate our outreach ministry.',
    link: '/events',
    number: '02'
  },
  {
    icon: Heart,
    title: 'Faithful Giving',
    description: 'Supporting God\'s work through generous, joyful stewardship and service to our local community.',
    link: '/giving',
    number: '03'
  },
  {
    icon: Users,
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
        <motion.div 
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{ y: heroY }}
        >
          <Image
            src={heroPhoto}
            alt="RCA Charisma Church sanctuary architecture"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            width={1920}
          />
          {/* Gradient overlay for text legibility and mood */}
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/80 via-royal-blue/50 to-royal-blue/90" />
        </motion.div>

        <motion.div 
          className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center text-center mt-20"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-muted-gold tracking-[0.2em] uppercase text-sm md:text-base font-semibold mb-6 block">
              Reformed Evangelical Church
            </span>
            <h1 className="font-heading text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] text-off-white mb-8 tracking-tight">
              Welcome to <br/>
              <span className="italic text-muted-gold">RCA Charisma</span>
            </h1>
            <p className="font-paragraph text-lg md:text-2xl text-off-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              A community rooted in Scripture, devoted to reverent worship, and committed to serving God with grace and truth in South Africa.
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
                className="group relative overflow-hidden bg-transparent text-off-white border border-off-white/30 px-10 py-5 rounded-sm font-paragraph font-semibold transition-all duration-500 hover:border-muted-gold hover:text-muted-gold min-w-[220px] text-center"
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
          <span className="text-off-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-16 bg-off-white/20 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-muted-gold"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      </section>

      {/* --- SERVICE TIMES: The Rhythm of Worship (Sticky Layout) --- */}
      <section ref={serviceRef} className="w-full py-32 md:py-48 bg-off-white relative z-20">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
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
                    <span className="text-muted-gold tracking-widest uppercase text-sm font-semibold">Gatherings</span>
                  </div>
                  <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-8 leading-tight">
                    The Rhythm <br/>
                    <span className="italic text-slate-gray">of Worship</span>
                  </h2>
                  <p className="text-lg text-dark-slate/80 leading-relaxed mb-10 max-w-md">
                    We gather to hear God's Word, offer our prayers, and encourage one another. You are warmly invited to join us in reverent and joyful worship.
                  </p>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-royal-blue font-semibold hover:text-muted-gold transition-colors group">
                    <MapPin className="w-5 h-5" />
                    <span>Get Directions</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Scrolling Right Column */}
            <div className="lg:col-span-7">
              <div className="flex flex-col">
                {serviceTimes.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group border-t border-slate-gray/20 py-10 first:border-t-0 lg:first:pt-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                      <h3 className="font-heading text-3xl md:text-4xl text-royal-blue group-hover:text-muted-gold transition-colors duration-300">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-gray font-semibold tracking-wide">
                        <Clock className="w-4 h-4 text-muted-gold" />
                        {service.time}
                      </div>
                    </div>
                    <p className="text-dark-slate/70 max-w-2xl leading-relaxed">
                      {service.desc}
                    </p>
                  </motion.div>
                ))}
                <div className="border-t border-slate-gray/20 pt-10" />
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
          <Image
            src={breatherPhoto}
            alt="Church architectural details"
            className="w-full h-full object-cover"
            width={1920}
          />
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
      <section ref={foundationRef} className="w-full py-32 md:py-48 bg-white relative">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-gray/20 to-transparent" />
        
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <span className="text-muted-gold tracking-widest uppercase text-sm font-semibold mb-4 block">Our Foundation</span>
            <h2 className="font-heading text-6xl md:text-8xl text-royal-blue mb-8">
              Sola Scriptura
            </h2>
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
                  <item.icon className="w-10 h-10 text-royal-blue group-hover:text-muted-gold transition-colors duration-500" strokeWidth={1} />
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
                  className="inline-flex items-center gap-2 text-sm font-semibold text-royal-blue uppercase tracking-wider group/link mt-auto"
                >
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover/link:-translate-y-full">Explore</span>
                    <span className="absolute inset-0 text-muted-gold transition-transform duration-300 translate-y-full group-hover/link:translate-y-0">Explore</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-gold transform group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION: The Invitation --- */}
      <section className="w-full py-32 md:py-40 bg-royal-blue relative overflow-hidden">
        {/* Subtle background texture/pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#F5F5DC 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-[80rem] mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-[1px] bg-muted-gold mb-8" />
            <h2 className="font-heading text-5xl md:text-7xl text-off-white mb-8 leading-tight">
              Join Us This Sunday
            </h2>
            <p className="font-paragraph text-xl text-off-white/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Whether you are seeking a church home, exploring the Christian faith, or visiting the area, 
              we welcome you to worship with us and experience the grace of our Lord Jesus Christ.
            </p>
            <Link
              to="/contact"
              className="group relative overflow-hidden bg-muted-gold text-royal-blue px-12 py-5 rounded-sm font-paragraph font-semibold transition-all duration-500 hover:shadow-[0_0_30px_rgba(184,134,11,0.3)]"
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

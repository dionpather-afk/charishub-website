import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/leadership', label: 'Leadership' },
    { path: '/ministries', label: 'Ministries' },
    { path: '/sermons', label: 'Sermons' },
    { path: '/events', label: 'Events' },
    { path: '/devotionals', label: 'Devotionals' },
    { path: '/history', label: 'History' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/giving', label: 'Giving' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-br from-[#102B4E] to-[#061426] border-b border-[#AD843D] sticky top-0 z-50 shadow-sm">
      <div className="max-w-[85rem] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Image
              src="https://static.wixstatic.com/media/dd740b_411d0e0557674c7a861459e7e5688d49~mv2.png"
              alt="RCA Charisma logo"
              className="h-[160px] w-[160px] md:h-[200px] md:w-[200px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-heading text-[19px] xl:text-[21px] whitespace-nowrap tracking-wide px-2 py-0.5 rounded-full border transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-[#DCAC53] border-[#AD843D]'
                    : 'text-[#DCAC53] border-transparent hover:text-[#FFF0B0] hover:[text-shadow:0_0_12px_rgba(255,240,176,0.55)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden text-[#DCAC53] p-2 rounded-lg border border-[#AD843D] hover:text-[#FFF0B0] hover:bg-white/5 hover:shadow-[0_0_12px_rgba(255,240,176,0.25)] transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden overflow-hidden border-t border-[#AD843D]/50"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block font-heading text-lg py-3 px-4 rounded-full border transition-all duration-300 ${
                      isActive(link.path)
                        ? 'text-[#DCAC53] border-[#AD843D]'
                        : 'text-[#DCAC53] border-transparent hover:text-[#FFF0B0] hover:bg-white/5 hover:[text-shadow:0_0_12px_rgba(255,240,176,0.55)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

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
    { path: '/sermons', label: 'Sermons' },
    { path: '/devotionals', label: 'Devotionals' },
    { path: '/events', label: 'Events' },
    { path: '/giving', label: 'Giving' },
    { path: '/about', label: 'About' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
    { path: '/feedback', label: 'Feedback' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-muted-gold border-b border-dark-slate/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 gap-3">
            <Image
              src="https://static.wixstatic.com/media/dd740b_d982717fe72342049a6af021afdc5c43~mv2.png"
              alt="RCA Charisma logo"
              className="h-11 w-11 object-contain"
            />
            <span className="font-heading text-xl md:text-2xl text-royal-blue tracking-tight leading-none">
              RCA Charisma
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-sm transition-colors duration-300 relative group ${
                  isActive(link.path)
                    ? 'text-royal-blue font-semibold'
                    : 'text-dark-slate/80 hover:text-royal-blue'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-royal-blue" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-royal-blue p-2 hover:bg-dark-slate/10 rounded transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              className="lg:hidden overflow-hidden border-t border-dark-slate/10"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block font-paragraph text-base py-3 px-4 rounded transition-colors duration-300 ${
                      isActive(link.path)
                        ? 'text-royal-blue font-semibold bg-dark-slate/10'
                        : 'text-dark-slate/80 hover:text-royal-blue hover:bg-dark-slate/5'
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

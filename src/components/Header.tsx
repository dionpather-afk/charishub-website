import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';
import logoGold from '@/assets/rca-charisma-logo-gold.png?url';

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
    <header className="bg-warm-beige border-b border-dark-slate/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[85rem] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Image
              src={logoGold}
              alt="RCA Charisma logo"
              className="h-[160px] w-[160px] md:h-[200px] md:w-[200px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-heading text-[19px] xl:text-[21px] whitespace-nowrap tracking-wide transition-colors duration-300 relative group ${
                  isActive(link.path)
                    ? 'text-muted-gold'
                    : 'text-dark-slate hover:text-muted-gold'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-muted-gold" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden text-dark-slate p-2 hover:bg-dark-slate/10 rounded transition-colors"
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
              className="xl:hidden overflow-hidden border-t border-dark-slate/10"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block font-heading text-lg py-3 px-4 rounded transition-colors duration-300 ${
                      isActive(link.path)
                        ? 'text-muted-gold bg-dark-slate/5'
                        : 'text-dark-slate hover:text-muted-gold hover:bg-dark-slate/5'
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

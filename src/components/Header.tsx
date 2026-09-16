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
    <header className="bg-royal-blue border-b border-off-white/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[85rem] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Image
              src="https://static.wixstatic.com/media/dd740b_9132e2e60a68473c89eb8f379f750255~mv2.png"
              alt="RCA Charisma logo"
              className="h-[188px] w-[188px] md:h-[219px] md:w-[219px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-heading text-[23px] xl:text-[26px] tracking-wide transition-colors duration-300 relative group ${
                  isActive(link.path)
                    ? 'text-muted-gold'
                    : 'text-off-white hover:text-muted-gold'
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
            className="lg:hidden text-off-white p-2 hover:bg-off-white/10 rounded transition-colors"
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
              className="lg:hidden overflow-hidden border-t border-off-white/10"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block font-heading text-lg py-3 px-4 rounded transition-colors duration-300 ${
                      isActive(link.path)
                        ? 'text-muted-gold bg-off-white/10'
                        : 'text-off-white hover:text-muted-gold hover:bg-off-white/5'
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

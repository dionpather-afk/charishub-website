import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from 'lucide-react';
import { Image } from '@/components/ui/image';
import logoGold from '@/assets/rca-charisma-logo-gold.png?url';
import { SITE_CONFIG } from '@/lib/site-config';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#102B4E] to-[#061426] border-t border-[#AD843D] text-[#F3E6C4]">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[auto_1fr_1fr_1fr_1fr] gap-16 mb-16">
          {/* Logo — standalone, own column */}
          <div className="flex items-start justify-start">
            <Image
              src={logoGold}
              alt="RCA Charisma logo"
              className="h-[125px] w-[125px] object-contain"
            />
          </div>

          {/* About */}
          <div>
            <h3 className="font-heading text-2xl text-[#DCAC53] mb-6">RCA Charisma</h3>
            <p className="font-paragraph text-base text-[#F3E6C4] leading-relaxed">
              A congregation of the Reformed Church in Africa (RCA), committed to the authority of Scripture,
              the glory of God, and the proclamation of the Gospel.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl text-[#DCAC53] mb-6">Quick Links</h4>
            <nav>
              {[
                { path: '/sermons', label: 'Sermons' },
                { path: '/events', label: 'Events' },
                { path: '/giving', label: 'Giving' },
                { path: '/about', label: 'About Us' }
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2.5 font-paragraph text-base text-[#F3E6C4] hover:text-[#FFF0B0] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-xl text-[#DCAC53] mb-6">Contact Us</h4>
            <div className="space-y-5 font-paragraph text-base text-[#F3E6C4]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#DCAC53] mt-1 flex-shrink-0" />
                <p>{SITE_CONFIG.addressLine1}<br />{SITE_CONFIG.addressLine2}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#DCAC53] flex-shrink-0" />
                <a href={SITE_CONFIG.phoneHref} className="relative after:absolute after:content-[''] after:-inset-x-1 after:-inset-y-3 hover:text-[#FFF0B0] transition-colors duration-300">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#DCAC53] flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="relative after:absolute after:content-[''] after:-inset-x-1 after:-inset-y-3 hover:text-[#FFF0B0] transition-colors duration-300">
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="font-heading text-xl text-[#DCAC53] mb-6">Service Times</h4>
            <div className="space-y-3 font-paragraph text-sm text-[#F3E6C4]">
              <div>
                <p className="font-semibold text-[#F7F3E8]">Sunday Service</p>
                <p>9:00 – 10:30 AM</p>
              </div>
              <div>
                <p className="font-semibold text-[#F7F3E8]">Sunday School</p>
                <p>9:30 – 10:30 AM</p>
              </div>
              <div>
                <p className="font-semibold text-[#F7F3E8]">Prayer Meeting (Tue)</p>
                <p>7:00 – 8:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-[#F7F3E8]">Home Fellowship (Thu)</p>
                <p>7:00 – 8:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-[#F7F3E8]">Youth Meeting (Fri)</p>
                <p>7:30 – 9:30 PM</p>
              </div>
              <div>
                <p className="font-semibold text-[#F7F3E8]">Laudium Outreach (Mon)</p>
                <p>6:30 – 7:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="pt-12 border-t border-[#AD843D]/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="font-paragraph text-sm text-[#F3E6C4]/80">
              © {new Date().getFullYear()} RCA Charisma. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:absolute after:content-[''] after:-inset-2.5 text-[#DCAC53] hover:text-[#FFF0B0] transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:absolute after:content-[''] after:-inset-2.5 text-[#DCAC53] hover:text-[#FFF0B0] transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:absolute after:content-[''] after:-inset-2.5 text-[#DCAC53] hover:text-[#FFF0B0] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

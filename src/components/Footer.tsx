import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { SITE_CONFIG } from '@/lib/site-config';

export default function Footer() {
  return (
    <footer className="bg-dark-slate text-off-white">
      <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          {/* About */}
          <div>
            <div className="bg-off-white rounded-full p-1.5 inline-block mb-4 w-fit">
              <Image src="https://static.wixstatic.com/media/dd740b_d982717fe72342049a6af021afdc5c43~mv2.png" alt="RCA Charisma logo" className="h-11 w-11 object-contain" />
            </div>
            <h3 className="font-heading text-2xl text-muted-gold mb-6">RCA Charisma</h3>
            <p className="font-paragraph text-base text-off-white/80 leading-relaxed">
              A Reformed Evangelical church committed to the authority of Scripture, 
              the glory of God, and the proclamation of the Gospel.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl text-muted-gold mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {[
                { path: '/sermons', label: 'Sermons' },
                { path: '/events', label: 'Events' },
                { path: '/giving', label: 'Giving' },
                { path: '/about', label: 'About Us' }
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block font-paragraph text-base text-off-white/80 hover:text-muted-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-xl text-muted-gold mb-6">Contact Us</h4>
            <div className="space-y-4 font-paragraph text-base text-off-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-gold mt-1 flex-shrink-0" />
                <p>{SITE_CONFIG.addressLine1}<br />{SITE_CONFIG.addressLine2}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-gold flex-shrink-0" />
                <a href={SITE_CONFIG.phoneHref} className="hover:text-muted-gold transition-colors duration-300">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-gold flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-muted-gold transition-colors duration-300">
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="font-heading text-xl text-muted-gold mb-6">Service Times</h4>
            <div className="space-y-3 font-paragraph text-base text-off-white/80">
              <div>
                <p className="font-semibold text-off-white">Sunday Worship</p>
                <p>9:00 AM</p>
              </div>
              <div>
                <p className="font-semibold text-off-white">Tuesday Prayer</p>
                <p>7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="pt-12 border-t border-off-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="font-paragraph text-sm text-off-white/60">
              © {new Date().getFullYear()} RCA Charisma. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-off-white/80 hover:text-muted-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-off-white/80 hover:text-muted-gold transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-off-white/80 hover:text-muted-gold transition-colors duration-300"
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

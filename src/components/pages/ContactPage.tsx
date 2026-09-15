import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { ContactSubmissions } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    messageContent: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await BaseCrudService.create<ContactSubmissions>('contactsubmissions', {
        _id: crypto.randomUUID(),
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        subject: formData.subject,
        messageContent: formData.messageContent,
        submissionDate: new Date().toISOString()
      });

      toast({
        title: 'Message Sent',
        description: 'Thank you for contacting us. We will respond to you soon.',
      });

      setFormData({
        senderName: '',
        senderEmail: '',
        subject: '',
        messageContent: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-royal-blue py-20">
        <div className="max-w-[100rem] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-primary-foreground mb-6">
              Contact Us
            </h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              We would love to hear from you. Reach out with any questions or prayer requests.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="w-full py-16">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl text-royal-blue mb-8">
                Get in Touch
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-royal-blue/10 rounded-lg p-4">
                    <MapPin className="w-6 h-6 text-royal-blue" />
                  </div>
                  <div>
                    <h3 className="font-paragraph text-lg font-semibold text-royal-blue mb-2">
                      Our Location
                    </h3>
                    <p className="font-paragraph text-base text-dark-slate leading-relaxed">
                      123 Church Street<br />
                      Cape Town, 8001<br />
                      South Africa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-royal-blue/10 rounded-lg p-4">
                    <Phone className="w-6 h-6 text-royal-blue" />
                  </div>
                  <div>
                    <h3 className="font-paragraph text-lg font-semibold text-royal-blue mb-2">
                      Phone
                    </h3>
                    <a
                      href="tel:+27211234567"
                      className="font-paragraph text-base text-dark-slate hover:text-muted-gold transition-colors duration-300"
                    >
                      +27 21 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-royal-blue/10 rounded-lg p-4">
                    <Mail className="w-6 h-6 text-royal-blue" />
                  </div>
                  <div>
                    <h3 className="font-paragraph text-lg font-semibold text-royal-blue mb-2">
                      Email
                    </h3>
                    <a
                      href="mailto:info@rcacharisma.org"
                      className="font-paragraph text-base text-dark-slate hover:text-muted-gold transition-colors duration-300"
                    >
                      info@rcacharisma.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-royal-blue/10 rounded-lg p-4">
                    <Clock className="w-6 h-6 text-royal-blue" />
                  </div>
                  <div>
                    <h3 className="font-paragraph text-lg font-semibold text-royal-blue mb-2">
                      Service Times
                    </h3>
                    <div className="font-paragraph text-base text-dark-slate space-y-2">
                      <p><span className="font-semibold">Sunday Morning:</span> 9:00 AM - 11:00 AM</p>
                      <p><span className="font-semibold">Sunday Evening:</span> 5:00 PM - 6:30 PM</p>
                      <p><span className="font-semibold">Wednesday Bible Study:</span> 7:00 PM - 8:30 PM</p>
                      <p><span className="font-semibold">Friday Youth Service:</span> 6:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-lg border border-slate-gray/20 p-8">
                <h2 className="font-heading text-3xl text-royal-blue mb-6">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="senderName" className="block font-paragraph text-base font-semibold text-dark-slate mb-2">
                      Your Name
                    </label>
                    <Input
                      id="senderName"
                      name="senderName"
                      type="text"
                      value={formData.senderName}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="senderEmail" className="block font-paragraph text-base font-semibold text-dark-slate mb-2">
                      Your Email
                    </label>
                    <Input
                      id="senderEmail"
                      name="senderEmail"
                      type="email"
                      value={formData.senderEmail}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block font-paragraph text-base font-semibold text-dark-slate mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="messageContent" className="block font-paragraph text-base font-semibold text-dark-slate mb-2">
                      Message
                    </label>
                    <Textarea
                      id="messageContent"
                      name="messageContent"
                      value={formData.messageContent}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[150px]"
                      placeholder="Your message here..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-royal-blue text-primary-foreground hover:bg-royal-blue/90 font-paragraph font-semibold py-6"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl text-royal-blue mb-8 text-center">
              Find Us
            </h2>
            <div className="aspect-video rounded-lg overflow-hidden border border-slate-gray/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.6087!2d18.4241!3d-33.9249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU1JzI5LjYiUyAxOMKwMjUnMjYuOCJF!5e0!3m2!1sen!2sza!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RCA Charisma Location"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

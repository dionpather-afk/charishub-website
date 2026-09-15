import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { TeamBios } from '@/entities';
import { Image } from '@/components/ui/image';

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamBios[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const result = await BaseCrudService.getAll<TeamBios>('teambios');
      setTeamMembers(result.items);
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setIsLoading(false);
    }
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
              About Us
            </h1>
            <p className="font-paragraph text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Meet the shepherds and servants called to lead and care for our congregation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-royal-blue mb-8 text-center">
              Our Mission
            </h2>
            <div className="space-y-6 font-paragraph text-lg text-dark-slate leading-relaxed">
              <p>
                RCA Charisma is a Reformed Evangelical church committed to the authority of Scripture alone (Sola Scriptura), 
                the glory of God alone (Soli Deo Gloria), and the proclamation of the Gospel of Jesus Christ.
              </p>
              <p>
                We are a community devoted to faithful biblical teaching, reverent worship, genuine fellowship, 
                and compassionate service. Our desire is to see lives transformed by the power of the Gospel 
                and to equip believers to live faithfully for the glory of God.
              </p>
              <p>
                Rooted in the historic Reformed tradition, we hold to the doctrines of grace and seek to honor 
                God in all aspects of church life, from our worship services to our community outreach.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full py-16">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-royal-blue mb-4">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Scripture Alone',
                description: 'We believe the Bible is the inspired, inerrant Word of God and our final authority for faith and practice.'
              },
              {
                title: 'Christ Centered',
                description: 'Jesus Christ is the heart of our message, the foundation of our hope, and the focus of our worship.'
              },
              {
                title: 'Gospel Driven',
                description: 'The good news of salvation by grace through faith motivates all we do and shapes our mission.'
              },
              {
                title: 'Faithful Worship',
                description: 'We gather to worship God reverently, joyfully, and in accordance with His Word.'
              },
              {
                title: 'Biblical Community',
                description: 'We pursue authentic relationships marked by love, accountability, and mutual encouragement.'
              },
              {
                title: 'Compassionate Service',
                description: 'We serve our neighbors and community with the love and compassion of Christ.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-slate-gray/20 p-8"
              >
                <h3 className="font-heading text-2xl text-royal-blue mb-4">
                  {value.title}
                </h3>
                <p className="font-paragraph text-base text-dark-slate leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-royal-blue mb-4">
              Our Leadership Team
            </h2>
            <p className="font-paragraph text-lg text-dark-slate max-w-3xl mx-auto leading-relaxed">
              Shepherds called to serve, teach, and care for the flock of God.
            </p>
          </motion.div>

          <div className="min-h-[400px]">
            {isLoading ? null : teamMembers.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-paragraph text-xl text-dark-slate">
                  Leadership information will be available soon.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-off-white rounded-lg overflow-hidden border border-slate-gray/20 hover:border-muted-gold transition-all duration-300"
                  >
                    {member.profilePhoto && (
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={member.profilePhoto}
                          alt={member.leaderName || 'Team member'}
                          className="w-full h-full object-cover"
                          width={400}
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="font-heading text-2xl text-royal-blue mb-2">
                        {member.leaderName}
                      </h3>
                      {member.role && (
                        <p className="font-paragraph text-base text-muted-gold font-semibold mb-4">
                          {member.role}
                        </p>
                      )}
                      {member.ministry && (
                        <p className="font-paragraph text-sm text-dark-slate/70 mb-4">
                          {member.ministry}
                        </p>
                      )}
                      {member.biography && (
                        <p className="font-paragraph text-base text-dark-slate leading-relaxed mb-4">
                          {member.biography}
                        </p>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-2 text-muted-gold font-paragraph text-sm font-semibold hover:text-royal-blue transition-colors duration-300"
                        >
                          <Mail className="w-4 h-4" />
                          Contact
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

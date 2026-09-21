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
      <section className="w-full bg-royal-blue py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-muted-gold tracking-[0.2em] uppercase text-sm md:text-base font-semibold mb-6 block">
              "Using God's Gifts to Serve Our Community"
            </span>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6">
              About Us
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Meet the shepherds and servants called to lead and care for our congregation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-24 md:py-32 bg-off-white">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-12 text-center">
              Our Mission
            </h2>
            <div className="space-y-8 font-paragraph text-lg text-dark-slate/80 leading-relaxed">
              <p>
                RCA Charisma is a congregation of the Reformed Church in Africa (RCA). We believe the Bible is God's Word and our final authority for faith and life,
                we live for God's glory alone, and we are devoted to sharing the Gospel of Jesus Christ.
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

      {/* Community Programmes Section */}
      <section className="w-full py-24 md:py-32 bg-white border-y border-slate-gray/10">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-6">
              Community Programmes
            </h2>
            <p className="font-paragraph text-lg text-dark-slate/80 max-w-3xl mx-auto leading-relaxed">
              Free counselling and practical support, offered in love to anyone who needs it —
              no matter your background or beliefs.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              'All personal and family needs',
              'Support with addiction',
              'Prison ministry',
              'Soup kitchen',
              'Pastoral care',
              'Spiritual help',
              'Prayer requests welcome',
            ].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-off-white rounded-lg border border-slate-gray/20 p-6 text-center hover:border-muted-gold hover:shadow-md transition-all duration-300"
              >
                <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-6">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
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
                className="bg-white rounded-lg border border-slate-gray/20 p-8 hover:border-muted-gold hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-heading text-2xl text-royal-blue mb-4">
                  {value.title}
                </h3>
                <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="w-full py-24 md:py-32 bg-off-white">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-6">
              Our Leadership Team
            </h2>
            <p className="font-paragraph text-lg text-dark-slate/80 max-w-3xl mx-auto leading-relaxed">
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
              <>
                {/* Featured leader (Reverend) with full bio */}
                {teamMembers.filter((m) => m.biography && m.biography !== 'Bio TBA — full details coming soon.').map((member) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg overflow-hidden border border-slate-gray/20 shadow-sm mb-16"
                  >
                    <div className="grid md:grid-cols-[350px_1fr] gap-0">
                      {member.profilePhoto && (
                        <div className="aspect-square md:aspect-auto overflow-hidden">
                          <Image
                            src={member.profilePhoto}
                            alt={member.leaderName || 'Team member'}
                            className="w-full h-full object-cover object-top"
                            width={500}
                          />
                        </div>
                      )}
                      <div className="p-10 md:p-14 flex flex-col justify-center">
                        <h3 className="font-heading text-3xl md:text-4xl text-royal-blue mb-2">
                          {member.leaderName}
                        </h3>
                        {member.role && (
                          <p className="font-paragraph text-lg text-muted-gold font-semibold mb-6">
                            {member.role}
                          </p>
                        )}
                        <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed whitespace-pre-line">
                          {member.biography}
                        </p>
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-2 mt-6 text-muted-gold font-paragraph text-sm font-semibold hover:text-royal-blue transition-colors duration-300 w-fit"
                          >
                            <Mail className="w-4 h-4" />
                            Contact
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Elders — simple grid, name and title only */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {teamMembers.filter((m) => !m.biography || m.biography === 'Bio TBA — full details coming soon.').map((member, index) => (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="text-center"
                    >
                      {member.profilePhoto && (
                        <div className="aspect-square overflow-hidden rounded-full border-2 border-muted-gold/30 mb-4 mx-auto max-w-[180px]">
                          <Image
                            src={member.profilePhoto}
                            alt={member.leaderName || 'Team member'}
                            className="w-full h-full object-cover object-top"
                            width={300}
                          />
                        </div>
                      )}
                      <h3 className="font-heading text-lg text-royal-blue">
                        {member.leaderName}
                      </h3>
                      {member.role && (
                        <p className="font-paragraph text-sm text-muted-gold font-semibold">
                          {member.role}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

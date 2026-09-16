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
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6">
              About Us
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Meet the shepherds and servants called to lead and care for our congregation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Declaration of Laudium */}
      <section className="w-full py-24 md:py-32 bg-white border-b border-slate-gray/10">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-lg overflow-hidden border border-slate-gray/20 shadow-sm"
            >
              <Image
                src="https://static.wixstatic.com/media/dd740b_e2c019f03fa1440792fb30ab4455c6b6~mv2.jpg"
                alt="The Declaration of Laudium"
                className="w-full h-auto object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-heading text-4xl md:text-5xl text-royal-blue mb-4">
                The Declaration of Laudium
              </h2>
              <p className="font-paragraph text-sm text-muted-gold font-semibold uppercase tracking-wide mb-6">
                Adopted at the Sixth Synod of the Reformed Church in Africa, October 1990
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { title: 'The Biblical Gospel', desc: 'Every person is born in sin and lost without Christ, and salvation is found in no other name.' },
                  { title: "The Holy Spirit's Witness", desc: 'Evangelism bears no fruit apart from the Spirit, and a holy life gives that witness its credibility.' },
                  { title: 'Evangelistic Witness & Compassionate Service', desc: 'The whole Gospel is proclaimed to the whole world, with real care for the poor and those in need.' },
                  { title: 'Unity', desc: 'Unity is affirmed with all born-again believers, and racism within the church is named a denial of the Gospel.' },
                  { title: 'Prophetic Witness', desc: "The church speaks against injustice and oppression, while remaining free from any political ideology or movement." },
                ].map((point) => (
                  <li key={point.title} className="flex gap-3">
                    <span className="text-muted-gold font-bold mt-1">•</span>
                    <div>
                      <span className="font-heading text-lg text-royal-blue">{point.title}</span>
                      <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed">{point.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="bg-off-white border-l-4 border-muted-gold p-6 rounded">
                <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed mb-3">
                  This declaration is more than history — it's a promise our church stands on. It was
                  personally presented to RCA Charisma on 25 April 2004, and it still shapes how we
                  read Scripture, love our neighbours, and stand for truth today. Every ministry on
                  this page flows from these same convictions.
                </p>
                <p className="font-paragraph text-sm text-dark-slate/60 italic">
                  Presented to the Reformed Church in Africa, Charisma Congregation, 25 April 2004 —
                  Rev PJP de Beer, Moderator.
                </p>
              </div>
            </motion.div>
          </div>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden border border-slate-gray/20 hover:border-muted-gold hover:shadow-md transition-all duration-300"
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
                    <div className="p-8 md:p-10">
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
                        <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed mb-6">
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

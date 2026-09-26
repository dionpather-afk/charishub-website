import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { TeamBios } from '@/entities';
import { Image } from '@/components/ui/image';

const PASTOR_AND_WIFE_PHOTO = 'https://static.wixstatic.com/media/dd740b_3baa8776540549479e076af81e81c9c3~mv2.jpg';

const hasBio = (m: TeamBios) => !!m.biography && m.biography !== 'Bio TBA — full details coming soon.';

// Ministry leaders are Team Bios entries with the "ministry" field filled in
// (e.g. Youth, Sunday School). Add them in the Wix CMS and they appear here;
// the section stays hidden until there is at least one.
const isMinistryLeader = (m: TeamBios) => !hasBio(m) && !!m.ministry?.trim();

function PersonCard({ member, index, subtitle }: { member: TeamBios; index: number; subtitle?: string }) {
  return (
    <motion.div
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
      {subtitle && (
        <p className="font-paragraph text-sm text-[#7A5A14] font-semibold">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default function LeadershipPage() {
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

  const elders = teamMembers.filter((m) => !hasBio(m) && !isMinistryLeader(m));
  const ministryLeaders = teamMembers.filter(isMinistryLeader);
  const pastors = teamMembers.filter(hasBio);

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[linear-gradient(135deg,#FFF0B0_0%,#DCAC53_55%,#A8782E_100%)] py-24 md:py-32">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#102B4E] mb-6">
              Our Leadership
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-[#061426] max-w-3xl mx-auto leading-relaxed">
              Called to serve, teach, and care for the flock of God.
            </p>
          </motion.div>
        </div>
      </section>

      {isLoading ? (
        <div className="min-h-[400px]" />
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-paragraph text-xl text-dark-slate">
            Leadership information will be available soon.
          </p>
        </div>
      ) : (
        <>
          {/* Our Elders */}
          {elders.length > 0 && (
            <section className="w-full py-24 md:py-32 bg-white">
              <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
                <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-16 text-center">
                  Our Elders
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {elders.map((member, index) => (
                    <PersonCard key={member._id} member={member} index={index} subtitle={member.role} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Ministry Leaders (hidden until entries exist in the CMS) */}
          {ministryLeaders.length > 0 && (
            <section className="w-full py-24 md:py-32 bg-off-white">
              <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
                <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-16 text-center">
                  Ministry Leaders
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {ministryLeaders.map((member, index) => (
                    <PersonCard key={member._id} member={member} index={index} subtitle={member.ministry} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Our Pastor and his Wife */}
          {pastors.map((member) => (
            <section key={member._id} className="w-full py-24 md:py-32 bg-white">
              <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
                <h2 className="font-heading text-5xl md:text-7xl text-royal-blue mb-16 text-center">
                  Our Pastor and his Wife
                </h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-off-white rounded-lg overflow-hidden border border-slate-gray/20 shadow-sm max-w-6xl mx-auto"
                >
                  <Image
                    src={PASTOR_AND_WIFE_PHOTO}
                    alt={`${member.leaderName || 'Our Pastor'} and his wife`}
                    className="w-full h-auto object-contain"
                  />
                  <div className="p-8 md:p-14">
                    <h3 className="font-heading text-3xl md:text-4xl text-royal-blue mb-2">
                      {member.leaderName}
                    </h3>
                    {member.role && (
                      <p className="font-paragraph text-lg text-[#7A5A14] font-semibold mb-6">
                        {member.role}
                      </p>
                    )}
                    <p className="font-paragraph text-base text-dark-slate/80 leading-relaxed whitespace-pre-line">
                      {member.biography}
                    </p>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-2 mt-6 text-[#7A5A14] font-paragraph text-sm font-semibold hover:text-royal-blue transition-colors duration-300 w-fit"
                      >
                        <Mail className="w-4 h-4" />
                        Contact
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>
          ))}
        </>
      )}

      <Footer />
    </div>
  );
}

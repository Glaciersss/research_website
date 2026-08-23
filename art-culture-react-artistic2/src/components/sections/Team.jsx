import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { motion } from 'framer-motion'
import TiltCard from '../common/TiltCard'
import GlassCard from '../common/GlassCard'
import ScrollReveal, { StaggerItem } from '../common/ScrollReveal'

const filterOptions = [
  { value: 'all', label: '全部成员' },
  { value: 'faculty', label: '导师' },
  { value: '在读生', label: '在读生' },
  { value: '毕业生', label: '毕业生' },
]

export default function Team({ onSelectMember }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    setLoading(true)
    api
      .getTeamMembers(activeFilter)
      .then((res) => setMembers(res || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeFilter])

  const filteredMembers = members.filter(
    (m) => activeFilter === 'all' || m.category === activeFilter
  )

  return (
    <section id="team" className="relative py-24 md:py-32 bg-warm-gray">
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-4">团队成员</h2>
            <div className="w-20 h-1 bg-warm-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`relative px-5 py-2 rounded-full text-xl font-medium transition-all duration-300 ${
                activeFilter === opt.value
                  ? 'text-white'
                  : 'text-stone hover:text-ink'
              }`}
            >
              {activeFilter === opt.value && (
                <motion.div
                  layoutId="team-filter-active"
                  className="absolute inset-0 bg-warm-gradient rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center">
                <div className="skeleton w-24 h-24 rounded-full mx-auto mb-4" />
                <div className="skeleton h-5 w-20 mx-auto mb-2" />
                <div className="skeleton h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollReveal staggerChildren>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <StaggerItem key={member.id} className="h-full">
                  <TiltCard tiltDegree={5} className="h-full">
                    <GlassCard
                      hover
                      onClick={() => {
                        if (member.category === 'faculty' && member.website) {
                          window.open(member.website, '_blank')
                        } else {
                          onSelectMember?.(member.id)
                        }
                      }}
                      className="p-6 text-center group cursor-pointer h-full flex flex-col"
                    >
                      {/* Avatar */}
                      <div className="relative w-28 h-28 mx-auto mb-5">
                        <div className="absolute inset-0 rounded-full bg-warm-gradient opacity-30 blur-sm group-hover:opacity-60 transition-opacity" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-surface">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-warm-gray flex items-center justify-center">
                              <i className="fa fa-user text-5xl text-ash" />
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-display text-gradient-warm mb-1">{member.name}</h3>
                      <p className="text-coral text-xl mb-2">{member.role}</p>
                      <p className="text-ash text-xl line-clamp-2">{member.research || ' '}</p>

                      <div className="flex justify-center gap-3 mt-auto pt-4">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 rounded-full bg-warm-gray/50 hover:bg-coral/10 flex items-center justify-center text-ash hover:text-coral transition-colors"
                          >
                            <i className="fa fa-envelope text-xl" />
                          </a>
                        )}
                        {member.website && (
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-warm-gray/50 hover:bg-teal-accent/10 flex items-center justify-center text-ash hover:text-teal-accent transition-colors"
                          >
                            <i className="fa fa-globe text-xl" />
                          </a>
                        )}
                      </div>
                    </GlassCard>
                  </TiltCard>
                </StaggerItem>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

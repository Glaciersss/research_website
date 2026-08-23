import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import GlassCard from '../common/GlassCard'
import TiltCard from '../common/TiltCard'
import MagneticButton from '../common/MagneticButton'

export default function MemberDetail({ memberId, onBack, onSelectProject }) {
  const [member, setMember] = useState(null)
  const [linkedProjects, setLinkedProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadMember() }, [memberId])

  function parseAchievementIds(achievements) {
    if (!achievements) return []
    try { const p = JSON.parse(achievements); return Array.isArray(p) ? p : [] } catch { return [] }
  }

  async function loadMember() {
    setLoading(true)
    try {
      const data = await api.getMemberById(memberId)
      setMember(data)
      const ids = parseAchievementIds(data.achievements)
      if (ids.length > 0) {
        try {
          const projectsData = await api.getProjectsBatch(ids.join(','))
          setLinkedProjects(Array.isArray(projectsData) ? projectsData : [])
        } catch {}
      } else setLinkedProjects([])
    } catch {}
    setLoading(false)
  }

  function getCategoryLabel(cat) {
    if (cat === 'faculty') return '导师'
    if (cat === '在读生' || cat === 'researcher') return '在读生'
    if (cat === '毕业生' || cat === 'student') return '毕业生'
    return cat
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-cream pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="skeleton h-10 w-32 mb-8" />
          <div className="glass p-8 rounded-2xl">
            <div className="flex gap-8"><div className="skeleton w-48 h-48 rounded-full" /><div className="flex-1 space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-5 w-32" /></div></div>
          </div>
        </div>
      </section>
    )
  }

  if (!member) {
    return (
      <section className="min-h-screen bg-cream pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center text-ash">成员信息未找到</div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="min-h-screen bg-cream pt-28 pb-20"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <MagneticButton
          onClick={onBack}
          className="mb-10 px-5 py-2.5 rounded-full border border-border text-stone hover:text-coral hover:border-coral/30 transition-all text-base flex items-center gap-2"
        >
          <i className="fa fa-arrow-left" /> 返回团队列表
        </MagneticButton>

        <GlassCard intense accent className="p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="flex-shrink-0">
              <div className="relative w-44 h-44 mx-auto">
                <div className="absolute inset-0 rounded-full bg-warm-gradient opacity-30 blur-md" />
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="relative w-full h-full rounded-full object-cover border-2 border-surface" />
                ) : (
                  <div className="relative w-full h-full rounded-full bg-warm-gray border-2 border-surface flex items-center justify-center">
                    <i className="fa fa-user text-5xl text-ash" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-display text-gradient-warm mb-2">{member.name}</h1>
              <p className="text-coral text-lg mb-3">{member.role}</p>
              <div className="space-y-2 text-stone text-base">
                <p><span className="text-ash">类别：</span>{getCategoryLabel(member.category)}</p>
                <p><span className="text-ash">研究方向：</span>{member.research || '暂无'}</p>
                {member.email && (
                  <p><span className="text-ash">邮箱：</span>
                    <a href={`mailto:${member.email}`} className="text-coral hover:underline ml-1">{member.email}</a>
                  </p>
                )}
                {member.website && (
                  <p><span className="text-ash">个人网站：</span>
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-coral hover:underline ml-1">{member.website}</a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="border-t border-border pt-8 mb-8">
            <h3 className="text-xl font-display text-gradient mb-4">个人介绍</h3>
            <p className="text-stone leading-relaxed whitespace-pre-wrap text-base">{member.bio || '暂无介绍'}</p>
          </div>

          {/* Achievements */}
          <div className="border-t border-border pt-8">
            <h3 className="text-xl font-display text-gradient mb-5">已有成果</h3>
            {linkedProjects.length > 0 ? (
              <ul className="space-y-3">
                {linkedProjects.map((project) => (
                  <li key={project.id}>
                    <TiltCard tiltDegree={2}>
                      <button
                        onClick={() => onSelectProject?.(project.id)}
                        className="w-full text-left p-4 rounded-xl border border-border hover:border-coral/30 hover:bg-coral/3 transition-all group flex justify-between items-center"
                      >
                        <div>
                          <span className="text-ink text-base">{project.title}</span>
                          {project.authors && <span className="text-ash text-base ml-2">— {project.authors}</span>}
                          {project.year && <span className="text-ash text-base ml-1">({project.year})</span>}
                        </div>
                        <span className="text-coral text-base flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0 ml-4">
                          查看详情 <i className="fa fa-arrow-right" />
                        </span>
                      </button>
                    </TiltCard>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ash text-base">
                {(() => { try { JSON.parse(member.achievements); return '暂无关联成果' } catch { return member.achievements || '暂无成果' } })()}
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </motion.section>
  )
}

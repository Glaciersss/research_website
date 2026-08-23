import { useState, useEffect } from 'react'
import { api } from '../../services/api'

function Team({ onSelectMember }) {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    loadMembers()
  }, [activeFilter])

  const loadMembers = async () => {
    setLoading(true)
    try {
      const response = await api.getTeamMembers(activeFilter)
      setTeamMembers(response || [])
    } catch (error) {
      console.error('Failed to load team members:', error)
    }
    setLoading(false)
  }

const filterOptions = [
  { value: 'all', label: '全部成员' },
  { value: 'faculty', label: '导师' },
  { value: '在读生', label: '在读生' },
  { value: '毕业生', label: '毕业生' }
]

const getCategoryLabel = (category) => {
  if (category === 'faculty') return '导师'
  if (category === 'researcher' || category === '在读生') return '在读生'
  if (category === 'student' || category === '毕业生') return '毕业生'
  return category
}

const filteredMembers = teamMembers.filter(member =>
  activeFilter === 'all' || member.category === activeFilter
)

  if (loading) {
    return (
      <section id="team" className="py-20 bg-ink-wash bg-opacity-30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-display text-sepia mb-4">团队成员</h2>
            <div className="section-underline mx-auto"></div>
          </div>
          <div className="text-center">加载中...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="team" className="py-20 bg-ink-wash bg-opacity-30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-display text-sepia mb-4">团队成员</h2>
          <div className="section-underline mx-auto"></div>
        </div>

        {/* 团队成员筛选 */}
        <div className="flex flex-wrap justify-center mb-12 gap-4" data-aos="fade-up">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`filter-btn px-5 py-2 rounded-full transition-all ${
                activeFilter === option.value ? 'active' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 团队成员展示 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id}
              className="team-member cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
              onClick={() => {
                if (member.category === 'faculty' && member.website) {
                  window.open(member.website, '_blank')
                } else {
                  onSelectMember && onSelectMember(member.id)
                }
              }}
            >
              <div className="ink-wash-card p-6 text-center h-full flex flex-col">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-rice-paper shadow-lg flex-shrink-0">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-ink-wash flex items-center justify-center">
                      <i className="fa fa-user text-5xl text-gray-400"></i>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-display text-sepia mb-1">{member.name}</h3>
                <p className="text-cinnabar mb-3">{member.role}</p>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{member.research || ' '}</p>
                <div className="flex justify-center space-x-3 mt-auto">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-cinnabar">
                      <i className="fa fa-envelope"></i>
                    </a>
                  )}
                  {member.website && (
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cinnabar">
                      <i className="fa fa-globe"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}

export default Team

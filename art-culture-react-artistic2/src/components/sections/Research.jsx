import { useState } from 'react'
import ScrollReveal from '../common/ScrollReveal'

// Inline SVG icons (white fill, simple shapes)
const Icons = {
  digitalization: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="17" height="12" rx="3" fill="white" opacity="0.9"/>
      <rect x="4" y="20" width="17" height="12" rx="3" fill="white" opacity="0.9"/>
      <rect x="4" y="36" width="17" height="8" rx="3" fill="white" opacity="0.9"/>
      <rect x="25" y="4" width="19" height="28" rx="3" fill="white" opacity="0.6"/>
      <rect x="25" y="36" width="19" height="8" rx="3" fill="white" opacity="0.6"/>
      <circle cx="34.5" cy="18" r="4" fill="white"/>
    </svg>
  ),
  interpretation: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="10" stroke="white" strokeWidth="3" opacity="0.9"/>
      <circle cx="18" cy="14" r="2.5" fill="white" opacity="0.8"/>
      <circle cx="30" cy="14" r="2.5" fill="white" opacity="0.8"/>
      <path d="M18 21 Q24 27 30 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
      <rect x="10" y="32" width="28" height="12" rx="4" fill="white" opacity="0.5"/>
      <line x1="24" y1="26" x2="24" y2="34" stroke="white" strokeWidth="2.5" opacity="0.6"/>
    </svg>
  ),
  creation: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="24" width="32" height="18" rx="3" fill="white" opacity="0.5"/>
      <path d="M24 4 L30 18 L24 14 L18 18 Z" fill="white" opacity="0.9"/>
      <rect x="20" y="28" width="8" height="10" rx="2" fill="white" opacity="0.7"/>
      <circle cx="26" cy="12" r="2" fill="white"/>
      <circle cx="20" cy="10" r="1.5" fill="white" opacity="0.7"/>
      <circle cx="30" cy="8" r="1.5" fill="white" opacity="0.7"/>
    </svg>
  ),
  exhibition: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="40" height="28" rx="4" fill="white" opacity="0.5"/>
      <rect x="8" y="14" width="32" height="20" rx="2" fill="white" opacity="0.9"/>
      <circle cx="24" cy="22" r="5" fill="white" opacity="0.6"/>
      <path d="M24 27 L24 34" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <path d="M18 38 L30 38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="22" r="1.5" fill="white"/>
    </svg>
  ),
}

const researchAreas = [
  {
    icon: Icons.digitalization,
    title: '艺术与文化数据化',
    description:
      '围绕艺术与文化资源的数字化，构建多层次的艺术与文化数据库、知识图谱，开展图像、语义、跨模态研究，并探索数字化艺术、文化作品修复技术。面向艺术与文化领域，实现数据标准化、结构化与语义化，为AI模型训练与艺术研究提供高质量的数据基础。',
    gradient: 'from-coral to-coral-light',
  },
  {
    icon: Icons.interpretation,
    title: '艺术与文化理解与分析',
    description:
      '基于艺术、文化作品的题材、风格、内容、技法、形式等特征进行深度解析与分类建模，使用AI等技术方法辅助作品的语义理解与审美判断，支撑艺术鉴赏、教育教学与文化研究等多元应用场景。',
    gradient: 'from-blue-accent to-blue-light',
  },
  {
    icon: Icons.creation,
    title: '艺术与文化再创作',
    description:
      '利用图像生成、视频合成、用户交互式创作等技术，探索艺术、文化作品与音律、诗词等多媒体内容的融合表现形式，推动计算机技术在相关作品创作中的辅助设计与自主创新，探索"人机共创"的新型艺术范式。',
    gradient: 'from-teal-accent to-teal-light',
  },
  {
    icon: Icons.exhibition,
    title: '艺术与文化展陈',
    description:
      '依托高清浏览、图层解析等触控交互技术，以及VR漫游、AR导览、MR创作等XR体验，构建沉浸式作品展览体系。借助计算机技术与数字媒介重塑作品呈现方式，打造"活态展览"，促进中华优秀传统文化的传承与全球文化的交融互鉴。',
    gradient: 'from-gold-accent to-gold-light',
  },
]

function FlipCard({ area }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="h-full min-h-[300px]"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 16px rgba(45,41,38,0.04)',
          }}
        >
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${area.gradient} flex items-center justify-center mb-6`}>
            {area.icon}
          </div>
          <h3 className={`text-3xl font-display bg-gradient-to-r ${area.gradient} bg-clip-text text-transparent px-4`}>
            {area.title}
          </h3>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl flex items-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 16px rgba(45,41,38,0.04)',
          }}
        >
          <p className="text-stone text-xl leading-relaxed">{area.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function Research() {
  return (
    <section id="research" className="relative py-24 md:py-32 bg-warm-gray">
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-4">研究方向</h2>
            <div className="w-20 h-1 bg-teal-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
          {researchAreas.map((area, i) => (
            <ScrollReveal key={area.title} delay={i * 0.1} className="h-full min-h-[280px]">
              <FlipCard area={area} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

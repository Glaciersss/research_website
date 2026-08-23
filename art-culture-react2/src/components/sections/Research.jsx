const researchAreas = [
  {
    icon: '/icons/digitalization.svg',
    title: '艺术与文化数据化',
    description: '围绕艺术与文化资源的数字化，构建多层次的艺术与文化数据库、知识图谱，开展图像、语义、跨模态研究，并探索数字化艺术、文化作品修复技术。面向艺术与文化领域，实现数据标准化、结构化与语义化，为AI模型训练与艺术研究提供高质量的数据基础。',
    delay: 100
  },
  {
    icon: '/icons/interpretation.svg',
    title: '艺术与文化理解与分析',
    description: '基于艺术、文化作品的题材、风格、内容、技法、形式等特征进行深度解析与分类建模，使用AI等技术方法辅助作品的语义理解与审美判断，支撑艺术鉴赏、教育教学与文化研究等多元应用场景。',
    delay: 200
  },
  {
    icon: '/icons/Creation.svg',
    title: '艺术与文化再创作',
    description: '利用图像生成、视频合成、用户交互式创作等技术，探索艺术、文化作品与音律、诗词等多媒体内容的融合表现形式，推动计算机技术在相关作品创作中的辅助设计与自主创新，探索"人机共创"的新型艺术范式。',
    delay: 300
  },
  {
    icon: '/icons/exhibition.svg',
    title: '艺术与文化展陈',
    description: '依托高清浏览、图层解析等触控交互技术，以及VR漫游、AR导览、MR创作等XR体验，构建沉浸式作品展览体系。借助计算机技术与数字媒介重塑作品呈现方式，打造"活态展览"，促进中华优秀传统文化的传承与全球文化的交融互鉴。',
    delay: 400
  }
]

function Research() {
  return (
    <section id="research" className="py-20 bg-ink-wash bg-opacity-30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-display text-sepia mb-4">研究方向</h2>
          <div className="w-24 h-1 bg-cinnabar mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchAreas.map((area, index) => (
            <div
              key={index}
              className="ink-wash-card p-8 rounded-lg"
              data-aos="fade-up"
              data-aos-delay={area.delay}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <img src={area.icon} alt={area.title} className="w-14 h-14" />
                </div>
                <div>
                  <h3 className="text-xl font-display text-sepia mb-3">{area.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{area.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Research

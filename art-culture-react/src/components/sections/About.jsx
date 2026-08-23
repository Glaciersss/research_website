function About() {
  return (
    <section id="about" className="py-20 bg-rice-paper">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-display text-sepia mb-4">关于我们</h2>
          <div className="section-underline mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h3 className="text-2xl font-display text-sepia mb-6">研究团队简介</h3>
            <p className="text-lg mb-6 leading-relaxed">
              艺术与文化智能计算团队致力于将人工智能技术与艺术文化研究相结合，探索数字化时代文化遗产保护、传承与创新的新方法与新途径。
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              团队汇聚了来自计算机科学、艺术史、文化遗产、数字媒体等多个领域的专家学者，形成了跨学科、多元化的研究力量。我们的研究领域涵盖计算机视觉、自然语言处理、机器学习在艺术与文化领域的应用等多个方面。
            </p>
            <div className="flex items-center mt-8">
              <img
                src="/logo.svg"
                alt="艺术与文化智能计算"
                className="h-20 mr-6"
              />
              <div>
                <p className="italic text-gray-700">"智能赋能文化，科技传承艺术"</p>
                <p className="text-right mt-2 text-sepia">— 团队宗旨</p>
              </div>
            </div>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="bg-ink-wash p-1 transform rotate-2">
              <div className="bg-rice-paper p-8 transform -rotate-2">
                <h3 className="text-2xl font-display text-sepia mb-6">中心主任寄语</h3>
                <p className="text-lg mb-6 leading-relaxed">
                  中国传统文化是中华民族的精神命脉，是涵养社会主义核心价值观的重要源泉。在全球化的今天，如何传承和创新中国传统文化，使其在当代社会焕发新的生机，是我们面临的重要课题。
                </p>
                <p className="text-lg leading-relaxed">
                  本研究中心将秉承"传承中创新，创新中传承"的理念，通过跨学科、国际化的研究方法，深入探索中国传统文化的内涵与价值，为中华文化的传承与发展贡献力量。
                </p>
                <div className="mt-8 text-right">
                  <p className="font-bold text-sepia">陈为教授</p>
                  <p className="text-gray-600">研究中心主任</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

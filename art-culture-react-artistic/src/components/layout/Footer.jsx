import { motion } from 'framer-motion'

const linkVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

export default function Footer() {
  return (
    <footer className="relative bg-[#1e2630] text-white pt-6 pb-8">
      {/* Animated wave divider — 3-color layered */}
      <div className="absolute top-0 left-0 right-0 leading-[0] overflow-hidden" style={{ transform: 'translateY(-100%)' }}>
        <svg viewBox="0 0 3200 120" preserveAspectRatio="none"
          className="block h-[80px] md:h-[110px]"
          style={{ width: '200%', marginLeft: '-50%' }}>
          <defs>
            <linearGradient id="wGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5d9e8f" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5d9e8f" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a452" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e8785a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#e8785a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#faf7f2" />
              <stop offset="100%" stopColor="#1e2630" />
            </linearGradient>
          </defs>
          <path className="animate-wave-slow"
            d="M0,20 C600,0 1000,80 1600,30 C2200,-10 2600,70 3200,20 L3200,120 L0,120 Z"
            fill="url(#wGrad3)" />
          <path className="animate-wave-mid"
            d="M0,35 C500,10 1100,70 1600,45 C2100,20 2700,60 3200,35 L3200,120 L0,120 Z"
            fill="url(#wGrad2)" />
          <path className="animate-wave-fast"
            d="M0,50 C500,25 1100,85 1600,55 C2100,30 2700,80 3200,50 L3200,120 L0,120 Z"
            fill="url(#wGrad1)" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h3 variants={linkVariants} className="text-2xl font-display bg-gradient-to-r from-coral-light to-gold-light bg-clip-text text-transparent mb-4">
              艺术与文化智能计算
            </motion.h3>
            <motion.p variants={linkVariants} className="text-white/70 text-lg leading-relaxed">
              致力于将人工智能技术与艺术文化研究相结合，探索数字化时代文化遗产保护、传承与创新的新方法与新途径。
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h3 variants={linkVariants} className="text-2xl font-display text-white/90 mb-4">
              快速链接
            </motion.h3>
            <ul className="space-y-2">
              {[
                { href: '#about', label: '关于我们' },
                { href: '#research', label: '研究方向' },
                { href: '#projects', label: '学术成果' },
                { href: '#team', label: '团队成员' },
                { href: '#news', label: '新闻动态' },
                { href: '#contact', label: '联系我们' },
              ].map((item) => (
                <motion.li key={item.href} variants={linkVariants}>
                  <a
                    href={item.href}
                    className="text-white/60 hover:text-coral-light transition-all duration-300 text-lg flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-coral-light transition-all duration-300" />
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h3 variants={linkVariants} className="text-2xl font-display text-white/90 mb-4">
              学术资源
            </motion.h3>
            <ul className="space-y-2">
              {['学术著作', '研究项目', '学术论文', '古籍数据库', '学术讲座', '学术会议'].map((label) => (
                <motion.li key={label} variants={linkVariants}>
                  <a href="#" className="text-white/60 hover:text-teal-light transition-all duration-300 text-lg flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-3 h-px bg-teal-light transition-all duration-300" />
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h3 variants={linkVariants} className="text-2xl font-display text-white/90 mb-4">
              联系方式
            </motion.h3>
            <motion.div variants={linkVariants} className="flex items-start gap-3 mb-3">
              <i className="fa fa-map-marker text-coral-light mt-1 text-xl" />
              <span className="text-white/70 text-lg">State Key Lab of CAD&CG, Zijingang Campus, Zhejiang University.</span>
            </motion.div>
            <motion.div variants={linkVariants} className="flex items-start gap-3">
              <i className="fa fa-envelope text-coral-light mt-1 text-xl" />
              <span className="text-white/70 text-lg">zjuvis@cad.zju.edu.cn</span>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-lg">© 2025 艺术与文化智能计算. 保留所有权利.</p>
          <div className="flex gap-6">
            {['隐私政策', '使用条款', '网站地图'].map((label) => (
              <a key={label} href="#" className="text-white/40 hover:text-white/70 text-lg transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

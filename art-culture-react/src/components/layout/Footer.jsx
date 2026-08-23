function Footer() {
  return (
    <footer className="bg-ink-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 研究中心简介 */}
          <div>
            <h3 className="text-xl font-display text-rice-paper mb-4">艺术与文化智能计算</h3>
            <p className="text-gray-400 mb-4">
              致力于将人工智能技术与艺术文化研究相结合，探索数字化时代文化遗产保护、传承与创新的新方法与新途径。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-xl font-display text-rice-paper mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-all">关于我们</a></li>
              <li><a href="#research" className="text-gray-400 hover:text-white transition-all">研究方向</a></li>
              <li><a href="#projects" className="text-gray-400 hover:text-white transition-all">学术成果</a></li>
              <li><a href="#team" className="text-gray-400 hover:text-white transition-all">团队成员</a></li>
              <li><a href="#news" className="text-gray-400 hover:text-white transition-all">新闻动态</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-all">联系我们</a></li>
            </ul>
          </div>

          {/* 学术资源 */}
          <div>
            <h3 className="text-xl font-display text-rice-paper mb-4">学术资源</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">学术著作</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">研究项目</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">学术论文</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">古籍数据库</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">学术讲座</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">学术会议</a></li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-xl font-display text-rice-paper mb-4">联系方式</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fa fa-map-marker text-cinnabar mt-1 mr-3"></i>
                <span className="text-gray-400">State Key Lab of CAD&CG, Zijingang Campus, Zhejiang University.</span>
              </li>
              <li className="flex items-start">
                <i className="fa fa-envelope text-cinnabar mt-1 mr-3"></i>
                <span className="text-gray-400">zjuvis@cad.zju.edu.cn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 艺术与文化智能计算. 保留所有权利.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">隐私政策</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">使用条款</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">网站地图</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

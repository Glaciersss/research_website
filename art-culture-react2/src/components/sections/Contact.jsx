import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`感谢您的留言，${formData.name}！我们会尽快回复您。`)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <section id="contact" className="py-20 bg-ink-wash bg-opacity-30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-display text-sepia mb-4">联系我们</h2>
          <div className="w-24 h-1 bg-cinnabar mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 联系信息 */}
          <div data-aos="fade-right">
            <h3 className="text-2xl font-display text-sepia mb-6">联系方式</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-cinnabar bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa fa-map-marker text-xl text-cinnabar"></i>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ink-black mb-1">地址</h4>
                  <p className="text-gray-700">State Key Lab of CAD&CG</p>
                  <p className="text-gray-700">Zijingang Campus, Zhejiang University.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-cinnabar bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa fa-phone text-xl text-cinnabar"></i>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ink-black mb-1">邮政地址</h4>
                  <p className="text-gray-700">310058, Hangzhou, China.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-cinnabar bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa fa-envelope text-xl text-cinnabar"></i>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ink-black mb-1">邮箱</h4>
                  <p className="text-gray-700">zjuvis@cad.zju.edu.cn</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-cinnabar bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fa fa-clock-o text-xl text-cinnabar"></i>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ink-black mb-1">办公时间</h4>
                  <p className="text-gray-700">周一至周五: 8:00 - 18:00</p>
                  <p className="text-gray-700">周六、周日: 休息</p>
                </div>
              </div>
            </div>

          </div>

          {/* 留言表单 */}
          <div data-aos="fade-left">
            <h3 className="text-2xl font-display text-sepia mb-6">给我们留言</h3>
            <form id="contact-form" className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">姓名</label>
                  <input
                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-rice-paper border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cinnabar focus:border-transparent"
                                                    placeholder="请输入您的姓名"
                                                    required
                                                  />
                                                </div>
                                                <div>
                                                  <label htmlFor="email" className="block text-gray-700 mb-2">邮箱</label>
                                                  <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-rice-paper border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cinnabar focus:border-transparent"
                                                    placeholder="请输入您的邮箱"
                                                    required
                                                  />
                                                </div>
                                              </div>

                                              <div>
                                                <label htmlFor="subject" className="block text-gray-700 mb-2">主题</label>
                                                <input
                                                  type="text"
                                                  id="subject"
                                                  name="subject"
                                                  value={formData.subject}
                                                  onChange={handleInputChange}
                                                  className="w-full px-4 py-3 bg-rice-paper border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cinnabar focus:border-transparent"
                                                  placeholder="请输入留言主题"
                                                  required
                                                />
                                              </div>

                                              <div>
                                                <label htmlFor="message" className="block text-gray-700 mb-2">留言内容</label>
                                                <textarea
                                                  id="message"
                                                  name="message"
                                                  rows="5"
                                                  value={formData.message}
                                                  onChange={handleInputChange}
                                                  className="w-full px-4 py-3 bg-rice-paper border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cinnabar focus:border-transparent"
                                                  placeholder="请输入您的留言内容"
                                                  required
                                                ></textarea>
                                              </div>

                                              <div>
                                                <button
                                                  type="submit"
                                                  className="bg-cinnabar text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all scroll-effect"
                                                >
                                                  提交留言
                                                </button>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </section>
                                  )
                                }

                                export default Contact

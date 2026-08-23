import { useState } from 'react'
import GlassCard from '../common/GlassCard'
import ScrollReveal from '../common/ScrollReveal'
import MagneticButton from '../common/MagneticButton'
import FloatingBlobs from '../common/FloatingBlobs'

const contactInfo = [
  { icon: 'fa-map-marker', label: '地址', lines: ['State Key Lab of CAD&CG', 'Zijingang Campus, Zhejiang University.'] },
  { icon: 'fa-phone', label: '邮政地址', lines: ['310058, Hangzhou, China.'] },
  { icon: 'fa-envelope', label: '邮箱', lines: ['zjuvis@cad.zju.edu.cn'] },
  { icon: 'fa-clock-o', label: '办公时间', lines: ['周一至周五: 8:00 - 18:00', '周六、周日: 休息'] },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-cream overflow-hidden">
      <FloatingBlobs />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-4">联系我们</h2>
            <div className="w-20 h-1 bg-warm-gradient rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact info */}
          <ScrollReveal direction="left">
            <h3 className="text-3xl font-display text-gradient-warm mb-8">联系方式</h3>
            <div className="space-y-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-coral/3 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0">
                    <i className={`fa ${item.icon} text-coral text-2xl`} />
                  </div>
                  <div>
                    <h4 className="text-ink text-xl font-medium mb-1">{item.label}</h4>
                    {item.lines.map((line, i) => (
                      <p key={i} className="text-stone text-xl">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal direction="right">
            <GlassCard intense className="p-8">
              <h3 className="text-3xl font-display text-gradient-warm mb-8">给我们留言</h3>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-teal-accent/10 flex items-center justify-center mx-auto mb-4">
                    <i className="fa fa-check text-2xl text-teal-accent" />
                  </div>
                  <p className="text-ink text-2xl">感谢您的留言！</p>
                  <p className="text-ash text-xl mt-1">我们会尽快回复您。</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-stone text-xl mb-2">姓名</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="请输入您的姓名"
                        className="w-full px-4 py-3 bg-warm-gray/50 border border-border rounded-xl text-xl text-ink placeholder:text-ash focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-stone text-xl mb-2">邮箱</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="请输入您的邮箱"
                        className="w-full px-4 py-3 bg-warm-gray/50 border border-border rounded-xl text-xl text-ink placeholder:text-ash focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/30 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone text-xl mb-2">主题</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="请输入留言主题"
                      className="w-full px-4 py-3 bg-warm-gray/50 border border-border rounded-xl text-xl text-ink placeholder:text-ash focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-stone text-xl mb-2">留言内容</label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="请输入您的留言内容"
                      className="w-full px-4 py-3 bg-warm-gray/50 border border-border rounded-xl text-xl text-ink placeholder:text-ash focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/30 transition-all resize-none"
                    />
                  </div>
                  <MagneticButton
                    type="submit"
                    className="w-full py-4 rounded-xl text-xl bg-warm-gradient text-white font-medium hover:shadow-glow transition-shadow"
                  >
                    提交留言
                  </MagneticButton>
                </form>
              )}
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

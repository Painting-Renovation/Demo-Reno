'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Mail, Download, Shield, Zap, Gift, CheckCircle2, Users } from 'lucide-react';

const chapters = [
  'Choosing the Right Paint for Every Room',
  'Understanding Painting Costs in the GTA',
  'How to Prepare Your Home',
  'Color Trends That Add Value',
  'Maintenance Tips for Long-Lasting Results',
];

const trustIndicators = [
  { icon: Shield, label: 'No spam ever' },
  { icon: Zap, label: 'Download instantly' },
  { icon: Gift, label: '100% free' },
];

export function LeadMagnetSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FDF8F0 0%, #FFFFFF 100%)',
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C8973E 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #5B7B5A 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
            style={{ background: '#C8973E15', color: '#C8973E' }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Free Download
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: '#0B1D3A' }}
          >
            Free: The Complete Toronto
            <br className="hidden sm:block" />
            <span style={{ color: '#C8973E' }}> Homeowner&apos;s Guide to Painting</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: '#0B1D3A99' }}>
            Everything you need to know before hiring a painter. 32 pages of expert advice.
          </p>
        </motion.div>

        {/* Main split layout */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Book mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Book shadow */}
              <div className="absolute inset-0 rounded-2xl translate-x-4 translate-y-4 blur-xl opacity-30"
                style={{ background: '#0B1D3A' }}
              />

              {/* Book cover */}
              <div
                className="relative w-72 sm:w-80 rounded-2xl p-8 flex flex-col justify-between shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #0B1D3A 0%, #132D5E 50%, #0B1D3A 100%)',
                  minHeight: '400px',
                }}
              >
                {/* Gold top accent line */}
                <div className="absolute top-0 left-8 right-8 h-1 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #C8973E, #E8C277, #C8973E)' }}
                />

                {/* Top section */}
                <div>
                  {/* Logo reference */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: '#C8973E' }}
                    >
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <span className="text-white/60 text-sm font-medium tracking-wide">PROCOAT PAINTERS</span>
                  </div>

                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ background: '#C8973E25', color: '#C8973E' }}
                  >
                    <Gift className="w-3 h-3" />
                    FREE GUIDE — 32 PAGES
                  </div>

                  {/* Title */}
                  <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight mb-2">
                    The Complete Toronto
                    <br />
                    <span style={{ color: '#C8973E' }}>Homeowner&apos;s Guide</span>
                  </h3>
                  <p className="text-white/50 text-sm">to Painting</p>
                </div>

                {/* Chapter list */}
                <div className="space-y-2.5 mt-6">
                  {chapters.map((chapter, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                        style={{ background: '#C8973E20', color: '#C8973E' }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-white/70 text-xs leading-relaxed">{chapter}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom decoration */}
                <div className="absolute bottom-6 left-8 right-8">
                  <div className="h-px w-full opacity-20" style={{ background: 'linear-gradient(90deg, #C8973E, transparent)' }} />
                </div>

                {/* Spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-2xl"
                  style={{ background: 'linear-gradient(180deg, #C8973E, #A67B2E)' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Email form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          >
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl border"
              style={{ borderColor: '#0B1D3A10' }}
            >
              {!submitted ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: '#FDF8F0' }}
                    >
                      <Mail className="w-5 h-5" style={{ color: '#C8973E' }} />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#0B1D3A' }}>
                      Get Your Free Copy
                    </h3>
                  </div>
                  <p className="text-sm mb-6" style={{ color: '#0B1D3A80' }}>
                    Enter your email and we&apos;ll send you the complete 32-page guide — instantly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#0B1D3A40' }} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                        style={{
                          borderColor: '#0B1D3A15',
                          color: '#0B1D3A',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#C8973E';
                          e.target.style.boxShadow = '0 0 0 3px rgba(200,151,62,0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#0B1D3A15';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #C8973E 0%, #D4A94E 100%)',
                        boxShadow: '0 8px 24px rgba(200,151,62,0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Send Me the Free Guide
                        </>
                      )}
                    </button>
                  </form>

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6"
                    style={{ borderTop: '1px solid #0B1D3A08' }}
                  >
                    {trustIndicators.map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5 text-xs" style={{ color: '#0B1D3A60' }}>
                        <item.icon className="w-3.5 h-3.5" style={{ color: '#5B7B5A' }} />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Success state */
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
                    className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{ background: '#5B7B5A15' }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
                    >
                      <CheckCircle2 className="w-10 h-10" style={{ color: '#5B7B5A' }} />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0B1D3A' }}>
                    Check your inbox!
                  </h3>
                  <p className="text-sm" style={{ color: '#0B1D3A70' }}>
                    We&apos;ve sent the guide to <span className="font-semibold" style={{ color: '#C8973E' }}>{email}</span>.
                    <br />
                    Happy reading!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-3 mt-6"
            >
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {[
                  'bg-blue-400',
                  'bg-rose-400',
                  'bg-amber-400',
                  'bg-emerald-400',
                  'bg-violet-400',
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {['JD', 'AK', 'MR', 'SL', 'PT'][i]}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" style={{ color: '#C8973E' }} />
                <span className="text-sm font-medium" style={{ color: '#0B1D3A' }}>
                  <strong style={{ color: '#C8973E' }}>12,500+</strong> homeowners have already downloaded
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

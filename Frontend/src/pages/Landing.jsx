import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    .font-serif-display { font-family: 'Cormorant Garamond', Georgia, serif; }
    .font-body          { font-family: 'DM Sans', system-ui, sans-serif; }
    @keyframes marquee  { from { transform: translateX(0) } to { transform: translateX(-50%) } }
    @keyframes fadeUp   { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
    .animate-marquee  { animation: marquee 35s linear infinite; }
    .animate-fade-up  { animation: fadeUp .75s ease both; }
    .anim-d1 { animation-delay: .12s; }
    .anim-d2 { animation-delay: .24s; }
    .anim-d3 { animation-delay: .36s; }
    .anim-d4 { animation-delay: .48s; }
  `}</style>
)

const STATS = [
  { num: '10K', suffix: '+', label: 'Cases Analyzed' },
  { num: '98',  suffix: '%', label: 'Accuracy Rate'  },
  { num: '24',  suffix: '/7', label: 'Always On'     },
]

const STEPS = [
  {
    num: '01',
    title: 'Describe the Incident',
    desc: 'Share the details of your legal situation in plain, everyday language. No legal jargon required.',
  },
  {
    num: '02',
    title: 'AI Deep Analysis',
    desc: 'Our AI cross-references your case against comprehensive legal databases, statutes, and precedents.',
  },
  {
    num: '03',
    title: 'Receive Legal Sections',
    desc: 'Get precise, applicable legal sections with plain-language interpretations tailored to your situation.',
  },
]

const MARQUEE = [
  'Civil Law','Criminal Code','Property Law','Contract Law',
  'Constitutional Law','Family Law','Tort Law','Corporate Law',
  'Civil Law','Criminal Code','Property Law','Contract Law',
  'Constitutional Law','Family Law','Tort Law','Corporate Law',
]

export default function Landing() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t) }, [])

  return (
    <div className="font-body min-h-screen bg-stone-50 text-stone-900 overflow-x-hidden">
      <FontLoader />

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between
                      px-8 md:px-16 py-5
                      bg-stone-50/80 backdrop-blur-xl border-b border-stone-200/80">
        <span className="font-serif-display text-2xl font-medium tracking-wide select-none">
          Legal<span className="text-amber-700"> Ally</span>
        </span>
        <button
          onClick={() => navigate('/chat')}
          className="group flex items-center gap-2 px-5 py-2.5
                     bg-stone-900 text-stone-50 text-xs font-medium tracking-widest uppercase
                     hover:bg-amber-700 transition-colors duration-200"
        >
          Get Started
          <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex items-center justify-center min-h-screen px-6 md:px-16 pt-24 pb-16">
        {/* Decorative vertical line */}
        <div className="hidden lg:block absolute top-40 right-20 w-px h-80
                        bg-gradient-to-b from-transparent via-amber-400/50 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">

          {/* Eyebrow */}
          <div className={`inline-flex items-center gap-3 mb-10 ${ready ? 'animate-fade-up' : 'opacity-0'}`}>
            <span className="w-8 h-px bg-amber-600" />
            <span className="text-amber-700 text-xs font-medium tracking-[0.22em] uppercase">
              AI-Powered Legal Analysis
            </span>
            <span className="w-8 h-px bg-amber-600" />
          </div>

          {/* Headline */}
          <h1 className={`font-serif-display font-light leading-[0.92] text-stone-900 mb-5
                          text-[clamp(4rem,12vw,8rem)]
                          ${ready ? 'animate-fade-up anim-d1' : 'opacity-0'}`}>
            Your{' '}
            <em className="not-italic italic text-amber-700">Legal</em>
            <br />Expert
          </h1>

          {/* Divider */}
          <div className={`w-12 h-px bg-amber-600 mx-auto my-8
                           ${ready ? 'animate-fade-up anim-d2' : 'opacity-0'}`} />

          {/* Sub */}
          <p className={`font-light text-stone-500 leading-[1.85] max-w-md mx-auto mb-12
                         text-base md:text-lg
                         ${ready ? 'animate-fade-up anim-d3' : 'opacity-0'}`}>
            Translate real-world incidents into precise legal sections.
            <br />Instant analysis, grounded in law.
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4
                           ${ready ? 'animate-fade-up anim-d4' : 'opacity-0'}`}>
            <button
              onClick={() => navigate('/chat')}
              className="px-10 py-4 bg-stone-900 text-stone-50 text-xs font-medium
                         tracking-widest uppercase hover:bg-amber-700
                         hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-900/20
                         transition-all duration-200"
            >
              Start Asking
            </button>
            <a
              href="#works"
              className="px-10 py-4 border border-stone-300 text-stone-600 text-xs
                         font-medium tracking-widest uppercase hover:border-amber-600
                         hover:text-amber-700 hover:-translate-y-0.5
                         transition-all duration-200"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden bg-stone-900 py-3.5">
        <div className="flex whitespace-nowrap animate-marquee select-none">
          {MARQUEE.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6
                                     text-stone-500 text-xs font-medium tracking-[0.18em] uppercase">
              {item}
              <span className="w-1 h-1 rounded-full bg-amber-600/60 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="works" className="relative px-8 md:px-16 py-28 bg-white">
        <div className="absolute top-0 inset-x-0 h-px
                        bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="flex items-center gap-3 mb-3">
          <span className="w-6 h-px bg-amber-600" />
          <span className="text-amber-700 text-xs font-medium tracking-[0.2em] uppercase">Process</span>
        </div>
        <h2 className="font-serif-display font-light text-stone-900 leading-tight mb-16
                       text-4xl md:text-5xl max-w-xs">
          How it <em className="italic text-amber-700">works</em>
        </h2>

        <div className="grid md:grid-cols-3 border border-stone-200
                        divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {STEPS.map(({ num, title, desc }) => (
            <div key={num}
                 className="group relative p-10 hover:bg-stone-50 transition-colors duration-300 cursor-default">
              <span className="font-serif-display text-8xl font-light leading-none block mb-6
                               text-amber-600/10 group-hover:text-amber-600/25 transition-colors duration-300">
                {num}
              </span>
              <h3 className="font-serif-display text-xl font-medium text-stone-800 mb-3">
                {title}
              </h3>
              <p className="text-stone-500 text-sm font-light leading-[1.85]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
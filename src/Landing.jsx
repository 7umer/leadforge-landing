import { useEffect, useRef, useState } from 'react'
import {
  Zap, Sun, Moon, Menu, X, Search, ShieldCheck, Send, MapPin, Smartphone,
  Mail, Languages, Star, Filter, TrendingUp, Check, ChevronDown, ArrowRight,
  FileText, MessageCircle, Clock, Gift, Building2,
} from 'lucide-react'
import { useTheme } from './useTheme'

/* This page is standalone — the actual app lives in a separate repo/deploy,
   so every CTA needs a real URL rather than a client-side route. Set
   VITE_APP_URL in .env (see .env.example) to the app's deployed origin;
   it defaults to a relative path so the build never silently links nowhere,
   but that default only makes sense if this page is ever served from the
   same origin as the app. */
const APP_URL = import.meta.env.VITE_APP_URL || ''
const REGISTER_URL = `${APP_URL}/register`
const LOGIN_URL = `${APP_URL}/login`

/* ---- Scroll-triggered reveal --------------------------------------------
   One observer per element rather than a shared one: there are ~30 of these
   on the page and each only ever fires once, so the bookkeeping a shared
   observer would need (a Map of elements to callbacks) buys nothing. The
   `.reveal` class is what index.css hooks prefers-reduced-motion off of, so
   a visitor who has asked for less motion gets the content immediately
   rather than a state that never resolves. */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

/* Claims a visitor can check for themselves within a minute of signing up.
   Nothing here is social proof: invented user counts are the fastest way to
   lose the trust the page is trying to earn, so every number below traces
   back to the product's own README/CHANGELOG rather than a marketing
   average. */
const HOW_IT_WORKS = [
  {
    icon: Search,
    step: '01',
    title: 'Find',
    promise: 'Search any trade in any city and get real businesses back.',
    detail: 'Google Places search, paged past the 60-result ceiling with grid tiling when a whole city is the target. Deduped on place id, and every scan reports the Google requests it actually billed.',
  },
  {
    icon: ShieldCheck,
    step: '02',
    title: 'Audit',
    promise: 'Know what is wrong before you dial the number.',
    detail: 'Every site is fetched and graded: mobile, HTTPS, dead domains, decade-old markup, missing tags. A mobile screenshot shows the owner their own homepage squeezed onto a phone.',
  },
  {
    icon: Send,
    step: '03',
    title: 'Pitch',
    promise: 'The first message is already written, and it names the problem.',
    detail: 'Outreach opens with the specific fault the audit found, in the language the lead does business in. A site with nothing wrong gets no invented complaint.',
  },
]

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Scored by need, not by completeness',
    body: 'A business with no website outscores one with a full contact card. See the breakdown below.',
    wide: true,
  },
  {
    icon: ShieldCheck,
    title: 'A real website audit',
    body: 'No HTTPS, no viewport tag, pre-2010 markup, jQuery 1.x, a copyright year that never moved, a page that never loads. Each finding is stored on the lead, weighted, and named in the outreach.',
    wide: true,
  },
  {
    icon: MapPin,
    title: 'Grid area scanning',
    body: 'Tile a 2–5 grid of map rectangles to sweep a whole city past Google’s 60-result ceiling.',
  },
  {
    icon: Smartphone,
    title: 'Desktop and mobile screenshots',
    body: 'Headless Chromium renders each site at 1280×800 and 390×844 — the mobile shot is the pitch.',
  },
  {
    icon: Mail,
    title: 'Email enrichment',
    body: 'Places never returns an email. The audit pulls one from the page it already fetched — 0 to 95 found on a real 178-lead account.',
  },
  {
    icon: Languages,
    title: 'Arabic outreach, right to left',
    body: 'Messages and proposals switch language by the lead’s dialling code — 275 of 324 leads on one account do business in Arabic.',
  },
  {
    icon: Star,
    title: 'Google listing gaps',
    body: 'No photos, no hours, few reviews, still marked temporarily closed — free signals for the leads whose site is already fine.',
  },
  {
    icon: Filter,
    title: 'Filters, bulk actions, export',
    body: 'Score range, rating, category, has-email — then bulk message, bulk status, or export to CSV and JSON.',
  },
]

const SCORE_COMPONENTS = [
  { label: 'Need', range: '0–60 pts', width: '85%', color: 'bg-primary-600', detail: 'No website 60 · broken 55 · social-page-only 50 · outdated up to 45 · modern 0–15' },
  { label: 'Reach', range: '0–25 pts', width: '55%', color: 'bg-[#0ea5e9]', detail: 'Phone +12 · email +8 · address +5' },
  { label: 'Viability', range: '0–15 pts', width: '40%', color: 'bg-[#7c3aed]', detail: 'Rating 4.5+ +12 · 4.0+ +10 · 3.0+ +6 · category +3' },
]

const PLANS = [
  {
    id: 'free', name: 'Starter', price: 0, icon: Gift,
    description: 'Get started for free. No card needed.',
    features: ['200 leads max', '4 niches', 'CSV & JSON import', 'Lead scoring & cleaning', 'Template outreach messages', 'Export CSV & JSON'],
    cta: 'Start free',
  },
  {
    id: 'pro', name: 'Pro', price: 19, icon: Zap, popular: true,
    description: 'For freelancers hunting clients daily.',
    features: ['2,000 leads', 'All 10 niches + custom', 'AI-powered message generator', 'Bulk actions', 'Outreach pipeline tracker', 'Priority email support'],
    cta: 'Get Pro',
  },
  {
    id: 'agency', name: 'Agency', price: 49, icon: Building2,
    description: 'For agencies with large lead lists.',
    features: ['Unlimited leads', 'Unlimited custom niches', 'Advanced analytics', 'White-label CSV export', 'API access', 'Priority support'],
    cta: 'Get Agency',
  },
]

const FAQS = [
  {
    q: 'Do I need a Google API key?',
    a: 'For Places search, yes — your own key, billed to you at Google’s rates. CSV import and manual paste work without one.',
  },
  {
    q: 'What does a grid scan cost in API requests?',
    a: 'More than a single search — each tile in the grid is its own paged request. Every scan reports exactly how many billable requests it used, so there’s never a surprise after the fact.',
  },
  {
    q: 'Where do the leads actually come from?',
    a: 'Google Places text search, a CSV you already have (Google Maps exports work), or manual paste. Nothing is scraped from a source that would put your account at risk.',
  },
  {
    q: 'Is my data shared between workspaces?',
    a: 'No. Leads, credits, and outreach history are isolated per workspace — a team plan does not mean a shared pool with anyone else on it.',
  },
  {
    q: 'Can I export what I find?',
    a: 'CSV and JSON, with every field: contact info, score, findings, and generated messages. No plan strips the export.',
  },
  {
    q: 'What happens at the free 200-lead limit?',
    a: 'Everything you’ve found stays usable — filtering, messaging, export. New leads stop importing until you upgrade or clear space.',
  },
]

function Nav() {
  const [theme, toggleTheme] = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#how-it-works', label: 'How it works' },
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-md border-b border-gray-200/80'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-button">
            <Zap className="w-4.5 h-4.5 text-white" aria-hidden="true" />
          </div>
          <span className={`text-lg font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            LeadForge
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Section">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          <a
            href={LOGIN_URL}
            className={`text-sm font-medium ${scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}
          >
            Log in
          </a>
          <a href={REGISTER_URL} className="btn-primary text-sm">
            Start free
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-gray-200 px-5 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 py-1"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-gray-600">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <div className="flex items-center gap-4">
              <a href={LOGIN_URL} className="text-sm font-medium text-gray-600">Log in</a>
              <a href={REGISTER_URL} className="btn-primary text-sm">Start free</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

/* A screenshot-of-the-product mock, not a stock image. Fixed light colours
   rather than the theme ramp: this card is meant to read as "a picture of
   the app", which stays the same regardless of what theme the visitor is
   browsing this marketing page in. */
const MOCK_LEADS = [
  { name: 'Riverside Dental', city: 'Austin, TX', score: 92, tag: 'high', finding: 'No mobile viewport' },
  { name: 'Copper Kettle Café', city: 'Leeds, UK', score: 74, tag: 'high', finding: 'No HTTPS' },
  { name: 'Alvarez Auto Repair', city: 'Fresno, CA', score: 51, tag: 'medium', finding: 'Site is 12 years old' },
]

function HeroVisual() {
  return (
    <div className="relative mt-14 sm:mt-20 max-w-3xl mx-auto px-2">
      <div
        className="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"
        style={{ transform: 'perspective(1400px) rotateX(4deg)' }}
      >
        <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="ml-3 text-xs text-slate-400 font-medium">leadforge.app/leads</span>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_LEADS.map((lead) => (
            <div key={lead.name} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{lead.city}</p>
              </div>
              <span className="hidden sm:inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                {lead.finding}
              </span>
              <span className={`shrink-0 badge-${lead.tag}`}>{lead.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:block absolute -bottom-8 -left-6 w-64 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 p-3.5 rotate-[-3deg]">
        <div className="flex items-center gap-1.5 mb-2">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-slate-500">WhatsApp draft</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          Hi Riverside Dental — I had a look at your site on my phone and it
          isn’t mobile-friendly. Fixed a few of these for other clinics near you...
        </p>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main>
        {/* ---- Hero --------------------------------------------------- */}
        <section className="relative overflow-hidden bg-[#080c1a] bg-gradient-to-br from-[#0b1122] via-[#111a35] to-[#0a0f1e] pt-36 pb-24 sm:pt-44 sm:pb-32">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-[#4a5ae8]/25 blur-[100px]" />
            <div className="absolute bottom-[-6rem] right-[-4rem] w-[32rem] h-[32rem] rounded-full bg-[#7c3aed]/20 blur-[110px]" />
            <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-[#0ea5e9]/10 blur-[90px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
            <h1
              className="font-bold tracking-tight leading-[1.05] bg-gradient-to-br from-white via-white to-[#a5bcfc] bg-clip-text text-transparent"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              Stop hunting for clients who never needed you.
            </h1>
            <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
              LeadForge finds local businesses whose websites are broken, dated or
              missing entirely, proves what’s wrong with a real audit and a mobile
              screenshot, then writes the first message for you.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={REGISTER_URL} className="btn-primary px-6 py-3 text-base w-full sm:w-auto">
                Start free — 200 leads
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white/90 border border-white/20 hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-white/50">No card required.</p>
          </div>

          <HeroVisual />
        </section>

        {/* ---- The problem --------------------------------------------- */}
        <section className="py-24 sm:py-32">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Most lead lists go stale before you finish dialling them
              </h2>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                A spreadsheet of businesses doesn’t tell you who actually needs
                you, and a cold message that says nothing specific gets ignored on
                sight. On a real account, <strong className="text-gray-700 font-semibold">167 of 255</strong>{' '}
                businesses found already had a decent website — a website-only score
                writes all of them off. That’s why LeadForge also scores their
                Google listing, so the ones with a fine site still have an opening.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---- How it works ---------------------------------------------- */}
        <section id="how-it-works" className="py-24 sm:py-32 bg-surface border-y border-gray-200/80">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Find. Audit. Pitch.</h2>
              <p className="mt-4 text-gray-500 text-lg">Three steps, and the third one is already written for you.</p>
            </Reveal>

            <div className="relative mt-16 grid sm:grid-cols-3 gap-10 sm:gap-8">
              <div aria-hidden="true" className="hidden sm:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />
              {HOW_IT_WORKS.map(({ icon: Icon, step, title, promise, detail }, i) => (
                <Reveal key={step} delay={i * 80} className="relative text-center sm:text-left">
                  <div className="relative inline-flex w-16 h-16 rounded-2xl bg-primary-50 items-center justify-center ring-1 ring-primary-100">
                    <Icon className="w-7 h-7 text-primary-600" aria-hidden="true" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-[11px] font-bold flex items-center justify-center ring-4 ring-surface">
                      {step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-gray-900">{title}</h3>
                  <p className="mt-2 text-gray-700 font-medium leading-snug">{promise}</p>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Feature grid ------------------------------------------- */}
        <section id="features" className="py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything between finding and closing</h2>
              <p className="mt-4 text-gray-500 text-lg">No step of the pipeline is left as manual busywork.</p>
            </Reveal>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 [grid-auto-flow:dense]">
              {FEATURES.map(({ icon: Icon, title, body, wide }, i) => (
                <Reveal key={title} delay={(i % 3) * 70} className={wide ? 'lg:col-span-2' : ''}>
                  <div className="card card-hover h-full hover:ring-1 hover:ring-primary-500/20">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- The score, explained ------------------------------------ */}
        <section className="py-24 sm:py-32 bg-surface border-y border-gray-200/80">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">The score isn’t a black box</h2>
              <p className="mt-5 text-gray-500 leading-relaxed">
                Every lead is scored 0–100 on how badly it needs a website — not
                on how complete its contact card is. A business with no site at
                all outscores one with a modern one, because that’s the one
                worth pitching.
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed">
                A lead with neither phone nor email is scaled to 55%, since it
                can’t be reached no matter how badly it needs a site.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="badge-high">70+ High</span>
                <span className="badge-medium">45+ Medium</span>
                <span className="badge-low">Below 45 Low</span>
              </div>
            </Reveal>

            <Reveal delay={100} className="card space-y-6">
              {SCORE_COMPONENTS.map((c) => (
                <div key={c.label}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="font-semibold text-gray-900 text-sm">{c.label}</span>
                    <span className="text-xs text-gray-400">{c.range}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: c.width }} />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">{c.detail}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---- Evidence-driven outreach --------------------------------- */}
        <section className="py-24 sm:py-32">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
            <Reveal className="order-2 lg:order-1 flex justify-center">
              <div className="w-56 rounded-[2rem] border-[6px] border-slate-800 bg-slate-800 shadow-xl overflow-hidden">
                <div className="bg-white h-96 overflow-hidden relative">
                  <div className="h-20 bg-slate-700 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">ALVAREZ AUTO</span>
                  </div>
                  <div className="p-2 space-y-2">
                    <div className="h-24 bg-slate-200 w-full" />
                    <div className="h-3 bg-slate-200 w-5/6" />
                    <div className="h-3 bg-slate-200 w-full" />
                    <div className="h-3 bg-slate-200 w-2/3" />
                    <div className="flex gap-1 mt-2">
                      <div className="h-16 w-1/3 bg-slate-100 border border-slate-200" />
                      <div className="h-16 w-1/3 bg-slate-100 border border-slate-200" />
                      <div className="h-16 w-1/3 bg-slate-100 border border-slate-200" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 inset-x-2 text-center text-[10px] text-slate-400">
                    no viewport tag — desktop layout squeezed onto a phone
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80} className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">The message names the actual problem</h2>
              <p className="mt-5 text-gray-500 leading-relaxed">
                Outreach opens with the specific fault the audit found, not a
                generic pitch. Sixteen hooks, chosen by the heaviest finding,
                written in second person for WhatsApp and third for email.
              </p>
              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 max-w-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span className="text-xs font-semibold text-emerald-700">WhatsApp</span>
                </div>
                <p className="text-sm text-emerald-900 leading-snug">
                  Hi Alvarez Auto — I had a look at your website on my phone and
                  it isn’t mobile-friendly. I fix exactly this for shops like
                  yours — want to see what it’d look like fixed?
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                A site with nothing wrong gets no invented complaint.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---- Proposal --------------------------------------------------- */}
        <section className="py-24 sm:py-32 bg-surface border-y border-gray-200/80">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">A priced proposal, not just a lead</h2>
              <p className="mt-4 text-gray-500 text-lg">
                One click turns an audit into a shareable, priced pitch —
                public link, no login required for the person reading it.
              </p>
            </Reveal>

            <Reveal delay={100} className="card p-0 overflow-hidden max-w-lg mx-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900">Website Rebuild Proposal</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" aria-hidden="true" /> Viewed 2h ago
                </span>
              </div>
              <div className="px-6 py-5 space-y-3">
                {['No HTTPS → SSL setup', 'No mobile viewport → mobile rebuild', 'No Google photos → listing service'].map((row) => (
                  <div key={row} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                    {row}
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">leadforge.app/p/8f2a1c</span>
                <span className="text-lg font-bold text-gray-900">$650</span>
              </div>
            </Reveal>
            <p className="text-center mt-5 text-sm text-gray-400">Every price is a starting point — all of it is editable.</p>
          </div>
        </section>

        {/* ---- Pricing ------------------------------------------------ */}
        <section id="pricing" className="py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Simple pricing, upgrade when you outgrow free</h2>
              <p className="mt-4 text-gray-500 text-lg">Payment runs through Razorpay or a UPI QR — only the method actually configured on your account is ever shown.</p>
            </Reveal>

            <div className="mt-14 grid md:grid-cols-3 gap-6 items-start">
              {PLANS.map(({ id, name, price, icon: Icon, popular, description, features, cta }, i) => (
                <Reveal key={id} delay={i * 80}>
                  <div className={`relative card h-full flex flex-col ${popular ? 'ring-2 ring-primary-500 shadow-lift' : ''}`}>
                    {popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-button">
                        Most popular
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                    <div className="mt-4">
                      {price === 0 ? (
                        <span className="text-3xl font-bold text-gray-900">Free</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-gray-900">${price}</span>
                          <span className="text-gray-500 text-sm">/month</span>
                        </>
                      )}
                    </div>
                    <ul className="mt-5 space-y-2.5 flex-1">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={REGISTER_URL}
                      className={`mt-6 text-center ${popular ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {cta}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- FAQ ------------------------------------------------------- */}
        <section id="faq" className="py-24 sm:py-32 bg-surface border-y border-gray-200/80">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <Reveal className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Questions</h2>
            </Reveal>
            <div className="space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <Reveal key={q} delay={i * 40}>
                  <details className="group card cursor-pointer [&::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between font-medium text-gray-900 list-none">
                      {q}
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Final CTA -------------------------------------------------- */}
        <section className="relative overflow-hidden bg-[#080c1a] bg-gradient-to-br from-[#0b1122] via-[#111a35] to-[#0a0f1e] py-24 sm:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/3 w-[28rem] h-[28rem] rounded-full bg-[#4a5ae8]/20 blur-[100px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <Reveal className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Find the businesses that actually need you</h2>
            <p className="mt-4 text-white/70">200 leads, free, no card required.</p>
            <a href={REGISTER_URL} className="btn-primary mt-8 px-6 py-3 text-base">
              Start free
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <p className="mt-6 text-xs text-white/40">Built for freelancers and small agencies.</p>
          </Reveal>
        </section>
      </main>

      <footer className="py-14 border-t border-gray-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-gray-900">LeadForge</span>
            <span className="text-sm text-gray-400 hidden sm:inline">— find clients who actually need you</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-500" aria-label="Footer">
            <a href="#features" className="hover:text-gray-900">Product</a>
            <a href="#pricing" className="hover:text-gray-900">Pricing</a>
            <a href={LOGIN_URL} className="hover:text-gray-900">Log in</a>
            <a href={REGISTER_URL} className="hover:text-gray-900">Register</a>
          </nav>
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} LeadForge</p>
        </div>
      </footer>
    </div>
  )
}

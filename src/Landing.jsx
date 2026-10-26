import { useEffect, useRef, useState } from 'react'
import {
  Zap, Sun, Moon, Menu, X, Search, ShieldCheck, Send, MapPin, Smartphone,
  Mail, Languages, Star, Filter, TrendingUp, Check, Plus, ArrowRight,
  FileText, MessageCircle, Clock, Gift, Building2, KeyRound, Lock, Download,
  FlaskConical, Github, ListX, Globe2, MessageSquareDashed, Layers,
} from 'lucide-react'
import { useTheme } from './useTheme'

/* This page is standalone — the actual app lives in a separate repo/deploy,
   so every CTA needs a real URL rather than a client-side route. Defaults to
   the live app so the site is correct even if a deploy target never sets
   VITE_APP_URL; set that env var (see .env.example) to override it, e.g. for
   a staging build that should point somewhere else. */
const APP_URL = import.meta.env.VITE_APP_URL || 'https://leadforge-9r0v.onrender.com'
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

/* Every section opened with the same shape - centred h2, grey sentence under
   it - which made nine distinct sections read as one undifferentiated scroll.
   The eyebrow gives each one an identity at a glance and gives the eye a
   third size to step down from, so the hierarchy is heading-sized rather
   than just "big text, small text". */
function SectionHeading({ eyebrow, title, children, align = 'left' }) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}>
      <p className="eyebrow">{eyebrow}</p>
      {/* Weight 300 at display size: the hierarchy comes from scale, not from
          bolding, which is what keeps a page this large feeling calm. */}
      <h2 className="mt-4 text-4xl sm:text-5xl lg:text-[3.5rem] font-light leading-[1.05] tracking-[-0.02em] text-gray-900">
        {title}
      </h2>
      {children && <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed">{children}</p>}
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

/* The freelancer's actual day, broken into the three things that waste it.
   This used to be one paragraph; three named problems are easier to
   recognise yourself in than a block of prose. */
const PROBLEMS = [
  {
    icon: ListX,
    title: 'The list is already cold',
    body: 'A scraped spreadsheet tells you a business exists. It doesn’t tell you whether they need you, or whether forty other freelancers mailed them first.',
  },
  {
    icon: Globe2,
    title: 'Most of them are already fine',
    body: 'On a real account, 167 of 255 businesses found already had a decent website. Score on the site alone and you write off two thirds of your list.',
  },
  {
    icon: MessageSquareDashed,
    title: 'The message says nothing',
    body: '“I build websites for small businesses” is what everyone opens with, so it’s what everyone ignores. Nothing in it proves you looked.',
  },
]

/* Trust, done with facts a visitor can check rather than logos and invented
   testimonials: what it costs to run, who holds the data, and how to leave. */
const TRUST = [
  {
    icon: KeyRound,
    title: 'Your Google key, your spend',
    body: 'Places search runs on your own API key, billed to you at Google’s rates. Every scan reports the requests it used, so the bill is never a surprise.',
  },
  {
    icon: Lock,
    title: 'Workspace-isolated data',
    body: 'Leads, credits and outreach history are scoped to your workspace. A team plan is not a shared pool with strangers in it.',
  },
  {
    icon: Download,
    title: 'No lock-in',
    body: 'Export every field — contacts, scores, findings, generated messages — to CSV or JSON on any plan, including the free one.',
  },
  {
    icon: FlaskConical,
    title: 'Tested, not hand-waved',
    body: '100 tests cover scoring, the website audit, workspace isolation, credit accounting, proposals and rate limiting.',
  },
]

/* Real findings from the audit, with the weight each carries into the score -
   the wide feature card renders these rather than describing them. */
const AUDIT_FINDINGS = [
  { label: 'No mobile viewport', weight: 'Critical' },
  { label: 'No HTTPS', weight: 'Critical' },
  { label: 'Dead domain / 5xx', weight: 'Critical' },
  { label: 'Pre-2010 markup, jQuery 1.x', weight: 'Major' },
  { label: 'Copyright year never moved', weight: 'Minor' },
  { label: 'Missing title, meta, OG tags', weight: 'Minor' },
]

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Scored by need, not by completeness',
    body: 'A business with no website outscores one with a full contact card.',
    wide: true,
    visual: 'score',
  },
  {
    icon: ShieldCheck,
    title: 'A real website audit',
    body: 'Every finding is stored on the lead, weighted into the score, and named in the outreach.',
    wide: true,
    visual: 'audit',
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
  {
    icon: Clock,
    title: 'Long jobs run in the background',
    body: 'Auditing or screenshotting hundreds of sites is queued, not blocking. Alerts tell you when a run lands.',
  },
  {
    icon: Layers,
    title: 'Ten niches, or your own',
    body: 'Clinic, gym, real estate and seven more, each with its own outreach angle — or define the niche yourself.',
  },
]

const SCORE_COMPONENTS = [
  { label: 'Need', range: '0–60 pts', width: '85%', color: 'bg-primary-600', detail: 'No website 60 · broken 55 · social-page-only 50 · outdated up to 45 · modern 0–15' },
  { label: 'Reach', range: '0–25 pts', width: '55%', color: 'bg-[#0ea5e9]', detail: 'Phone +12 · email +8 · address +5' },
  { label: 'Viability', range: '0–15 pts', width: '40%', color: 'bg-[#7c3aed]', detail: 'Rating 4.5+ +12 · 4.0+ +10 · 3.0+ +6 · category +3' },
]

const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    priceDisplay: 'Free',
    usdDisplay: '$0',
    icon: Gift,
    description: 'Get started for free. Includes 7-Day Pro trial on signup.',
    features: [
      '100 leads saved',
      '10 daily WhatsApp outreach queue',
      '3 client proposals lifetime',
      'Full website technical audit',
      'Need-based opportunity scoring (0–100)',
      'CSV & Excel lead import & export',
    ],
    cta: 'Start free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1690,
    priceDisplay: '₹1,690',
    usdDisplay: '~$20',
    icon: Zap,
    popular: true,
    description: 'For freelancers hunting and closing clients daily.',
    features: [
      '2,000 leads saved',
      '1,000 AI credits every month',
      '50 daily WhatsApp outreach queue',
      '100 automated emails a day (from your Gmail)',
      'Unlimited branded proposals (your domain)',
      '3 team seats included',
      'Day 3 & Day 7 follow-up pipeline tracker',
    ],
    cta: 'Get Pro',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 4290,
    priceDisplay: '₹4,290',
    usdDisplay: '~$52',
    icon: Building2,
    description: 'For digital agencies and multi-person sales teams.',
    features: [
      'Unlimited leads saved',
      '5,000 AI credits every month',
      '80 daily WhatsApp outreach queue',
      '100 automated emails a day (from your Gmail)',
      'Unlimited branded proposals',
      '15 team seats included',
      'Shared agency pipeline & team roles',
    ],
    cta: 'Get Agency',
  },
]

const FAQS = [
  {
    q: 'Do I need a Google API key?',
    a: 'For live Google Places search, yes — you can paste your own free key (Google gives every account 1,000 free searches a month). But you can also upload any CSV or Excel file of leads and use the entire audit, scoring, AI messaging, and proposal pipeline with zero keys required.',
  },
  {
    q: 'What is included in the 7-day Pro trial?',
    a: 'Every new account starts with 7 days of Pro access and 50 free AI message credits. You can store up to 2,000 leads, run unlimited website audits, write AI pitches, and send proposals completely free with no credit card required.',
  },
  {
    q: 'How does outreach work?',
    a: '1-click WhatsApp opens your own WhatsApp Web or mobile app with the prospect’s number and personalized pitch pre-filled. 1-click Email opens Gmail with subject and tailored copy ready. Pro and Agency plans also support automated bulk email sending up to 100/day.',
  },
  {
    q: 'What is the ROI for a freelancer on the Pro plan?',
    a: 'LeadForge Pro is ₹1,690/month (~$20/mo). A standard 5-page freelance website in India sells for ₹17,500 – ₹25,000. Closing just one single web design client covers your entire LeadForge subscription for the whole year.',
  },
  {
    q: 'Can I export my leads and data?',
    a: 'Yes, full CSV and JSON export with every field: contact info, score, website audit issues, and AI generated pitches.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept instant UPI QR transfer (Google Pay, PhonePe, Paytm, BHIM) and Cards/Netbanking via Razorpay.',
  },
]

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

function Logo({ className = '' }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className="grid h-8 w-8 place-items-center border border-current">
        <Zap className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="text-[15px] font-semibold uppercase tracking-[0.18em]">LeadForge</span>
    </span>
  )
}

/* A solid black bar rather than a transparent one that turns white on
   scroll: the sections under it alternate between black media and white
   copy, and a bar that changed colour at every boundary would flicker all
   the way down the page. Black holds still over both. */
function Nav() {
  const [theme, toggleTheme] = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  /* Which anchored section the reader is actually in. The rootMargin pins
     the decision line near the top of the viewport rather than the middle:
     a section counts as "current" once its heading is up under the nav,
     which is where a reader thinks they are. */
  useEffect(() => {
    const sections = NAV_LINKS
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter(Boolean)
    if (!sections.length) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-88px 0px -70% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black text-white">
      <div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between gap-6 px-5 sm:px-10">
        <a href="#top" aria-label="LeadForge home" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Section">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative py-1 text-[15px] transition-colors ${
                  isActive ? 'text-white' : 'text-white/65 hover:text-white'
                }`}
              >
                {l.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-white transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            )
          })}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1 text-white/65 transition-colors hover:text-white"
            aria-label={themeLabel}
          >
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.5} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.5} />}
          </button>
          <a href={LOGIN_URL} className="text-[15px] text-white/65 transition-colors hover:text-white">
            Log in
          </a>
          <a href={REGISTER_URL} className="pill pill-on-dark px-6 py-3 text-sm">
            Start free
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 text-white md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-5 pb-6 md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-white/10 py-4 text-xl font-light text-white/85"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-6 flex items-center justify-between gap-4">
            <button type="button" onClick={toggleTheme} className="flex items-center gap-2 text-sm text-white/65">
              {theme === 'dark' ? <Sun className="h-4 w-4" strokeWidth={1.5} /> : <Moon className="h-4 w-4" strokeWidth={1.5} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <div className="flex items-center gap-4">
              <a href={LOGIN_URL} onClick={() => setMenuOpen(false)} className="text-sm text-white/65">Log in</a>
              <a href={REGISTER_URL} onClick={() => setMenuOpen(false)} className="pill pill-solid-on-dark px-5 py-3 text-sm">Start free</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

/* The proposal card asserted "every price is editable" underneath a fixed
   $650. Letting the reader switch line items on and off and watch the total
   move demonstrates the same sentence instead of claiming it - and the
   mapping shown (a finding becomes a priced service) is the one the product
   actually makes. */
const PROPOSAL_ITEMS = [
  { id: 'ssl', finding: 'No HTTPS', service: 'SSL setup & redirects', price: 150 },
  { id: 'mobile', finding: 'No mobile viewport', service: 'Mobile rebuild', price: 400 },
  { id: 'photos', finding: 'No Google photos', service: 'Listing photo service', price: 100 },
  { id: 'speed', finding: 'Slow first load', service: 'Performance pass', price: 200 },
]

function ProposalBuilder() {
  const [on, setOn] = useState(['ssl', 'mobile', 'photos'])
  const toggle = (id) =>
    setOn((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  const total = PROPOSAL_ITEMS.filter((i) => on.includes(i.id)).reduce((sum, i) => sum + i.price, 0)

  return (
    <div className="border border-gray-200 bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-5 sm:px-10">
        <span className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-900" strokeWidth={1.25} aria-hidden="true" />
          <span className="text-lg font-light text-gray-900">Website rebuild proposal</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" /> Viewed 2h ago
        </span>
      </div>

      <div className="px-6 py-4 sm:px-10">
        {PROPOSAL_ITEMS.map((item) => {
          const included = on.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={included}
              className="group flex w-full items-center gap-4 border-b border-gray-100 py-4 text-left last:border-b-0"
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center border transition-colors ${
                  included ? 'border-gray-900 bg-gray-900' : 'border-gray-300 group-hover:border-gray-900'
                }`}
              >
                {included && <Check className="h-3.5 w-3.5 text-surface" strokeWidth={2} aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1 text-[15px]">
                <span className="text-gray-500">{item.finding}</span>
                <span className="mx-2 text-gray-300">→</span>
                <span className={included ? 'text-gray-900' : 'text-gray-400'}>{item.service}</span>
              </span>
              <span
                className={`shrink-0 text-[15px] tabular-nums ${
                  included ? 'text-gray-900' : 'text-gray-300 line-through'
                }`}
              >
                ${item.price}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-end justify-between gap-4 border-t border-gray-200 px-6 py-6 sm:px-10">
        <span className="text-xs text-gray-500">leadforge.app/p/8f2a1c</span>
        <span className="text-5xl font-light tracking-[-0.03em] text-gray-900 tabular-nums">${total}</span>
      </div>
    </div>
  )
}

/* The weights below are the product's own, not illustrative numbers: the
   section asks for the formula to be trusted, so it hands the formula over
   and lets someone drive it. */
const WEBSITE_STATES = [
  { id: 'none', label: 'No website', need: 60 },
  { id: 'broken', label: 'Broken', need: 55 },
  { id: 'social', label: 'Social page only', need: 50 },
  { id: 'outdated', label: 'Outdated', need: 45 },
  { id: 'modern', label: 'Modern', need: 12 },
]

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${
        selected
          ? 'border-gray-900 bg-gray-900 text-surface'
          : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  )
}

function ScoreCalculator() {
  const [site, setSite] = useState('none')
  const [phone, setPhone] = useState(true)
  const [email, setEmail] = useState(false)
  const [address, setAddress] = useState(true)
  const [rating, setRating] = useState(4.5)

  const need = WEBSITE_STATES.find((s) => s.id === site).need
  const reach = (phone ? 12 : 0) + (email ? 8 : 0) + (address ? 5 : 0)
  const viability = (rating >= 4.5 ? 12 : rating >= 4.0 ? 10 : rating >= 3.0 ? 6 : 0) + 3

  // The real rule: a lead nobody can contact is scaled back, however badly
  // it needs a site, because it cannot be pitched.
  const unreachable = !phone && !email
  const raw = need + reach + viability
  const total = Math.round(unreachable ? raw * 0.55 : raw)
  const tag = total >= 70 ? 'high' : total >= 45 ? 'medium' : 'low'
  const tagLabel = total >= 70 ? 'High' : total >= 45 ? 'Medium' : 'Low'

  const parts = [
    { label: 'Need', value: need, max: 60 },
    { label: 'Reach', value: reach, max: 25 },
    { label: 'Viability', value: viability, max: 15 },
  ]

  const toggles = [
    { label: 'Phone', on: phone, set: setPhone, pts: '+12' },
    { label: 'Email', on: email, set: setEmail, pts: '+8' },
    { label: 'Address', on: address, set: setAddress, pts: '+5' },
  ]

  return (
    <div className="border border-gray-200 bg-surface p-6 sm:p-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="eyebrow">Try it</p>
          <p className="mt-2 text-gray-600">Change the business, watch the score.</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-7xl font-light leading-none tracking-[-0.04em] text-gray-900 tabular-nums">{total}</div>
          <span className={`mt-3 inline-flex badge-${tag}`}>{tagLabel}</span>
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-3 text-sm text-gray-600">Their website</p>
        <div className="flex flex-wrap gap-2">
          {WEBSITE_STATES.map((s) => (
            <OptionButton key={s.id} selected={site === s.id} onClick={() => setSite(s.id)}>
              {s.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm text-gray-600">You can reach them by</p>
        <div className="flex flex-wrap gap-2">
          {toggles.map((t) => (
            <OptionButton key={t.label} selected={t.on} onClick={() => t.set((v) => !v)}>
              {t.on && <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
              {t.label}
              <span className="text-xs opacity-60">{t.pts}</span>
            </OptionButton>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="lf-rating" className="flex items-baseline justify-between text-sm text-gray-600">
          Google rating
          <span className="text-gray-900 tabular-nums">{rating.toFixed(1)}</span>
        </label>
        <input
          id="lf-rating"
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-3 w-full accent-gray-900"
        />
      </div>

      <div className="mt-10 space-y-5 border-t border-gray-200 pt-8">
        {parts.map((p) => (
          <div key={p.label}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[15px] text-gray-900">{p.label}</span>
              <span className="text-sm text-gray-500 tabular-nums">
                {p.value} / {p.max}
              </span>
            </div>
            <div className="h-1 overflow-hidden bg-gray-200">
              <div
                className="h-full bg-gray-900 transition-[width] duration-500"
                style={{ width: `${(p.value / p.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {unreachable && (
        <p className="mt-8 border-l border-gray-900 pl-4 text-sm text-gray-700">
          No phone and no email — scaled to 55%, because it can’t be pitched.
        </p>
      )}
    </div>
  )
}

/* Each step card is cropped from the real, redacted screenshots rather than
   from stock photography. The crops are chosen to stay clear of the
   pixelated contact column and account email, so no card is built around
   a block of redaction. */
const STEP_MEDIA = [
  { src: '/screenshots/leads.png', position: 'object-[22%_50%]' },
  { src: '/screenshots/dashboard.png', position: 'object-[30%_50%]' },
  { src: '/screenshots/app_pricing_upgrade.png', position: 'object-[50%_50%]' },
]

/* One dot per position the track can actually scroll to, not one per card.
   Where two cards are visible at once, the last card can never reach the
   left edge - the track runs out of scroll first - so a dot for it would
   land on the same spot as the dot before it and light the wrong one.
   The count is re-measured on resize, since it is 3 on a phone and 2 on a
   wide screen. */
function measureTrack(el) {
  const first = el && el.firstElementChild
  if (!first) return null
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0
  const step = first.getBoundingClientRect().width + gap
  const max = Math.max(0, el.scrollWidth - el.clientWidth)
  const pages = Math.max(1, Math.min(HOW_IT_WORKS.length, Math.round(max / step) + 1))
  return { step, max, pages }
}

function StepCarousel() {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [pages, setPages] = useState(HOW_IT_WORKS.length)

  const onScroll = () => {
    const el = trackRef.current
    const m = measureTrack(el)
    if (!m) return
    // At the end of the track means the last position, whatever the
    // division says - the final step is usually shorter than a full card.
    const i = el.scrollLeft >= m.max - 2 ? m.pages - 1 : Math.round(el.scrollLeft / m.step)
    setIndex(Math.max(0, Math.min(m.pages - 1, i)))
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined
    const update = () => {
      const m = measureTrack(el)
      if (!m) return
      setPages(m.pages)
      onScroll()
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const goTo = (i) => {
    const el = trackRef.current
    const m = measureTrack(el)
    if (!m) return
    el.scrollTo({ left: i >= m.pages - 1 ? m.max : i * m.step, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        aria-roledescription="carousel"
        aria-label="How LeadForge works"
        className="no-scrollbar -mr-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pr-5 sm:-mr-10 sm:pr-10"
      >
        {HOW_IT_WORKS.map((s, i) => (
          <article
            key={s.step}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${HOW_IT_WORKS.length}: ${s.title}`}
            className="media-zoom relative aspect-[4/5] w-[85%] shrink-0 snap-start overflow-hidden bg-neutral-900 text-white sm:w-[62%] xl:w-[48%]"
          >
            <img
              src={STEP_MEDIA[i].src}
              alt=""
              aria-hidden="true"
              width="1917"
              height="970"
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover opacity-60 ${STEP_MEDIA[i].position}`}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-xs text-white/60 tabular-nums">{s.step}</p>
              <h3 className="mt-2 text-4xl font-light uppercase tracking-[-0.01em] text-white sm:text-[2.75rem]">
                {s.title}
              </h3>
              <p className="mt-4 max-w-sm text-base text-white">{s.promise}</p>
              <p className="mt-2 hidden max-w-sm text-sm leading-relaxed text-white/65 sm:block">{s.detail}</p>
            </div>
          </article>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex justify-center gap-2.5">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to position ${i + 1} of ${pages}`}
              aria-current={index === i ? 'true' : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === i ? 'w-6 bg-gray-900' : 'w-2 bg-gray-300 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const CONTAINER = 'mx-auto max-w-[88rem] px-5 sm:px-10'

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-24 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>
      <Nav />

      <main id="main">
        {/* ---- Hero ---------------------------------------------------
            A full viewport of black with one very large, very light line
            of type over it. The product's own dashboard sits behind as the
            media - dimmed and softened until it is texture, since this is
            the one place on the page where the words should win. */}
        <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-black text-white">
          <img
            src="/screenshots/dashboard.png"
            alt=""
            aria-hidden="true"
            width="1917"
            height="970"
            className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover object-top opacity-30 blur-[3px]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/85 via-black/60 to-black" />

          <div className="flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-36 text-center sm:px-10">
            <p className="eyebrow text-white/80">Client finding for freelancers</p>
            <h1
              className="mt-7 max-w-5xl font-light leading-[1.02] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2.75rem, 7vw, 6.25rem)' }}
            >
              Stop hunting for clients who never needed you.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              LeadForge finds local businesses whose websites are broken, dated or
              missing, proves what’s wrong, and writes the first message for you.
            </p>
            <div className="mt-11 flex flex-col items-center gap-3 sm:flex-row">
              <a href={REGISTER_URL} className="pill pill-solid-on-dark">
                Start free — 7-day Pro trial
              </a>
              <a href="#product" className="pill pill-on-dark">
                See the product
              </a>
            </div>
            <p className="mt-5 text-sm text-white/45">No card required.</p>
          </div>

          <a
            href="#product"
            className="mx-auto mb-8 flex flex-col items-center gap-2.5 text-white/55 transition-colors hover:text-white"
          >
            <span className="relative block h-9 w-[22px] rounded-full border border-current">
              <span className="scroll-cue absolute left-[calc(50%-2px)] top-2 block h-1.5 w-1 rounded-full bg-current" />
            </span>
            <span className="text-xs">Scroll down</span>
          </a>
        </section>

        {/* ---- The product, full width ------------------------------------ */}
        <section id="product" className="scroll-mt-20 bg-black pb-24 pt-10 text-white sm:pb-32">
          <div className={CONTAINER}>
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="eyebrow text-white/80">The product</p>
              <h2 className="mt-4 text-4xl font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
                Every lead, scored by how badly it needs you
              </h2>
            </Reveal>
            <Reveal delay={100} className="mt-14 sm:mt-20">
              <figure>
                <div className="media-zoom overflow-hidden ring-1 ring-white/10">
                  <img
                    src="/screenshots/leads.png"
                    width="1917"
                    height="970"
                    alt="The LeadForge leads table: businesses with a quality tag, a score out of 100 and an outreach status, above filters for quality, niche, outreach status and site condition."
                    className="block w-full"
                  />
                </div>
                <figcaption className="mt-5 flex flex-col justify-between gap-2 text-sm text-white/50 sm:flex-row">
                  <span>The leads table, from a live account.</span>
                  <span>Contact details redacted.</span>
                </figcaption>
              </figure>
            </Reveal>
            <div className="mt-14 flex justify-center">
              <a href={REGISTER_URL} className="pill pill-on-dark">
                Start free
              </a>
            </div>
          </div>
        </section>

        {/* ---- How it works: copy left, carousel bleeding right ----------- */}
        <section id="how-it-works" className="scroll-mt-20 overflow-hidden bg-surface py-24 sm:py-32">
          <div className={`${CONTAINER} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
            <Reveal className="lg:col-span-4">
              <SectionHeading eyebrow="How it works" title="Find. Audit. Pitch.">
                Three steps, and the third one is already written for you. Every
                business is found, checked and scored before you ever see its name.
              </SectionHeading>
              <a href="#pricing" className="pill pill-outline mt-10">
                See pricing
              </a>
            </Reveal>
            <Reveal delay={100} className="min-w-0 lg:col-span-8">
              <StepCarousel />
            </Reveal>
          </div>
        </section>

        {/* ---- The problem ----------------------------------------------- */}
        <section className="bg-gray-50 py-24 sm:py-32">
          <div className={CONTAINER}>
            <Reveal>
              <SectionHeading eyebrow="The problem" title="Most lead lists go stale before you finish dialling them" />
            </Reveal>
            <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
              {PROBLEMS.map(({ title, body }, i) => (
                <Reveal key={title} delay={i * 80} className="border-t border-gray-900 pt-6">
                  <p className="text-5xl font-light text-gray-900 tabular-nums">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-8 text-2xl font-light text-gray-900">{title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{body}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <p className="mt-20 max-w-3xl text-2xl font-light leading-snug text-gray-900 sm:text-3xl">
                So LeadForge scores the Google listing too — missing photos, no opening
                hours, thin reviews — and the ones with a perfectly good website still
                have an opening worth calling about.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---- Features: a hairline grid ---------------------------------
            Cells share one-pixel rules instead of floating as separate cards
            with shadows, so twelve features read as one considered sheet. */}
        <section id="features" className="scroll-mt-20 bg-surface py-24 sm:py-32">
          <div className={CONTAINER}>
            <Reveal className="grid items-end gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <SectionHeading eyebrow="Features" title="Everything between finding and closing" />
              </div>
              <p className="leading-relaxed text-gray-600 lg:col-span-5">
                No step of the pipeline is left as manual busywork — from sweeping a
                city for businesses to exporting what you found.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-px border border-gray-200 bg-gray-200 [grid-auto-flow:dense] sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, body, wide, visual }, i) => (
                <Reveal
                  key={title}
                  delay={(i % 3) * 70}
                  className={`group bg-surface p-8 transition-colors duration-300 hover:bg-gray-50 sm:p-10 ${wide ? 'lg:col-span-2' : ''}`}
                >
                  <Icon className="h-6 w-6 text-gray-900" strokeWidth={1.25} aria-hidden="true" />
                  <h3 className="mt-8 text-2xl font-light text-gray-900">{title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{body}</p>

                  {visual === 'score' && (
                    <div className="mt-8 space-y-4">
                      {SCORE_COMPONENTS.map((c) => (
                        <div key={c.label} className="flex items-center gap-4">
                          <span className="w-20 shrink-0 text-sm text-gray-900">{c.label}</span>
                          <span className="h-1 flex-1 overflow-hidden bg-gray-200">
                            <span className="block h-full bg-gray-900" style={{ width: c.width }} />
                          </span>
                          <span className="w-16 shrink-0 text-right text-sm text-gray-500">{c.range}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {visual === 'audit' && (
                    <div className="mt-8 flex flex-wrap gap-2">
                      {AUDIT_FINDINGS.map((f) => (
                        <span
                          key={f.label}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-700"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              f.weight === 'Critical' ? 'bg-gray-900' : f.weight === 'Major' ? 'bg-gray-500' : 'bg-gray-300'
                            }`}
                          />
                          {f.label}
                        </span>
                      ))}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Scoring ------------------------------------------------- */}
        <section className="bg-gray-50 py-24 sm:py-32">
          <div className={`${CONTAINER} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
            <Reveal className="lg:col-span-5">
              <SectionHeading eyebrow="Scoring" title="The score isn’t a black box" />
              <p className="mt-6 leading-relaxed text-gray-600">
                Every lead is scored 0–100 on how badly it needs a website — not on how
                complete its contact card is. A business with no site at all outscores
                one with a modern one, because that’s the one worth pitching.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                A lead with neither phone nor email is scaled to 55%, since it can’t be
                reached no matter how badly it needs a site.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="badge-high">70+ High</span>
                <span className="badge-medium">45+ Medium</span>
                <span className="badge-low">Below 45 Low</span>
              </div>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-7">
              <ScoreCalculator />
            </Reveal>
          </div>
        </section>

        {/* ---- Outreach: copy left, media bleeding right --------------- */}
        <section className="overflow-hidden bg-surface py-24 sm:py-32">
          <div className={`${CONTAINER} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
            <Reveal className="lg:col-span-5">
              <SectionHeading eyebrow="Outreach" title="The message names the actual problem" />
              <p className="mt-6 leading-relaxed text-gray-600">
                Outreach opens with the specific fault the audit found, not a generic
                pitch. Sixteen hooks, chosen by the heaviest finding, written in second
                person for WhatsApp and third for email.
              </p>
              <blockquote className="mt-10 border-l border-gray-900 pl-6">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  WhatsApp draft
                </p>
                <p className="mt-4 text-xl font-light leading-snug text-gray-900 sm:text-2xl">
                  “Hi Alvarez Auto — I had a look at your website on my phone and it
                  isn’t mobile-friendly. Want to see what it’d look like fixed?”
                </p>
              </blockquote>
              <p className="mt-6 text-sm text-gray-500">A site with nothing wrong gets no invented complaint.</p>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-7 lg:-mr-10">
              <div className="media-zoom overflow-hidden bg-gray-100">
                <img
                  src="/screenshots/dashboard.png"
                  width="1917"
                  height="970"
                  loading="lazy"
                  alt="The LeadForge dashboard: total leads, usable leads, a lead-quality breakdown and the outreach pipeline."
                  className="block w-full"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- Proposals: builder left, copy right -------------------- */}
        <section className="bg-gray-50 py-24 sm:py-32">
          <div className={`${CONTAINER} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
            <Reveal className="lg:order-2 lg:col-span-5">
              <SectionHeading eyebrow="Proposals" title="A priced proposal, not just a lead">
                One click turns an audit into a shareable, priced pitch — a public
                link, with no login required for the person reading it.
              </SectionHeading>
              <p className="mt-6 text-sm text-gray-500">Every price is a starting point — all of it is editable.</p>
            </Reveal>
            <Reveal delay={100} className="lg:order-1 lg:col-span-7">
              <ProposalBuilder />
            </Reveal>
          </div>
        </section>

        {/* ---- Trust ---------------------------------------------------
            Facts rather than logos or testimonials: the page has no
            customers it can name, and inventing some is the fastest way to
            lose the trust it is trying to earn. */}
        <section className="bg-surface py-24 sm:py-32">
          <div className={CONTAINER}>
            <Reveal>
              <SectionHeading eyebrow="Before you sign up" title="The boring questions, answered up front">
                What it costs to run, who holds your data, and how you get it back out.
              </SectionHeading>
            </Reveal>
            <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {TRUST.map(({ icon: Icon, title, body }, i) => (
                <Reveal
                  key={title}
                  delay={(i % 4) * 60}
                  className="border-t border-gray-200 pt-8 transition-colors duration-300 hover:border-gray-900"
                >
                  <Icon className="h-6 w-6 text-gray-900" strokeWidth={1.25} aria-hidden="true" />
                  <h3 className="mt-8 text-xl font-light text-gray-900">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Pricing ------------------------------------------------ */}
        <section id="pricing" className="scroll-mt-20 bg-gray-50 py-24 sm:py-32">
          <div className={CONTAINER}>
            <Reveal className="grid items-end gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <SectionHeading eyebrow="Pricing" title="Simple pricing, upgrade when you outgrow free" />
              </div>
              <p className="leading-relaxed text-gray-600 lg:col-span-5">
                Payment runs through Razorpay or a UPI QR — only the method actually
                configured on your account is ever shown.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {PLANS.map(({ id, name, price, priceDisplay, usdDisplay, popular, description, features, cta }, i) => (
                <Reveal key={id} delay={i * 80} className="h-full">
                  <div
                    className={`flex h-full flex-col border bg-surface p-8 transition-colors duration-300 sm:p-10 ${
                      popular ? 'border-gray-900 shadow-sm' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-2xl font-light text-gray-900">{name}</h3>
                      {popular && <span className="eyebrow text-[11px]">Most popular</span>}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{description}</p>
                    <div className="mt-8 flex flex-col">
                      <p className="flex items-baseline gap-1.5">
                        <span className="text-5xl sm:text-6xl font-light tracking-[-0.03em] text-gray-900 tabular-nums">
                          {priceDisplay || (price === 0 ? 'Free' : `₹${price}`)}
                        </span>
                        {price !== 0 && <span className="text-sm text-gray-500">/month</span>}
                      </p>
                      {usdDisplay && price !== 0 && (
                        <p className="mt-1 text-xs text-gray-500 font-medium">{usdDisplay} USD / month for international</p>
                      )}
                    </div>
                    <ul className="mt-8 flex-1 space-y-3 border-t border-gray-200 pt-8">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[15px] text-gray-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" strokeWidth={1.5} aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a href={REGISTER_URL} className={`pill mt-10 w-full ${popular ? 'pill-solid' : 'pill-outline'}`}>
                      {cta}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* In-app pricing & payment proof */}
            <Reveal delay={200} className="mt-16 border border-gray-200 bg-surface p-6 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-5">
                  <span className="eyebrow">Zero Friction Checkout</span>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-light text-gray-900">
                    Instant UPI QR & Card Activations
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    Pay instantly via any UPI app (Google Pay, PhonePe, Paytm) or card. No forced subscriptions or hidden cancellation hurdles. Top-up credits start at ₹490 and never expire while your plan is active.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-600">
                    <span className="bg-gray-100 rounded px-2.5 py-1 font-medium">500 Credits: ₹490</span>
                    <span className="bg-gray-100 rounded px-2.5 py-1 font-medium">2,000 Credits: ₹1,690</span>
                    <span className="bg-gray-100 rounded px-2.5 py-1 font-medium">Web Audits: Free</span>
                  </div>
                </div>
                <div className="lg:col-span-7 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="/screenshots/app_compare_plans.png"
                    alt="LeadForge plans comparison and in-app checkout"
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- FAQ: heading left, ruled list right ----------------------- */}
        <section id="faq" className="scroll-mt-20 bg-surface py-24 sm:py-32">
          <div className={`${CONTAINER} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
            <Reveal className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Questions people ask first" />
              <p className="mt-6 leading-relaxed text-gray-600">
                Something not covered here? The free plan needs no card, so the fastest
                answer is usually ten minutes in the product.
              </p>
              <a href={REGISTER_URL} className="pill pill-outline mt-10">
                Start free
              </a>
            </Reveal>
            <div className="border-b border-gray-200 lg:col-span-8">
              {FAQS.map(({ q, a }, i) => (
                <Reveal key={q} delay={i * 40}>
                  <details className="group border-t border-gray-200">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 text-lg font-light text-gray-900 transition-colors hover:text-gray-600 sm:text-xl [&::-webkit-details-marker]:hidden">
                      {q}
                      <Plus
                        className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                        strokeWidth={1.25}
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="-mt-2 pb-7 pr-12 leading-relaxed text-gray-600">{a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Closing panel: a black split inside the page gutters ------ */}
        <section className="bg-surface pb-24 sm:pb-32">
          <div className={CONTAINER}>
            <Reveal>
              <div className="grid overflow-hidden bg-black text-white lg:grid-cols-2">
                <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-20">
                  <p className="eyebrow text-white/80">Start today</p>
                  <h2 className="mt-4 text-4xl font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl">
                    Find the businesses that actually need you
                  </h2>
                  <p className="mt-6 max-w-md leading-relaxed text-white/70">
                    200 leads on the free plan. No card required, and everything you find
                    exports to CSV or JSON.
                  </p>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <a href={REGISTER_URL} className="pill pill-solid-on-dark">Start free</a>
                    <a href={LOGIN_URL} className="pill pill-on-dark">Log in</a>
                  </div>
                </div>
                <div className="media-zoom relative min-h-[18rem] overflow-hidden lg:min-h-[34rem]">
                  <img
                    src="/screenshots/dashboard.png"
                    alt=""
                    aria-hidden="true"
                    width="1917"
                    height="970"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-[100%_0%]"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white">
        <div className={`${CONTAINER} pb-10 pt-16`}>
          <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-12 sm:flex-row sm:items-center">
            <a href="#top" aria-label="LeadForge home">
              <Logo />
            </a>
            <div className="flex items-center gap-6">
              <p className="eyebrow text-white">Ready when you are</p>
              <a href={REGISTER_URL} className="pill pill-solid-on-dark px-6 py-3 text-sm">Start free</a>
            </div>
          </div>

          <div className="grid gap-12 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="max-w-sm lg:col-span-2">
              <p className="eyebrow text-white">About</p>
              <p className="mt-5 text-sm leading-relaxed text-white/60">
                A client-finding tool for freelancers and small web agencies. It finds
                local businesses whose sites are broken, dated or missing, proves it,
                and writes the first message.
              </p>
            </div>

            <nav aria-label="Product">
              <h2 className="eyebrow text-white" style={{ letterSpacing: '0.08em' }}>Product</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="group inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white">
                      {l.label}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Account">
              <h2 className="eyebrow text-white" style={{ letterSpacing: '0.08em' }}>Get started</h2>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a href={REGISTER_URL} className="group inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white">
                    Create an account
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href={LOGIN_URL} className="group inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white">
                    Log in
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/7umer/leadforge"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
                  >
                    <Github className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                    Source on GitHub
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-3 text-xs text-white/40 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} LeadForge</p>
            <p>Built for freelancers and small agencies.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

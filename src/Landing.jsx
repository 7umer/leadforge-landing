import { useEffect, useRef, useState } from 'react'
import {
  Zap, Sun, Moon, Menu, X, Search, ShieldCheck, Send, MapPin, Smartphone,
  Mail, Languages, Star, Filter, TrendingUp, Check, ChevronDown, ArrowRight,
  FileText, MessageCircle, Clock, Gift, Building2, KeyRound, Lock, Download,
  FlaskConical, Github, ListX, Globe2, MessageSquareDashed, Layers, Phone,
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
function SectionHeading({ eyebrow, title, children, align = 'center' }) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'text-center max-w-2xl mx-auto' : ''}>
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] text-primary-600 ${centered ? '' : 'text-left'}`}>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">{title}</h2>
      {children && <p className="mt-4 text-lg text-gray-500 leading-relaxed">{children}</p>}
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

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

function Nav() {
  const [theme, toggleTheme] = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Which anchored section the reader is actually in. The rootMargin pins
     the decision line near the top of the viewport rather than the middle:
     a section counts as "current" once its heading is up under the nav,
     which is where a reader thinks they are - not once it happens to cover
     half the screen. */
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
      { rootMargin: '-72px 0px -70% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const links = NAV_LINKS

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-surface/60 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-sm'
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
          {links.map((l) => {
            const isActive = active === l.href
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  scrolled
                    ? isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                    : isActive ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {l.label}
                {/* An underline rather than a colour change alone: over the
                    hero the link sits on a dark gradient, where "slightly
                    brighter white" is not a difference anyone can see. */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-200 ${
                    scrolled ? 'bg-primary-600' : 'bg-white'
                  } ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </a>
            )
          })}
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
        <div className="md:hidden bg-surface/80 backdrop-blur-xl border-t border-white/40 dark:border-white/10 px-5 py-4 space-y-3">
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

/* A mock of the product, not a stock image or screenshot. Glass rather than
   a solid white card: on a video background a boxy white card would sit on
   top of the scene instead of in it, so this uses the same translucent,
   blurred-behind-it treatment as the badges and buttons around it, with
   light text since the ground beneath it is always dark. */
/* The hero panel is a working demo, not a picture of one, so each lead
   carries the message the product would actually generate from its own
   heaviest finding - selecting a row is what shows the reader the
   finding-to-outreach step rather than a caption asserting it. */
const MOCK_LEADS = [
  {
    name: 'Riverside Family Dental', city: 'Austin, TX', initials: 'RD', score: 92, tag: 'high',
    finding: 'No mobile viewport', severity: 'bg-red-400', phone: true, email: true,
    tint: 'bg-rose-400/15 text-rose-200',
    message: 'Hi Riverside Family Dental — I had a look at your site on my phone and it isn’t mobile-friendly. I fix exactly this for clinics — want to see it fixed?',
  },
  {
    name: 'Copper Kettle Café', city: 'Leeds, UK', initials: 'CK', score: 74, tag: 'high',
    finding: 'No HTTPS', severity: 'bg-red-400', phone: true, email: false,
    tint: 'bg-amber-400/15 text-amber-200',
    message: 'Hi Copper Kettle Café — your site is still on http, so Chrome shows visitors a “Not secure” warning before they see the menu. That’s a quick fix.',
  },
  {
    name: 'Alvarez Auto Repair', city: 'Fresno, CA', initials: 'AA', score: 51, tag: 'medium',
    finding: 'Site is 12 years old', severity: 'bg-amber-400', phone: true, email: true,
    tint: 'bg-sky-400/15 text-sky-200',
    message: 'Hi Alvarez Auto Repair — your site was built around 2013 and still runs jQuery 1.x. I rebuild shop sites like yours without the downtime.',
  },
  {
    name: 'Northside Physio', city: 'Dublin, IE', initials: 'NP', score: 38, tag: 'low',
    finding: 'Listing has no photos', severity: 'bg-white/40', phone: false, email: true,
    tint: 'bg-emerald-400/15 text-emerald-200',
    message: 'Hi Northside Physio — your website is fine, but your Google listing has no photos, which is where most people decide. Happy to sort that.',
  },
]

const HERO_FILTERS = [
  { id: 'high', label: 'Score 70+', test: (l) => l.score >= 70 },
  { id: 'phone', label: 'Has phone', test: (l) => l.phone },
]

/* Columns as one grid template shared by the header row and every data row,
   so they line up down the panel. Rows laid out independently with
   `justify-between` was the single biggest tell that this was a drawing of
   an app rather than a screenshot of one - real tables have columns. */
const HERO_COLS = 'grid-cols-[minmax(0,1fr)_9.5rem_2.75rem] sm:grid-cols-[minmax(0,1fr)_11rem_3rem]'

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
    <div className="card p-0 overflow-hidden max-w-lg mx-auto">
      <div className="px-6 py-4 border-b border-gray-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-600" aria-hidden="true" />
          <span className="text-sm font-semibold text-gray-900">Website Rebuild Proposal</span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" aria-hidden="true" /> Viewed 2h ago
        </span>
      </div>

      <div className="px-6 py-4 space-y-1">
        {PROPOSAL_ITEMS.map((item) => {
          const included = on.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={included}
              className="w-full flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 text-left hover:bg-gray-100/70 transition-colors"
            >
              <span
                className={`w-4 h-4 shrink-0 rounded grid place-items-center ring-1 transition-colors ${
                  included
                    ? 'bg-emerald-500 ring-emerald-500'
                    : 'bg-transparent ring-gray-300'
                }`}
              >
                {included && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
              </span>
              <span className={`min-w-0 flex-1 text-sm ${included ? 'text-gray-700' : 'text-gray-400'}`}>
                <span className="text-gray-400">{item.finding}</span>
                <span className="mx-1.5 text-gray-300">→</span>
                <span className={included ? 'text-gray-900 font-medium' : ''}>{item.service}</span>
              </span>
              <span
                className={`shrink-0 text-sm tabular-nums ${
                  included ? 'text-gray-900 font-medium' : 'text-gray-300 line-through'
                }`}
              >
                ${item.price}
              </span>
            </button>
          )
        })}
      </div>

      <div className="px-6 py-4 border-t border-gray-200/60 flex items-center justify-between">
        <span className="text-xs text-gray-400">leadforge.app/p/8f2a1c</span>
        <span className="text-lg font-bold text-gray-900 tabular-nums">${total}</span>
      </div>
    </div>
  )
}

/* The scoring section used to be three bars at fixed widths beside a
   paragraph describing the formula. Since the formula is the thing the
   section is asking to be trusted, it is more convincing to hand it over
   and let someone drive it: change what the business has and watch the
   components, the total and the tag move.

   The weights below are the product's own, not illustrative numbers. */
const WEBSITE_STATES = [
  { id: 'none', label: 'No website', need: 60 },
  { id: 'broken', label: 'Broken', need: 55 },
  { id: 'social', label: 'Social page only', need: 50 },
  { id: 'outdated', label: 'Outdated', need: 45 },
  { id: 'modern', label: 'Modern', need: 12 },
]

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
    { label: 'Need', value: need, max: 60, color: 'bg-primary-600' },
    { label: 'Reach', value: reach, max: 25, color: 'bg-[#0ea5e9]' },
    { label: 'Viability', value: viability, max: 15, color: 'bg-[#7c3aed]' },
  ]

  const toggles = [
    { label: 'Phone', on: phone, set: setPhone, pts: '+12' },
    { label: 'Email', on: email, set: setEmail, pts: '+8' },
    { label: 'Address', on: address, set: setAddress, pts: '+5' },
  ]

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            Try it
          </p>
          <p className="mt-1 text-sm text-gray-500">Change the business, watch the score.</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-4xl font-bold text-gray-900 tabular-nums leading-none">{total}</div>
          <span className={`mt-2 inline-flex badge-${tag}`}>{tagLabel}</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-gray-500 mb-2">Their website</p>
        <div className="flex flex-wrap gap-1.5">
          {WEBSITE_STATES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSite(s.id)}
              aria-pressed={site === s.id}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ring-1 transition-colors ${
                site === s.id
                  ? 'bg-primary-600 text-white ring-primary-600'
                  : 'bg-gray-100 text-gray-600 ring-transparent hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-gray-500 mb-2">You can reach them by</p>
        <div className="flex flex-wrap gap-1.5">
          {toggles.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => t.set((v) => !v)}
              aria-pressed={t.on}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 transition-colors ${
                t.on
                  ? 'bg-primary-50 text-primary-700 ring-primary-200'
                  : 'bg-gray-100 text-gray-400 ring-transparent hover:bg-gray-200'
              }`}
            >
              {t.on ? <Check className="w-3 h-3" aria-hidden="true" /> : null}
              {t.label}
              <span className="text-[10px] opacity-60">{t.pts}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="lf-rating" className="flex items-baseline justify-between text-xs font-medium text-gray-500">
          Google rating
          <span className="tabular-nums text-gray-700">{rating.toFixed(1)}</span>
        </label>
        <input
          id="lf-rating"
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-2 w-full accent-primary-600"
        />
      </div>

      <div className="mt-6 space-y-3 pt-5 border-t border-gray-200/70">
        {parts.map((p) => (
          <div key={p.label}>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{p.label}</span>
              <span className="text-xs text-gray-400 tabular-nums">
                {p.value} / {p.max}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${p.color} transition-[width] duration-300`}
                style={{ width: `${(p.value / p.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {unreachable && (
        <p className="mt-4 text-xs text-amber-700 bg-amber-50 rounded-md px-2.5 py-2">
          No phone and no email — scaled to 55%, because it can’t be pitched.
        </p>
      )}
    </div>
  )
}

/* A working panel rather than a picture of one: the filters filter, the
   score column sorts, and picking a lead writes that lead's outreach into
   the draft below. The point of the product is that a finding becomes a
   message, and letting someone click a row and watch that happen argues it
   better than a caption claiming it does.

   No perspective tilt any more either - a rotated pane says "screenshot,
   for looking at". Sitting square says "this one works". */
function HeroVisual() {
  const [active, setActive] = useState([])
  const [sortDesc, setSortDesc] = useState(true)
  const [selected, setSelected] = useState(MOCK_LEADS[0].name)

  const toggleFilter = (id) =>
    setActive((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  const rows = MOCK_LEADS
    .filter((lead) => HERO_FILTERS.every((f) => !active.includes(f.id) || f.test(lead)))
    .sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score))

  // The selection has to survive being filtered out of view, or the draft
  // below would keep quoting a lead the table no longer shows.
  const shown = rows.find((l) => l.name === selected) || rows[0]

  return (
    <div className="relative mt-16 sm:mt-24 max-w-4xl mx-auto px-4 sm:px-2">
      {/* Light pooling under the panel, so it sits on the page instead of
          being pasted onto it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -bottom-10 top-10 rounded-[3rem] bg-[#4a5ae8]/20 blur-[70px]"
      />

      <div className="relative rounded-2xl bg-white/[0.07] backdrop-blur-2xl shadow-2xl ring-1 ring-white/15 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="mx-auto inline-flex items-center gap-1.5 rounded-md bg-white/[0.07] px-3 py-1 ring-1 ring-white/10">
            <Lock className="w-2.5 h-2.5 text-white/35" aria-hidden="true" />
            <span className="text-[11px] text-white/45">leadforge.app/leads</span>
          </span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.07] px-2.5 py-1 ring-1 ring-white/10 min-w-0">
            <Search className="w-3 h-3 text-white/35 shrink-0" aria-hidden="true" />
            <span className="text-[11px] text-white/55 truncate">dentists in Austin, TX</span>
          </span>
          {HERO_FILTERS.map((f) => {
            const on = active.includes(f.id)
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFilter(f.id)}
                aria-pressed={on}
                className={`hidden sm:inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ring-1 transition-colors ${
                  on
                    ? 'bg-primary-500/25 text-[#c7d7fe] ring-primary-400/40'
                    : 'bg-white/[0.07] text-white/50 ring-white/10 hover:bg-white/[0.12] hover:text-white/80'
                }`}
              >
                {f.label}
              </button>
            )
          })}
          <span className="ml-auto shrink-0 text-[11px] text-white/35 tabular-nums">
            {rows.length} lead{rows.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className={`grid ${HERO_COLS} gap-3 sm:gap-4 px-4 sm:px-5 py-2 border-b border-white/10`}>
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">Business</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">Top finding</span>
          <button
            type="button"
            onClick={() => setSortDesc((v) => !v)}
            className="flex items-center justify-end gap-0.5 text-[10px] font-medium uppercase tracking-wider text-white/30 hover:text-white/70 transition-colors"
            aria-label={`Sort by score, currently ${sortDesc ? 'highest' : 'lowest'} first`}
          >
            Score
            <ChevronDown
              className={`w-3 h-3 transition-transform ${sortDesc ? '' : 'rotate-180'}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="divide-y divide-white/[0.07]">
          {rows.map((lead) => {
            const isOn = shown && shown.name === lead.name
            return (
              <button
                key={lead.name}
                type="button"
                onClick={() => setSelected(lead.name)}
                aria-pressed={isOn}
                className={`w-full text-left grid ${HERO_COLS} gap-3 sm:gap-4 items-center px-4 sm:px-5 py-3 transition-colors ${
                  isOn ? 'bg-white/[0.10]' : 'hover:bg-white/[0.05]'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className={`hidden sm:flex w-7 h-7 shrink-0 rounded-md items-center justify-center text-[10px] font-semibold ring-1 ring-white/10 ${lead.tint}`}
                  >
                    {lead.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium text-white truncate">{lead.name}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/35">
                      <span className="truncate">{lead.city}</span>
                      {/* Reachability is what the score's Reach component is
                          about, so the row shows it the way the app does. */}
                      {lead.phone && <Phone className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />}
                      {lead.email && <Mail className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />}
                    </span>
                  </span>
                </span>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/[0.07] px-2 py-0.5 ring-1 ring-white/10 min-w-0">
                  <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${lead.severity}`} />
                  <span className="text-[11px] text-white/55 truncate">{lead.finding}</span>
                </span>
                <span className={`justify-self-end tabular-nums badge-${lead.tag}`}>{lead.score}</span>
              </button>
            )
          })}

          {rows.length === 0 && (
            <p className="px-5 py-8 text-center text-[12px] text-white/40">
              No leads match those filters.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between px-4 sm:px-5 py-2 border-t border-white/10">
          <span className="text-[11px] text-white/30 tabular-nums">
            Showing {rows.length} of {MOCK_LEADS.length}
          </span>
          <span className="text-[11px] text-white/25 hidden sm:inline">Pick a lead to see its outreach</span>
        </div>
      </div>

      {/* Static below lg, where it becomes the second half of the demo, and
          a floating second window above it - one element either way rather
          than two copies of the same card in the DOM. */}
      <div className="mt-5 lg:mt-0 lg:absolute lg:-bottom-16 lg:-left-10 w-full lg:w-64 rounded-xl bg-white/[0.09] backdrop-blur-2xl shadow-2xl ring-1 ring-white/15 p-3.5 lg:-rotate-2">
        <div className="flex items-center gap-1.5 mb-2">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-white/60">WhatsApp draft</span>
          <span className="ml-auto text-[10px] text-white/30 truncate max-w-[9rem]">
            {shown ? shown.name : '—'}
          </span>
        </div>
        {/* aria-live, so choosing a row announces the new draft rather than
            silently swapping text under a screen reader. */}
        <p aria-live="polite" className="text-[11px] text-white/80 leading-snug">
          {shown ? shown.message : 'Select a lead to draft its opening message.'}
        </p>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    /* No background colour here - body supplies it, so the ambient layer
       below can sit behind the content without being painted over. */
    <div className="min-h-screen">
      <div aria-hidden="true" className="ambient pointer-events-none fixed inset-0 -z-10" />
      <Nav />

      <main>
        {/* ---- Hero --------------------------------------------------- */}
        <section className="relative overflow-hidden bg-[#080c1a] bg-gradient-to-br from-[#0b1122] via-[#111a35] to-[#0a0f1e] pt-36 pb-36 sm:pt-44 sm:pb-48">
          {/* Two soft light sources, so a large flat area of brand colour has
              somewhere for the eye to rest, plus a hairline of light along the
              top edge, the way a lit surface catches its own boundary — the
              same treatment the app's own sign-in panel uses, so the front
              door and the product look like one build. These were dimmed
              almost out while a starfield carried the hero; with that gone
              they are back at full strength. */}
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
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow="The problem" title="Most lead lists go stale before you finish dialling them">
                Three things waste the morning, and none of them are fixed by
                finding more businesses.
              </SectionHeading>
            </Reveal>

            <div className="mt-14 grid sm:grid-cols-3 gap-6">
              {PROBLEMS.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 70}>
                  <div className="h-full">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* The turn: the same fact that makes the middle problem sting is
                the reason the product scores listings as well as sites. */}
            <Reveal delay={120}>
              <p className="mt-14 text-center text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                So LeadForge scores the <strong className="text-gray-900 font-semibold">Google listing</strong> too —
                missing photos, no opening hours, thin reviews — and the ones with a
                perfectly good website still have an opening worth calling about.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---- How it works ---------------------------------------------- */}
        <section id="how-it-works" className="scroll-mt-16 py-24 sm:py-32 bg-surface/25 backdrop-blur-md border-y border-white/40 dark:border-white/10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow="How it works" title="Find. Audit. Pitch.">
                Three steps, and the third one is already written for you.
              </SectionHeading>
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
        <section id="features" className="scroll-mt-16 py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow="Features" title="Everything between finding and closing">
                No step of the pipeline is left as manual busywork.
              </SectionHeading>
            </Reveal>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 [grid-auto-flow:dense]">
              {FEATURES.map(({ icon: Icon, title, body, wide, visual }, i) => (
                <Reveal key={title} delay={(i % 3) * 70} className={wide ? 'lg:col-span-2' : ''}>
                  <div className="card card-hover h-full flex flex-col hover:ring-1 hover:ring-primary-500/20">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{body}</p>
                    {/* The two wide cards are the two features that have real
                        structure to show - the score's components and the
                        audit's findings. Describing them in a paragraph while
                        occupying double the width was the grid promising
                        weight it didn't deliver. */}
                    {visual === 'score' && (
                      <div className="mt-5 space-y-2.5">
                        {SCORE_COMPONENTS.map((c) => (
                          <div key={c.label} className="flex items-center gap-3">
                            <span className="w-16 shrink-0 text-xs font-medium text-gray-600">{c.label}</span>
                            <span className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <span className={`block h-full rounded-full ${c.color}`} style={{ width: c.width }} />
                            </span>
                            <span className="w-14 shrink-0 text-right text-[11px] text-gray-400">{c.range}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {visual === 'audit' && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {AUDIT_FINDINGS.map((f) => (
                          <span
                            key={f.label}
                            className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                f.weight === 'Critical'
                                  ? 'bg-red-500'
                                  : f.weight === 'Major'
                                    ? 'bg-amber-500'
                                    : 'bg-gray-400'
                              }`}
                            />
                            {f.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- The score, explained ------------------------------------ */}
        <section className="py-24 sm:py-32 bg-surface/25 backdrop-blur-md border-y border-white/40 dark:border-white/10">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <SectionHeading eyebrow="Scoring" title="The score isn’t a black box" align="left" />
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

            <Reveal delay={100}>
              <ScoreCalculator />
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
              <SectionHeading eyebrow="Outreach" title="The message names the actual problem" align="left" />
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
        <section className="py-24 sm:py-32 bg-surface/25 backdrop-blur-md border-y border-white/40 dark:border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <Reveal className="mb-14">
              <SectionHeading eyebrow="Proposals" title="A priced proposal, not just a lead">
                One click turns an audit into a shareable, priced pitch —
                public link, no login required for the person reading it.
              </SectionHeading>
            </Reveal>

            <Reveal delay={100}>
              <ProposalBuilder />
            </Reveal>
            <p className="text-center mt-5 text-sm text-gray-400">
              Every price is a starting point — all of it is editable.
            </p>
          </div>
        </section>

        {/* ---- Trust ---------------------------------------------------
            Deliberately facts rather than logos or testimonials: the page
            has no customers it can name, and inventing some is the fastest
            way to lose the trust it is trying to earn. What it can say is
            who pays Google, who holds the data, and how to leave. */}
        <section className="py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow="Before you sign up" title="The boring questions, answered up front">
                What it costs to run, who holds your data, and how you get it
                back out.
              </SectionHeading>
            </Reveal>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TRUST.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={(i % 4) * 60}>
                  <div className="card h-full">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Pricing ------------------------------------------------ */}
        <section id="pricing" className="scroll-mt-16 py-24 sm:py-32 bg-surface/25 backdrop-blur-md border-y border-white/40 dark:border-white/10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow="Pricing" title="Simple pricing, upgrade when you outgrow free">
                Payment runs through Razorpay or a UPI QR — only the method
                actually configured on your account is ever shown.
              </SectionHeading>
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
        <section id="faq" className="scroll-mt-16 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <Reveal className="mb-14">
              <SectionHeading eyebrow="FAQ" title="Questions people ask first" />
            </Reveal>
            <div className="space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <Reveal key={q} delay={i * 40}>
                  <details className="group card cursor-pointer transition-colors hover:border-gray-300/80 [&::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between gap-4 font-medium text-gray-900 list-none">
                      {q}
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <p className="mt-10 text-center text-sm text-gray-400">
                Something not covered here?{' '}
                <a href={REGISTER_URL} className="text-primary-600 font-medium hover:underline">
                  Start free and find out in ten minutes
                </a>{' '}
                — the free plan needs no card.
              </p>
            </Reveal>
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

      <footer className="border-t border-white/40 dark:border-white/10 bg-surface/25 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2 max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-button">
                  <Zap className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-lg font-bold text-gray-900 tracking-tight">LeadForge</span>
              </div>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                A client-finding tool for freelancers and small web agencies.
                Finds local businesses whose sites are broken, dated or
                missing, proves it, and writes the first message.
              </p>
              <a
                href="https://github.com/7umer/leadforge"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                Source on GitHub
              </a>
            </div>

            <nav aria-label="Product">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Product</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><a href="#how-it-works" className="text-gray-500 hover:text-gray-900 transition-colors">How it works</a></li>
                <li><a href="#features" className="text-gray-500 hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-500 hover:text-gray-900 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-gray-500 hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </nav>

            <nav aria-label="Account">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Get started</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><a href={REGISTER_URL} className="text-gray-500 hover:text-gray-900 transition-colors">Create an account</a></li>
                <li><a href={LOGIN_URL} className="text-gray-500 hover:text-gray-900 transition-colors">Log in</a></li>
              </ul>
              <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                Free plan: 200 leads, no card.
              </p>
            </nav>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} LeadForge</p>
            <p className="text-xs text-gray-400">Built for freelancers and small agencies.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

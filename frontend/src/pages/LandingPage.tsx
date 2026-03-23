import { useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  IconArrowRight,
  IconBuilding,
  IconMessageCircle,
  IconTrendingUp,
  IconShieldCheck,
  IconChartBar,
  IconUsers,
  IconPlus,
} from '@tabler/icons-react'
import AuthModal from '../components/auth/AuthModal'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { useAppSelector } from '../store/hooks'
import { useGsapReveal, useGsapStagger } from '../utils/gsapMotion'
import { motionProfile } from '../utils/motionProfile'

const features = [
  {
    icon: IconMessageCircle,
    title: 'Collect Feedback',
    desc: 'Users submit product ideas, report bugs, and discuss them transparently on public boards. Every voice gets heard.',
  },
  {
    icon: IconTrendingUp,
    title: 'Prioritize by Votes',
    desc: 'Upvotes and downvotes surface what matters most.',
  },
  {
    icon: IconBuilding,
    title: 'Company Workspaces',
    desc: 'Each company gets a dedicated board so teams can respond, triage, and deliver. Organize feedback by status, category, and priority to keep your roadmap aligned with real user needs.',
  },
  {
    icon: IconShieldCheck,
    title: 'Secure by Default',
    desc: 'HttpOnly cookies, rate limiting, and Zod validation protect every request end-to-end.',
  },
  {
    icon: IconChartBar,
    title: 'Real-time Insights',
    desc: 'Track feedback trends, vote velocity, and request status across your entire pipeline. Make data-driven decisions with clear visibility into what your users want most.',
  },
  {
    icon: IconUsers,
    title: 'Community Driven',
    desc: 'Give your users a voice. Transparent discussions build trust.',
  },
]

// const showcaseCards = [
//   {
//     title: 'Public Feedback Board',
//     desc: 'Trending requests, voting, and filtering, all in one view.',
//     image: '/images/Screenshot%202026-03-21%20140050.png',
//   },
//   {
//     title: 'Request Discussion',
//     desc: 'Nested replies, visibility controls, and vote actions on every thread.',
//     image: '/images/Screenshot%202026-03-21%20140050.png',
//   },
//   {
//     title: 'Company Workspace',
//     desc: 'Company profile, feedback pipeline, and metrics at a glance.',
//     image: '/images/Screenshot%202026-03-21%20140050.png',
//   },
// ]

const testimonials = [
  {
    quote:
      'Voxella helped us stop guessing. The vote and discussion flow made our roadmap prioritization obvious.',
    name: 'Aline M.',
    role: 'Product Manager, Fintech Team',
  },
  {
    quote:
      'We finally have one place where users suggest ideas and our company replies transparently.',
    name: 'David K.',
    role: 'Founder, SaaS Startup',
  },
  {
    quote:
      'The company boards and request detail threads cut our feedback triage time significantly.',
    name: 'Jean P.',
    role: 'Head of Product, E-commerce',
  },
]

const trustedLogos = [
  { name: 'Vercel', src: '/logos/vercel.svg' },
  { name: 'Linear', src: '/logos/linear.svg' },
  { name: 'Stripe', src: '/logos/stripe.svg' },
  { name: 'Notion', src: '/logos/notion.svg' },
  { name: 'Figma', src: '/logos/figma.svg' },
  { name: 'Slack', src: '/logos/slack.svg' },
  { name: 'GitHub', src: '/logos/github.svg' },
  { name: 'Shopify', src: '/logos/shopify.svg' },
]

export default function LandingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector((s) => s.auth)
  const pageRef = useRef<HTMLDivElement | null>(null)

  const isAuthModalOpen =
    location.pathname === '/auth/login' || location.pathname === '/auth/register'
  const authMode = location.pathname === '/auth/register' ? 'register' : 'login'

  useGsapReveal(pageRef, [location.pathname], {
    y: motionProfile.route.y,
    duration: motionProfile.route.duration,
  })

  useGsapStagger(pageRef, '[data-gsap-land-section]', [location.pathname], {
    y: motionProfile.board.cards.y,
    duration: motionProfile.board.cards.duration,
    stagger: 0.06,
    delay: 0.03,
  })

  useGsapStagger(pageRef, '[data-gsap-land-card]', [location.pathname], {
    y: motionProfile.board.cards.y,
    duration: motionProfile.board.cards.duration,
    stagger: motionProfile.board.cards.stagger,
    delay: 0.08,
  })

  function openAuth(mode: 'login' | 'register') {
    navigate(`/auth/${mode}${location.search || ''}`)
  }

  return (
    <div ref={pageRef} className="h-screen overflow-y-auto custom-scroll bg-background">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-card-bg/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-1">
            <img src="/images/logo.png" alt="Voxella" className="h-8 w-auto" />
            <span className="text-2xl font-bold logo-adaptive tracking-tight">OXELLA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-base-100">
            <a href="#features" className="hover:text-base-200 transition-colors">
              Features
            </a>
            <a href="#showcase" className="hover:text-base-200 transition-colors">
              Product
            </a>
            <a href="#testimonials" className="hover:text-base-200 transition-colors">
              Testimonials
            </a>
            <Link to="/explore" className="hover:text-base-200 transition-colors">
              Explore
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuth('login')}
                  className="px-4 py-2 h-auto"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => openAuth('register')}
                  size="sm"
                  className="px-5 py-2 h-auto rounded-full"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/feed')}
                size="sm"
                className="px-5 py-2 h-auto rounded-full"
              >
                Go to Feed
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero (sticky behind content) ── */}
      <div className="sticky top-0 z-0">
        <section
          data-gsap-land-section
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary-100/40 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-20 text-center">
            <Badge className="mx-auto rounded-md px-4 py-2 text-sm">VOXELLA: Open Feedback Platform</Badge>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-base-200">
              Turn customer feedback into
              <span className="block">clear product decisions</span>
            </h1>

            <p className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-base-100 leading-relaxed">
              Collect requests, vote on what matters, and keep discussions in one place. Voxella gives
              users a public board to propose ideas and gives companies a simple workflow to prioritize
              and ship.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/feed">
                <Button className="px-6 py-3 h-auto rounded-full text-base">
                  Explore Public Feed
                  <IconArrowRight size={18} stroke={2} />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Button
                  variant="secondary"
                  onClick={() => openAuth('register')}
                  className="px-6 py-3 h-auto rounded-full text-base"
                >
                  Add Organization
                  <IconPlus size={18} stroke={2} />
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── Scrolling content (covers the hero) ── */}
      <div className="relative z-10 bg-background rounded-t-3xl -mt-6 shadow-[0_-4px_30px_-12px_rgba(0,0,0,0.06)]">

      {/* ── Trusted By ── */}
      <section data-gsap-land-section className="border-y border-border bg-card-bg overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-base-100 mb-6">
            Trusted by teams at
          </p>
          <div className="relative">
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-card-bg to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-card-bg to-transparent z-10" />

            <div className="flex gap-12 sm:gap-16 animate-marquee">
              {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex-shrink-0 flex items-center justify-center h-8"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-6 sm:h-7 w-auto object-contain opacity-40 hover:opacity-70 transition-opacity grayscale"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const fallback = document.createElement('span')
                      fallback.className = 'text-base sm:text-lg font-bold tracking-tight text-base-100/40 hover:text-base-100/70 transition-colors select-none'
                      fallback.textContent = logo.name
                      target.parentElement?.appendChild(fallback)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        data-gsap-land-section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-200">
            Everything you need to manage feedback
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-sm sm:text-base text-base-100">
            From collection to prioritization, a complete toolkit for product teams and their users.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Row 1 — 1 card centered */}
          <div className="flex justify-center">
            <Card data-gsap-land-card className="max-w-2xl text-center card-invert-hover">
              <CardContent className="p-5">
                <div className="h-9 w-9 rounded-lg bg-primary-100 flex items-center justify-center mb-3 mx-auto">
                  <IconMessageCircle size={18} stroke={1.8} className="icon-adaptive" />
                </div>
                <CardTitle>{features[0].title}</CardTitle>
                <CardDescription className="mt-1.5">{features[0].desc}</CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Row 2 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.slice(1, 4).map((f) => (
              <Card key={f.title} data-gsap-land-card className="text-center card-invert-hover">
                <CardContent className="p-5">
                  <div className="h-9 w-9 rounded-lg bg-primary-100 flex items-center justify-center mb-3 mx-auto">
                    <f.icon size={18} stroke={1.8} className="icon-adaptive" />
                  </div>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription className="mt-1.5">{f.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Row 3 — 2 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto w-full">
            {features.slice(4).map((f) => (
              <Card key={f.title} data-gsap-land-card className="text-center card-invert-hover">
                <CardContent className="p-5">
                  <div className="h-9 w-9 rounded-lg bg-primary-100 flex items-center justify-center mb-3 mx-auto">
                    <f.icon size={18} stroke={1.8} className="icon-adaptive" />
                  </div>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription className="mt-1.5">{f.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Showcase (hidden) ── */}
      {/* <section
        id="showcase"
        data-gsap-land-section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24"
      >
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-base-100">Product Tour</p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-base-200">Inside Voxella</h2>
          <p className="mt-3 mx-auto max-w-md text-sm text-base-100">
            A quick look at the core workflows for users and product teams.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {showcaseCards.map((item) => (
            <div key={item.title} data-gsap-land-card>
              <div className="overflow-hidden rounded-lg border border-border">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-base-200">{item.title}</p>
              <p className="mt-0.5 text-xs text-base-100">{item.desc}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        data-gsap-land-section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24"
      >
        <div className="text-center mb-10">
          <Badge>Testimonials</Badge>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-base-200">
            Trusted by product teams
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <Card
              key={item.name}
              data-gsap-land-card
              className="group hover:border-base-100/30 transition-colors"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <p className="text-sm text-base-200 leading-relaxed italic">"{item.quote}"</p>
                <div className="mt-5">
                  <Separator />
                  <p className="text-sm font-semibold text-base-200 mt-4">{item.name}</p>
                  <p className="text-xs text-base-100 mt-0.5">{item.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section data-gsap-land-section className="border-y border-border bg-card-bg">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-200">
            Ready to build what your users actually want?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-base-100 max-w-lg mx-auto">
            Join hundreds of companies using Voxella to collect, prioritize, and act on product
            feedback.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {!isAuthenticated ? (
              <Button
                onClick={() => openAuth('register')}
                className="px-6 py-3 h-auto rounded-full text-base"
              >
                Get Started, It's Free
                <IconArrowRight size={18} stroke={2} />
              </Button>
            ) : (
              <Link to="/feed">
                <Button className="px-6 py-3 h-auto rounded-full text-base">
                  Go to Feed
                  <IconArrowRight size={18} stroke={2} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer data-gsap-land-section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-1">
                <img src="/images/logo.png" alt="Voxella" className="h-7 w-auto" />
                <span className="text-lg font-extrabold tracking-tight">OXELLA</span>
              </div>
              <p className="mt-2 text-xs text-base-100 max-w-55 leading-relaxed">
                Product feedback infrastructure for transparent decisions and faster delivery.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-base-200">
                Product
              </h3>
              <div className="mt-3 flex flex-col gap-2 text-xs text-base-100">
                <Link to="/feed" className="hover:text-base-200 transition-colors">
                  Public Feed
                </Link>
                <Link to="/popular" className="hover:text-base-200 transition-colors">
                  Popular
                </Link>
                <Link to="/explore" className="hover:text-base-200 transition-colors">
                  Explore Companies
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-base-200">
                Account
              </h3>
              <div className="mt-3 flex flex-col gap-2 text-xs text-base-100">
                <Link to="/auth/register" className="hover:text-base-200 transition-colors">
                  Create Account
                </Link>
                <Link to="/auth/login" className="hover:text-base-200 transition-colors">
                  Sign In
                </Link>
                <Link to="/request-feedback" className="hover:text-base-200 transition-colors">
                  Request Feedback
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-base-200">
                Contact
              </h3>
              <div className="mt-3 flex flex-col gap-2 text-xs text-base-100">
                <a
                  href="mailto:contact@voxella.app"
                  className="hover:text-base-200 transition-colors"
                >
                  contact@voxella.app
                </a>
                <a href="tel:+250787524308" className="hover:text-base-200 transition-colors">
                  +250 787 524 308
                </a>
                <p>Kigali, Rwanda</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-5 border-t border-border text-xs text-base-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p>Voxella, Inc. © {new Date().getFullYear()}. All rights reserved.</p>
            <p>Built for community-driven product decisions.</p>
          </div>
        </div>
      </footer>

      </div>{/* end scrolling content wrapper */}

      <AuthModal open={isAuthModalOpen} mode={authMode} onClose={() => navigate('/')} />
    </div>
  )
}

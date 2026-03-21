import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  IconArrowRight,
  IconBuilding,
  IconMessageCircle,
  IconTrendingUp,
} from '@tabler/icons-react'
import AuthModal from '../components/auth/AuthModal'

export default function LandingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const showcaseImage = '/images/Screenshot%202026-03-21%20140050.png'
  const isAuthModalOpen =
    location.pathname === '/auth/login' || location.pathname === '/auth/register'
  const authMode = location.pathname === '/auth/register' ? 'register' : 'login'

  function openAuth(mode: 'login' | 'register') {
    const search = location.search ? location.search : ''
    navigate(`/auth/${mode}${search}`)
  }

  function closeAuth() {
    navigate('/')
  }

  return (
    <div className="h-screen overflow-y-auto custom-scroll bg-background">
      <header className="border-b border-border bg-card-bg/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">
            VOXELLA
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-base-100">
            <Link to="/feed" className="hover:text-base-200 transition-colors">
              Public Feed
            </Link>
            <Link to="/popular" className="hover:text-base-200 transition-colors">
              Popular
            </Link>
            <Link to="/explore" className="hover:text-base-200 transition-colors">
              Explore
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="px-3 py-1.5 text-sm font-medium text-base-200 hover:text-primary-600 transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => openAuth('register')}
              className="px-4 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-full hover:bg-primary-800 transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 py-14 sm:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card-bg px-3 py-1 text-xs font-semibold uppercase tracking-wide text-base-100">
          Product Feedback Platform
        </div>

        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight text-base-200">
          Voxella helps teams turn customer feedback into clear product decisions.
        </h1>

        <p className="mt-5 max-w-2xl text-base sm:text-lg text-base-100 leading-relaxed">
          Collect requests, vote on what matters, and keep discussions in one place. Voxella gives
          users a public board to propose ideas and gives companies a simple workflow to prioritize
          and act.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/feed"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800 transition-colors"
          >
            View Public Feed
            <IconArrowRight size={16} stroke={2} />
          </Link>
          <button
            type="button"
            onClick={() => openAuth('register')}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card-bg px-5 py-3 text-sm font-semibold text-base-200 hover:bg-border/50 transition-colors"
          >
            Create Account
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card-bg p-5">
            <IconMessageCircle size={20} stroke={1.8} className="text-primary-600" />
            <h2 className="mt-3 text-base font-bold text-base-200">Collect Feedback</h2>
            <p className="mt-1 text-sm text-base-100">
              Users submit product ideas and discuss them transparently.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card-bg p-5">
            <IconTrendingUp size={20} stroke={1.8} className="text-primary-600" />
            <h2 className="mt-3 text-base font-bold text-base-200">Prioritize by Votes</h2>
            <p className="mt-1 text-sm text-base-100">
              Upvotes and downvotes help surface what is most important now.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card-bg p-5">
            <IconBuilding size={20} stroke={1.8} className="text-primary-600" />
            <h2 className="mt-3 text-base font-bold text-base-200">Work with Companies</h2>
            <p className="mt-1 text-sm text-base-100">
              Each request is tied to a company board so teams can respond and deliver.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 pb-14 sm:pb-16">
        <div className="rounded-2xl border border-border bg-card-bg p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
            <div>
              <h2 className="text-xl font-bold text-base-200">Inside Voxella</h2>
              <p className="text-sm text-base-100 mt-1">
                Add your real product screenshots here to show users how Voxella works.
              </p>
            </div>
            <span className="text-xs text-base-100">Suggested size: 1600x1000</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Public Feedback Board',
                desc: 'Show trending requests, voting, and filtering tabs.',
                image: showcaseImage,
              },
              {
                title: 'Request Discussion Page',
                desc: 'Highlight nested replies, visibility options, and vote actions.',
                image: showcaseImage,
              },
              {
                title: 'Company Workspace',
                desc: 'Present company profile, feedback pipeline, and metrics.',
                image: showcaseImage,
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-border p-3 bg-background"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-40 sm:h-44 w-full rounded-lg border border-border object-cover"
                />
                <h3 className="mt-3 text-sm font-bold text-base-200">{item.title}</h3>
                <p className="mt-1 text-xs text-base-100 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 pb-14 sm:pb-16">
        <div className="rounded-2xl border border-border bg-card-bg p-5 sm:p-6 lg:p-7">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-base-200">What Teams Say</h2>
              <p className="text-sm text-base-100 mt-1">
                Short testimonials from teams using Voxella to manage product feedback.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
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
            ].map((item) => (
              <article
                key={item.name}
                className="rounded-xl border border-border bg-background p-4"
              >
                <p className="text-sm text-base-200 leading-relaxed">"{item.quote}"</p>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-sm font-semibold text-base-200">{item.name}</p>
                  <p className="text-xs text-base-100 mt-0.5">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card-bg">
        <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="text-lg font-extrabold tracking-tight text-primary-600">VOXELLA</div>
              <p className="mt-2 text-xs text-base-100 max-w-[220px] leading-relaxed">
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
                  href="mailto:hello@voxella.app"
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

          <div className="mt-8 pt-4 border-t border-border text-xs text-base-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p>Voxella, Inc. © {new Date().getFullYear()}. All rights reserved.</p>
            <p>Built for community-driven product decisions.</p>
          </div>
        </div>
      </footer>

      <AuthModal open={isAuthModalOpen} mode={authMode} onClose={closeAuth} />
    </div>
  )
}

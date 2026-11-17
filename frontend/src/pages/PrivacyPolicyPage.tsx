import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconShieldLock } from '@tabler/icons-react'
import { SEOHead } from '../components/SEOHead'
import { Separator } from '../components/ui/separator'
import { generateSEOMetadata } from '../utils/seoHelpers'

const LAST_UPDATED = 'November 17, 2026'
const CONTACT_EMAIL = 'contact@voxella.app'

interface PolicySection {
  id: string
  title: string
  body: ReactNode
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

const sections: PolicySection[] = [
  {
    id: 'overview',
    title: '1. Overview',
    body: (
      <p>
        Voxella (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a product feedback
        platform where people share ideas, vote on requests, and discuss them with the companies
        that build the products. This Privacy Policy explains what information we collect when you
        use voxella.app, how we use it, and the choices you have. By using Voxella you agree to the
        practices described here.
      </p>
    ),
  },
  {
    id: 'information-we-collect',
    title: '2. Information we collect',
    body: (
      <>
        <p>
          <strong className="text-base-200">Account information (individual users).</strong> When
          you create an account we collect your first and last name, email address, a password
          (stored only as a secure hash), and optionally a phone number and profile picture.
        </p>
        <p className="mt-3">
          <strong className="text-base-200">Account information (companies).</strong> Companies
          provide a company name, email address, password (hashed), and optionally a location,
          website, description, and logo.
        </p>
        <p className="mt-3">
          <strong className="text-base-200">Google sign-in.</strong> If you choose to sign in with
          Google, we receive your name, email address, and profile picture from Google. We never
          receive your Google password.
        </p>
        <p className="mt-3">
          <strong className="text-base-200">Content you create.</strong> Feedback requests, replies,
          votes, the companies you follow, and whether you chose to post anonymously.
        </p>
        <p className="mt-3">
          <strong className="text-base-200">Preferences.</strong> Notification settings (email
          notifications, weekly digest), profile visibility, and theme preference.
        </p>
        <p className="mt-3">
          <strong className="text-base-200">Technical information.</strong> Your IP address and
          request details are processed for rate limiting, security, and error logs. When you vote
          without an account, we assign a random anonymous identifier so the same browser cannot
          vote twice.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '3. How we use your information',
    body: (
      <List
        items={[
          'To create and manage your account and keep you signed in.',
          'To publish the feedback, replies, and votes you submit and show them to the relevant company and community.',
          'To send transactional emails such as email verification, password resets, and, if enabled, activity notifications and weekly digests.',
          'To show in-app notifications about activity on feedback you are involved in.',
          'To rank and surface feedback (for example trending and popular lists).',
          'To protect the platform against abuse, spam, brute-force attacks, and fraudulent voting.',
          'To moderate content and enforce our rules.',
        ]}
      />
    ),
  },
  {
    id: 'public-content',
    title: '4. What is public',
    body: (
      <>
        <p>
          Voxella is built around public feedback. Unless you choose otherwise, the following is
          visible to anyone:
        </p>
        <List
          items={[
            'Feedback requests and replies, together with your name and avatar.',
            'Vote counts on feedback and replies (individual votes are not shown publicly).',
            'Company profiles, including name, logo, description, location, and website.',
          ]}
        />
        <p className="mt-3">
          When you post <strong className="text-base-200">anonymously</strong>, your name and avatar
          are hidden from other users and the company. We still store the link to your account
          internally so we can send you notifications and handle abuse reports. You can also turn
          off your public profile in Settings.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '5. Cookies and local storage',
    body: (
      <>
        <p>We do not use advertising or third-party tracking cookies. We use:</p>
        <List
          items={[
            <>
              <code className="text-base-200">refreshToken</code> &mdash; a secure, HttpOnly cookie
              that keeps you signed in for up to 7 days.
            </>,
            <>
              <code className="text-base-200">anon_token</code> &mdash; a secure, HttpOnly cookie
              with a random identifier, valid for up to 1 year, used only to prevent duplicate guest
              votes.
            </>,
            'Browser local storage for your session profile, sidebar state, followed companies, and guest votes, so the app works smoothly between visits.',
          ]}
        />
        <p className="mt-3">
          These are strictly necessary for Voxella to work. Blocking them may prevent you from
          signing in or voting.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: '6. How we share information',
    body: (
      <>
        <p>We do not sell your personal information. We share it only in the following cases:</p>
        <List
          items={[
            'With companies on Voxella: when you submit feedback to a company, that company can see it and respond (your identity is hidden if you post anonymously).',
            'With service providers that help us run Voxella, such as our hosting and database providers, our email delivery provider, Cloudinary (image uploads), and Google (sign-in and location autocomplete). They may only use your data to provide their services to us.',
            'When required by law, or to protect the rights, safety, and security of Voxella, our users, or the public.',
            'As part of a merger, acquisition, or sale of assets, in which case we will notify you.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'retention',
    title: '7. Data retention',
    body: (
      <p>
        We keep your account information for as long as your account is active. Verification and
        password-reset tokens expire automatically. Public content you post may remain visible until
        it is deleted by you, the company, or our moderators. When an account is deleted, we remove
        or anonymize the associated personal data within a reasonable period, except where we must
        keep it to comply with legal obligations or resolve disputes.
      </p>
    ),
  },
  {
    id: 'security',
    title: '8. Security',
    body: (
      <p>
        We protect your data with measures including password hashing, HttpOnly secure cookies,
        short-lived access tokens, automatic sign-out after inactivity, rate limiting on
        authentication, and strict input validation. No online service is perfectly secure, so we
        encourage you to use a strong, unique password.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: '9. Your rights and choices',
    body: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <List
          items={[
            <>
              Access and update your information at any time from your{' '}
              <Link to="/profile" className="text-primary-600 hover:underline">
                Profile
              </Link>{' '}
              and{' '}
              <Link to="/settings" className="text-primary-600 hover:underline">
                Settings
              </Link>
              .
            </>,
            'Turn email notifications and the weekly digest on or off.',
            'Request a copy of your personal data.',
            'Request deletion of your account and personal data.',
            'Object to or restrict certain processing.',
          ]}
        />
        <p className="mt-3">
          To exercise any of these rights, email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          . We will respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: "10. Children's privacy",
    body: (
      <p>
        Voxella is not directed to children under 16, and we do not knowingly collect personal
        information from them. If you believe a child has provided us with personal data, please
        contact us and we will delete it.
      </p>
    ),
  },
  {
    id: 'international',
    title: '11. International transfers',
    body: (
      <p>
        Voxella is operated from Kigali, Rwanda. Our service providers may process your data in
        other countries. Where this happens, we take steps to ensure your information remains
        protected in line with this policy and applicable data protection laws, including
        Rwanda&rsquo;s Law No. 058/2021 on the protection of personal data and privacy.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '12. Changes to this policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we make significant changes, we
        will update the &ldquo;Last updated&rdquo; date above and, where appropriate, notify you by
        email or in the app.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '13. Contact us',
    body: (
      <p>
        Questions about this policy or your data? Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-600 hover:underline">
          {CONTACT_EMAIL}
        </a>{' '}
        or visit our{' '}
        <Link to="/help" className="text-primary-600 hover:underline">
          Help Center
        </Link>
        .
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div data-gsap-page className="bg-background min-h-full">
      <SEOHead
        seo={generateSEOMetadata({
          title: 'Privacy Policy - Voxella',
          description:
            'Learn what information Voxella collects, how we use it, and the choices you have about your data.',
          url: 'https://voxella.app/privacy',
        })}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-xl border border-border bg-card-bg p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <IconShieldLock size={20} stroke={1.7} className="text-primary-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-base-200">Privacy Policy</h1>
              <p className="mt-1 text-sm text-base-100">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
        </div>

        <nav
          aria-label="Privacy policy sections"
          className="mt-5 sm:mt-6 rounded-xl border border-border bg-card-bg p-5 sm:p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-base-100">Contents</h2>
          <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-base-200 hover:underline">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="mt-5 sm:mt-6 rounded-xl border border-border bg-card-bg p-5 sm:p-6">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-6">
              {index > 0 && <Separator className="my-6" />}
              <h2 className="text-base sm:text-lg font-semibold text-base-200">{section.title}</h2>
              <div className="mt-2 text-sm leading-relaxed text-base-100 wrap-break-word">
                {section.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}

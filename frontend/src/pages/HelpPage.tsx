import { IconHelpCircle, IconMail, IconMessageCircle, IconPhone } from '@tabler/icons-react'
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'

const faqItems = [
  {
    question: 'How do I submit feedback?',
    answer:
      'Open a company page and use the feedback request flow. You can choose public or anonymous visibility where available.',
  },
  {
    question: 'How can I follow a company?',
    answer:
      'Go to Explore, click Follow on any company card, and it will appear in your followed list in the sidebar.',
  },
  {
    question: 'How do notifications work?',
    answer:
      'When there is activity on relevant feedback threads, the notification bell in the header shows unread updates.',
  },
  {
    question: 'Can I update my profile and preferences?',
    answer: 'Yes. Use Profile and Settings from the avatar menu in the header.',
  },
]

export default function HelpPage() {
  return (
    <div data-gsap-page className="bg-background min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-xl border border-border bg-card-bg p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <IconHelpCircle size={20} stroke={1.7} className="text-primary-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-base-200">Help Center</h1>
              <p className="mt-1 text-sm text-base-100">
                Quick answers and support channels for using Voxella.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-5 sm:mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-base-100">FAQs</h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((item) => (
              <Card key={item.question}>
                <CardContent className="p-5">
                  <CardTitle className="text-base">{item.question}</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-relaxed">
                    {item.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-6 sm:mt-8 rounded-xl border border-border bg-card-bg p-5 sm:p-6">
          <h2 className="text-base font-semibold text-base-200">Contact Support</h2>
          <p className="mt-1 text-sm text-base-100">
            If you still need help, reach out through one of these channels.
          </p>

          <Separator className="my-4" />

          <div className="space-y-3 text-sm text-base-200">
            <a
              href="mailto:contact@voxella.app"
              className="flex items-center gap-2 hover:underline"
            >
              <IconMail size={16} stroke={1.7} className="text-base-100" />
              contact@voxella.app
            </a>
            <a href="tel:+250787524308" className="flex items-center gap-2 hover:underline">
              <IconPhone size={16} stroke={1.7} className="text-base-100" />
              +250 787 524 308
            </a>
            <p className="flex items-center gap-2">
              <IconMessageCircle size={16} stroke={1.7} className="text-base-100" />
              Average response time: within 1 business day
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

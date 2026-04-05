// import { IconFlame, IconClock, IconTrendingUp } from '@tabler/icons-react'
import type { Feedback } from '../types/feedback'
import Avatar from './ui/Avatar'
import FeedbackCard from './FeedbackCard'
import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVoteCompanyFeedbackMutation } from '../store/api/companyApi'
import { Button } from './ui/button'
import { useGsapReveal, useGsapStagger } from '../utils/gsapMotion'
import { useAppSelector } from '../store/hooks'
import { getGuestVote, recordGuestVote, removeGuestVote } from '../utils/guestVotes'

function getOptimisticVoteOutcome(
  upvotes: number,
  downvotes: number,
  currentVote: 'up' | 'down' | null,
  nextDirection: 'up' | 'down'
) {
  if (currentVote === nextDirection) {
    return {
      upvotes: upvotes - (nextDirection === 'up' ? 1 : 0),
      downvotes: downvotes - (nextDirection === 'down' ? 1 : 0),
      userVote: null,
    }
  }

  if (currentVote === null) {
    return {
      upvotes: upvotes + (nextDirection === 'up' ? 1 : 0),
      downvotes: downvotes + (nextDirection === 'down' ? 1 : 0),
      userVote: nextDirection,
    }
  }

  return {
    upvotes: upvotes + (nextDirection === 'up' ? 1 : -1),
    downvotes: downvotes + (nextDirection === 'down' ? 1 : -1),
    userVote: nextDirection,
  }
}

export default function PublicFeedbackBoard({ feedbacks }: { feedbacks: Feedback[] }) {
  const [voteOverrides, setVoteOverrides] = useState<
    Record<string, { upvotes: number; downvotes: number }>
  >({})
  const [voteSelections, setVoteSelections] = useState<Record<string, 'up' | 'down' | null>>({})
  const [voteFeedback] = useVoteCompanyFeedbackMutation()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const asideRef = useRef<HTMLElement | null>(null)

  useGsapReveal(rootRef, [], { y: 8, duration: 0.28 })

  const boardFeedbacks = useMemo(
    () =>
      feedbacks.map((feedback) => ({
        ...feedback,
        upvotes: voteOverrides[feedback.id]?.upvotes ?? feedback.upvotes,
        downvotes: voteOverrides[feedback.id]?.downvotes ?? feedback.downvotes ?? 0,
      })),
    [feedbacks, voteOverrides]
  )

  const sortedFeedbacks = useMemo(() => {
    return [...boardFeedbacks].sort((a, b) => {
      const aCreatedAtMs = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bCreatedAtMs = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bCreatedAtMs - aCreatedAtMs
    })
  }, [boardFeedbacks])

  // const totalUpvotes = boardFeedbacks.reduce((sum, f) => sum + f.upvotes, 0)
  // const totalDownvotes = boardFeedbacks.reduce((sum, f) => sum + (f.downvotes ?? 0), 0)
  // const totalCompanies = useMemo(
  //   () =>
  //     new Set(
  //       boardFeedbacks.flatMap((feedback) =>
  //         feedback.reachedTo.map((company) => company.id || company.name.trim())
  //       )
  //     ).size,
  //   [boardFeedbacks]
  // )
  const topCompanies = useMemo(
    () =>
      Array.from(
        boardFeedbacks
          .flatMap((feedback) => feedback.reachedTo)
          .reduce((map, company) => {
            const key = company.id || company.name.trim().toLowerCase()
            const current = map.get(key)

            if (!current) {
              map.set(key, {
                name: company.name,
                count: 1,
                avatar: company.avatar,
                slug: company.slug,
              })
              return map
            }

            current.count += 1
            if (!current.avatar && company.avatar) current.avatar = company.avatar
            if (!current.slug && company.slug) current.slug = company.slug
            return map
          }, new Map<string, { name: string; count: number; avatar?: string; slug?: string }>())
      )
        .map(([, value]) => value)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    [boardFeedbacks]
  )

  useGsapStagger(listRef, '[data-gsap-card]', [sortedFeedbacks.length], {
    y: 14,
    duration: 0.34,
    stagger: 0.045,
  })

  useGsapStagger(asideRef, '[data-gsap-aside]', [topCompanies.length, boardFeedbacks.length], {
    y: 10,
    duration: 0.3,
    stagger: 0.06,
  })

  const incrementVote = async (feedbackId: string, direction: 'up' | 'down') => {
    const current = boardFeedbacks.find((feedback) => feedback.id === feedbackId)
    if (!current) return

    const companySlug = current.reachedTo[0]?.slug
    const numericFeedbackId = Number.parseInt(feedbackId, 10)
    if (!companySlug || !Number.isFinite(numericFeedbackId)) return

    if (!isAuthenticated) {
      const guestVoteKey = `feedback:${numericFeedbackId}`
      const existingGuestVote = getGuestVote(guestVoteKey)
      if (existingGuestVote) {
        const nextUpvotes =
          existingGuestVote === 'up' ? Math.max(0, current.upvotes - 1) : current.upvotes
        const nextDownvotes =
          existingGuestVote === 'down'
            ? Math.max(0, (current.downvotes ?? 0) - 1)
            : (current.downvotes ?? 0)

        setVoteOverrides((prev) => ({
          ...prev,
          [feedbackId]: {
            upvotes: nextUpvotes,
            downvotes: nextDownvotes,
          },
        }))
        setVoteSelections((prev) => ({
          ...prev,
          [feedbackId]: null,
        }))
        removeGuestVote(guestVoteKey)
        return
      }
    }

    const previousOverride = voteOverrides[feedbackId]
    const previousSelection = voteSelections[feedbackId]
    const currentVote = previousSelection ?? current.userVote ?? null
    const optimistic = getOptimisticVoteOutcome(
      current.upvotes,
      current.downvotes ?? 0,
      currentVote,
      direction
    )

    setVoteOverrides((prev) => ({
      ...prev,
      [feedbackId]: {
        upvotes: optimistic.upvotes,
        downvotes: optimistic.downvotes,
      },
    }))

    setVoteSelections((prev) => ({
      ...prev,
      [feedbackId]: optimistic.userVote,
    }))

    try {
      const result = await voteFeedback({
        slug: companySlug,
        feedbackId: numericFeedbackId,
        direction,
      }).unwrap()

      if (!isAuthenticated) {
        recordGuestVote(`feedback:${numericFeedbackId}`, direction)
      }

      setVoteOverrides((prev) => ({
        ...prev,
        [feedbackId]: {
          upvotes: result.feedback.upvotes,
          downvotes: result.feedback.downvotes,
        },
      }))

      setVoteSelections((prev) => ({
        ...prev,
        [feedbackId]: !isAuthenticated ? direction : result.userVote,
      }))

      return
    } catch {
      setVoteOverrides((prev) => {
        if (previousOverride) {
          return { ...prev, [feedbackId]: previousOverride }
        }

        const next = { ...prev }
        delete next[feedbackId]
        return next
      })

      setVoteSelections((prev) => {
        if (typeof previousSelection !== 'undefined') {
          return { ...prev, [feedbackId]: previousSelection }
        }

        const next = { ...prev }
        delete next[feedbackId]
        return next
      })

      return
    }
  }

  function handleRequestFeature() {
    navigate('/request-feedback')
  }

  return (
    <div ref={rootRef} data-gsap-page className="bg-background mx-2">
      <div className="mx-auto w-full px-1 sm:px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,840px)_320px] lg:justify-center gap-6">
        <main className="min-w-0">
          <div className="mb-4 lg:hidden">
            <Button type="button" onClick={handleRequestFeature} className="w-full">
              Provide Feedback
            </Button>
          </div>

          {/* <div className="mb-6">
            <div className="flex items-center gap-2 border border-border bg-card-bg px-2 py-2 rounded-xl mb-6 overflow-x-auto shadow-none">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('new')}
                className={`h-auto flex items-center gap-1.5 px-4 py-2 text-sm transition-colors shrink-0 ${
                  activeTab === 'new'
                    ? 'bg-border text-base-200 font-semibold'
                    : 'hover:bg-sidebar-bg text-base-100 hover:text-base-200 font-medium'
                }`}
              >
                <IconClock size={18} stroke={3} /> New
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('top')}
                className={`h-auto flex items-center gap-1.5 px-4 py-2 text-sm transition-colors shrink-0 ${
                  activeTab === 'top'
                    ? 'bg-border text-base-200 font-semibold'
                    : 'hover:bg-sidebar-bg text-base-100 hover:text-base-200 font-medium'
                }`}
              >
                <IconTrendingUp size={18} stroke={3} /> Top
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('trending')}
                className={`h-auto flex items-center gap-1.5 px-4 py-2 text-sm transition-colors shrink-0 ${
                  activeTab === 'trending'
                    ? 'bg-border text-base-200 font-semibold'
                    : 'hover:bg-sidebar-bg text-base-100 hover:text-base-200 font-medium'
                }`}
              >
                <IconFlame size={18} stroke={3} /> Trending
              </Button>
            </div>
          </div> */}

          <div ref={listRef} className="flex flex-col gap-4">
            {sortedFeedbacks.map((f) => (
              <div key={f.id} data-gsap-card>
                <FeedbackCard
                  feedback={{
                    id: f.id,
                    title: f.title,
                    description: f.description,
                    authorName: f.author,
                    feedbackType: f.category,
                    createdAt: f.createdAt,
                    upvotes: f.upvotes,
                    downvotes: f.downvotes,
                    comments: f.comments,
                    companyName: f.reachedTo?.[0]?.name || 'a company',
                    companyAvatar: f.reachedTo?.[0]?.avatar,
                    companySlug: f.reachedTo?.[0]?.slug,
                    companyIsApproved: f.reachedTo?.[0]?.isApproved,
                    status: f.status,
                  }}
                  detailHref={`/request/${f.id}`}
                  discussionHref={`/request/${f.id}#discussions`}
                  shareUrl={`${window.location.origin}/request/${f.id}`}
                  showStatus
                  userVote={
                    voteSelections[f.id] ??
                    (!isAuthenticated
                      ? getGuestVote(`feedback:${Number.parseInt(f.id, 10)}`)
                      : null) ??
                    f.userVote ??
                    null
                  }
                  onUpvote={() => void incrementVote(f.id, 'up')}
                  onDownvote={() => void incrementVote(f.id, 'down')}
                />
              </div>
            ))}
          </div>
        </main>

        <aside ref={asideRef} className="hidden lg:block space-y-4">
          <div
            data-gsap-aside
            className="bg-card-bg border border-border rounded-xl p-5 shadow-none"
          >
            {/* <h3 className="text-sm font-bold text-base-200 mb-2 uppercase tracking-wider text-[11px]">
              Platform Overview
            </h3>
            <p className="text-sm text-base-100 mb-4 leading-relaxed">
              Help companies build better products. Upvote the features you care about or request
              new ones directly from the teams who can build them.
            </p>
            <div className="flex justify-between text-center pb-4 mb-4 border-b border-border">
              <div>
                <div className="text-lg font-bold">{boardFeedbacks.length}</div>
                <div className="text-xs text-base-100">Requests</div>
              </div>
              <div>
                <div className="text-lg font-bold">{totalCompanies.toLocaleString()}</div>
                <div className="text-xs text-base-100">Companies</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center pb-4 mb-4 border-b border-border">
              <div>
                <div className="text-lg font-bold text-base-200">
                  {totalUpvotes.toLocaleString()}
                </div>
                <div className="text-xs text-base-100">Total Upvotes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-base-200">
                  {totalDownvotes.toLocaleString()}
                </div>
                <div className="text-xs text-base-100">Total Downvotes</div>
              </div>
            </div> */}
            <Button type="button" onClick={handleRequestFeature} className="w-full">
              Provide Feedback
            </Button>
          </div>

          <div
            data-gsap-aside
            className="bg-card-bg border border-border rounded-xl p-5 shadow-none"
          >
            <h3 className="text-sm font-bold text-base-200 mb-3 uppercase tracking-wider text-[11px]">
              Recent Feedbacks
            </h3>
            <div className="flex flex-col gap-1">
              {sortedFeedbacks.slice(0, 3).map((f) => (
                <Link
                  to={`/request/${f.id}`}
                  key={`recent-${f.id}`}
                  className="group cursor-pointer rounded-lg px-3 py-1.5 hover:bg-border/40 transition-colors"
                >
                  <div className="text-xs text-base-100 mb-1">
                    {f.upvotes} upvotes - {f.comments} comments
                  </div>
                  <h4 className="text-sm font-medium text-base-200 group-hover:text-primary-500 line-clamp-2 leading-snug">
                    {f.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>

          <div
            data-gsap-aside
            className="bg-card-bg border border-border rounded-xl p-5 shadow-none"
          >
            <h3 className="text-sm font-bold text-base-200 mb-3 uppercase tracking-wider text-[11px]">
              Top Companies
            </h3>
            <div className="flex flex-col gap-1">
              {topCompanies.map((company) => (
                <Link
                  to={`/${company.slug ?? company.name.toLowerCase()}`}
                  key={company.slug ?? company.name}
                  className="group flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-border/40 transition-colors"
                >
                  <Avatar name={company.name} avatar={company.avatar} />
                  <div className="flex-1 text-sm font-medium text-base-200">{company.name}</div>
                  <div className="text-xs text-base-100 font-medium">{company.count}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

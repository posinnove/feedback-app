export type MotionProfileName = 'subtle' | 'balanced' | 'expressive'

type MotionSettings = {
  route: { y: number; duration: number; stagger: number }
  header: {
    actions: { y: number; duration: number; stagger: number }
  }
  sidebar: {
    drawerItems: { x: number; duration: number; stagger: number }
  }
  board: {
    reveal: { y: number; duration: number }
    cards: { y: number; duration: number; stagger: number }
    aside: { y: number; duration: number; stagger: number }
  }
  auth: {
    reveal: { y: number; duration: number }
    content: { y: number; duration: number; stagger: number; delay: number }
  }
}

const MOTION_PROFILES: Record<MotionProfileName, MotionSettings> = {
  subtle: {
    route: { y: 8, duration: 0.24, stagger: 0.02 },
    header: {
      actions: { y: 6, duration: 0.2, stagger: 0.02 },
    },
    sidebar: {
      drawerItems: { x: 10, duration: 0.22, stagger: 0.025 },
    },
    board: {
      reveal: { y: 6, duration: 0.22 },
      cards: { y: 10, duration: 0.24, stagger: 0.03 },
      aside: { y: 8, duration: 0.22, stagger: 0.04 },
    },
    auth: {
      reveal: { y: 10, duration: 0.2 },
      content: { y: 8, duration: 0.2, stagger: 0.03, delay: 0.02 },
    },
  },
  balanced: {
    route: { y: 12, duration: 0.32, stagger: 0.03 },
    header: {
      actions: { y: 8, duration: 0.24, stagger: 0.025 },
    },
    sidebar: {
      drawerItems: { x: 14, duration: 0.28, stagger: 0.03 },
    },
    board: {
      reveal: { y: 8, duration: 0.28 },
      cards: { y: 14, duration: 0.34, stagger: 0.045 },
      aside: { y: 10, duration: 0.3, stagger: 0.06 },
    },
    auth: {
      reveal: { y: 14, duration: 0.26 },
      content: { y: 10, duration: 0.24, stagger: 0.04, delay: 0.03 },
    },
  },
  expressive: {
    route: { y: 16, duration: 0.4, stagger: 0.04 },
    header: {
      actions: { y: 10, duration: 0.3, stagger: 0.03 },
    },
    sidebar: {
      drawerItems: { x: 18, duration: 0.34, stagger: 0.04 },
    },
    board: {
      reveal: { y: 12, duration: 0.34 },
      cards: { y: 18, duration: 0.42, stagger: 0.055 },
      aside: { y: 14, duration: 0.36, stagger: 0.07 },
    },
    auth: {
      reveal: { y: 18, duration: 0.3 },
      content: { y: 14, duration: 0.28, stagger: 0.05, delay: 0.04 },
    },
  },
}

// Change this one value to tune the entire app animation personality.
export const ACTIVE_MOTION_PROFILE: MotionProfileName = 'subtle'

export const motionProfile = MOTION_PROFILES[ACTIVE_MOTION_PROFILE]

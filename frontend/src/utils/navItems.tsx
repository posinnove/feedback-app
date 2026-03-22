import {
  IconHome,
  // IconStar,
  IconCompass,
  IconLayoutKanban,
  // IconList,
} from '@tabler/icons-react'

export const NAV_ITEMS = [
  { label: 'Home', path: '/feed', icon: <IconHome size={20} stroke={1.5} /> },
  // { label: 'Popular', path: '/popular', icon: <IconStar size={20} stroke={1.5} /> },
  { label: 'Explore Companies', path: '/explore', icon: <IconCompass size={20} stroke={1.5} /> },
  // { label: 'All', path: '/all', icon: <IconList size={20} stroke={1.5} /> },
]

export const KANBAN_NAV_ITEM = {
  label: 'Kanban',
  path: '/portal-kanban',
  icon: <IconLayoutKanban size={20} stroke={1.5} />,
}

import {
  IconHome2,
  IconBuildingStore,
  IconLayoutColumns,
} from '@tabler/icons-react'

export const NAV_ITEMS = [
  { label: 'Home', path: '/feed', icon: <IconHome2 size={20} stroke={1.5} /> },
  { label: 'Explore Companies', path: '/explore', icon: <IconBuildingStore size={20} stroke={1.5} /> },
]

export const KANBAN_NAV_ITEM = {
  label: 'Kanban',
  path: '/portal-kanban',
  icon: <IconLayoutColumns size={20} stroke={1.5} />,
}

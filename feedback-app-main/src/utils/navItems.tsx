import {
    IconHome,
    IconStar,
    IconCompass,
    IconList,
} from '@tabler/icons-react'

export const NAV_ITEMS = [
    { label: 'Home', path: '/', icon: <IconHome size={20} stroke={1.5} /> },
    { label: 'Popular', path: '/popular', icon: <IconStar size={20} stroke={1.5} /> },
    { label: 'Explore', path: '/explore', icon: <IconCompass size={20} stroke={1.5} /> },
    { label: 'All', path: '/all', icon: <IconList size={20} stroke={1.5} /> },
]

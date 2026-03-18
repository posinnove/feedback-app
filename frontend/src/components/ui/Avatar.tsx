interface AvatarProps {
  name: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-6 h-6 text-xs',
  lg: 'w-8 h-8 text-sm',
}

const colors = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-cyan-600',
]

export default function Avatar({ name, avatar, size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const sizeClass = sizeClasses[size]

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClass} rounded-full object-cover shrink-0 ring-2 ring-card-bg`}
      />
    )
  }

  const colorIndex = name.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div
      className={`${sizeClass} rounded-full ${bgColor} text-white flex items-center justify-center font-medium shrink-0 ring-2 ring-card-bg`}
      title={name}
    >
      {initials}
    </div>
  )
}

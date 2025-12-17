interface InitialsAvatarProps {
  name?: string | null
  size?: number
}

export default function InitialsAvatar({
  name,
  size = 36,
}: InitialsAvatarProps) {
  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'

  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  )
}

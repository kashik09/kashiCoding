interface ProgressBarProps {
  value: number
  className?: string
  label?: string
}

export function ProgressBar({ value, className = '', label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 w-full rounded-full bg-base-200/60 border border-base-content/20 shadow-inner overflow-hidden"
      >
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

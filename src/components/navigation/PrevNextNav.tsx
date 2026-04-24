import Link from 'next/link'
import { cn } from '@/lib/utils'

export type NavTarget = {
  href: string
  label: string
  sublabel?: string
}

type Props = {
  prev: NavTarget | null
  next: NavTarget | null
  prevDisabled?: boolean
  nextDisabled?: boolean
  prevDisabledReason?: string
  nextDisabledReason?: string
  className?: string
}

const baseButtonClasses =
  'inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors'
const enabledClasses = 'hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
const disabledClasses = 'cursor-not-allowed opacity-60 pointer-events-none'

function ChevronLeft() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  )
}

type SideProps = {
  target: NavTarget | null
  disabled: boolean
  reason?: string
  direction: 'prev' | 'next'
}

function NavSide({ target, disabled, reason, direction }: SideProps) {
  if (!target) return <span className="w-0" />

  const content =
    direction === 'prev' ? (
      <>
        <ChevronLeft />
        <span className="flex flex-col items-start leading-tight">
          <span>{target.label}</span>
          {target.sublabel && (
            <span className="text-xs font-normal text-gray-500">{target.sublabel}</span>
          )}
        </span>
      </>
    ) : (
      <>
        <span className="flex flex-col items-end leading-tight">
          <span>{target.label}</span>
          {target.sublabel && (
            <span className="text-xs font-normal text-gray-500">{target.sublabel}</span>
          )}
        </span>
        <ChevronRight />
      </>
    )

  if (disabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        tabIndex={-1}
        title={reason}
        className={cn(baseButtonClasses, disabledClasses)}
      >
        {content}
      </span>
    )
  }

  return (
    <Link
      href={target.href}
      className={cn(baseButtonClasses, enabledClasses)}
    >
      {content}
    </Link>
  )
}

export function PrevNextNav({
  prev,
  next,
  prevDisabled = false,
  nextDisabled = false,
  prevDisabledReason,
  nextDisabledReason,
  className,
}: Props) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <NavSide
        target={prev}
        disabled={prevDisabled}
        reason={prevDisabledReason}
        direction="prev"
      />
      <NavSide
        target={next}
        disabled={nextDisabled}
        reason={nextDisabledReason}
        direction="next"
      />
    </div>
  )
}

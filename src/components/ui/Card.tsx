import { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: Props) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-border bg-card text-card-foreground p-5 shadow-sm ${className}`}
    />
  )
}

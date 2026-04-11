import { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: Props) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    />
  )
}

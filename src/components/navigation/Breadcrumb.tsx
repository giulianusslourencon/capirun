import Link from 'next/link'

export type BreadcrumbItem = { label: string; href?: string }

type Props = {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: Props) {
  return (
    <nav
      aria-label="breadcrumb"
      className="mb-4 flex flex-wrap items-center gap-1.5 text-sm"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900">{item.label}</span>
            )}
            {!isLast && (
              <span aria-hidden="true" className="text-gray-400">
                ›
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

type Props = {
  children: React.ReactNode
  title?: string
}

export function PageWrapper({ children, title }: Props) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      {title && <h1 className="mb-6 text-2xl font-bold text-foreground">{title}</h1>}
      {children}
    </main>
  )
}

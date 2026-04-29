'use client'

export function IntroTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('show-intro'))}
      className="text-sm text-muted-foreground underline hover:text-foreground"
    >
      Reler introdução
    </button>
  )
}

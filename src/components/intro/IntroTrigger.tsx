'use client'

export function IntroTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('show-intro'))}
      className="text-sm text-gray-500 underline hover:text-gray-700"
    >
      Reler introdução
    </button>
  )
}

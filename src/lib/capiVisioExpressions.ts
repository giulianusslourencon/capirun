export type CapiVisioExpression =
  | 'calm'
  | 'curious'
  | 'focused'
  | 'frustrated'
  | 'stressed'
  | 'determined'
  | 'relieved'
  | 'celebrating'
  | 'confused'
  | 'sleuth'

export type AvatarGifKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'friday_sleuth'

export const CAPIVISIO_EXPRESS_EVENT = 'capivisio:express' as const

export type CapiVisioExpressDetail = {
  expression: CapiVisioExpression
  duration?: number
}

export function fireCapiVisioExpression(
  expression: CapiVisioExpression,
  duration = 1500,
) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<CapiVisioExpressDetail>(CAPIVISIO_EXPRESS_EVENT, {
      detail: { expression, duration },
    }),
  )
}

import type { DayMood, FridayPressure } from '@/lib/capiVisioMood'

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

export const PRESSURE_INTENSITY: Record<FridayPressure, number> = {
  leve: 0.15,
  moderada: 0.35,
  forte: 0.55,
  urgente: 0.75,
  critica: 0.95,
}

export function expressionFromMood(
  mood: Pick<DayMood, 'defaultExpression' | 'intensity'>
): { expression: CapiVisioExpression; intensity: number } {
  return { expression: mood.defaultExpression, intensity: mood.intensity }
}

export const CAPIVISIO_EXPRESS_EVENT = 'capivisio:express' as const

export type CapiVisioExpressDetail = {
  expression: CapiVisioExpression
  duration?: number
}

export function fireCapiVisioExpression(
  expression: CapiVisioExpression,
  duration = 1500
) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<CapiVisioExpressDetail>(CAPIVISIO_EXPRESS_EVENT, {
      detail: { expression, duration },
    })
  )
}

type ExpressionParams = {
  browLeftRot: number
  browRightRot: number
  browLeftY: number
  browRightY: number
  eyeScaleY: number
  eyeScaleYLeft?: number
  eyeScaleYRight?: number
  mouthPath: string
  sweatOpacity: number
  cheekOpacity: number
  headTilt: number
}

const BASE: ExpressionParams = {
  browLeftRot: 0,
  browRightRot: 0,
  browLeftY: 0,
  browRightY: 0,
  eyeScaleY: 1,
  mouthPath: 'M 44 66 Q 50 68 56 66',
  sweatOpacity: 0,
  cheekOpacity: 0,
  headTilt: 0,
}

const EXPRESSIONS: Record<CapiVisioExpression, ExpressionParams> = {
  calm: { ...BASE },
  curious: {
    ...BASE,
    browLeftRot: -10,
    browRightRot: 8,
    browLeftY: -1,
    eyeScaleY: 1.1,
    mouthPath: 'M 45 66 Q 50 67 55 66',
    headTilt: 5,
  },
  focused: {
    ...BASE,
    browLeftRot: 8,
    browRightRot: -8,
    browLeftY: 1,
    browRightY: 1,
    eyeScaleY: 0.85,
    mouthPath: 'M 45 67 L 55 67',
  },
  frustrated: {
    ...BASE,
    browLeftRot: 18,
    browRightRot: -18,
    browLeftY: 2,
    browRightY: 2,
    eyeScaleY: 0.7,
    mouthPath: 'M 44 68 Q 50 66 56 68',
  },
  stressed: {
    ...BASE,
    browLeftRot: 14,
    browRightRot: -14,
    browLeftY: -2,
    browRightY: -2,
    eyeScaleY: 1.15,
    mouthPath: 'M 44 69 Q 50 67 56 69',
    sweatOpacity: 1,
    headTilt: -2,
  },
  determined: {
    ...BASE,
    browLeftRot: 10,
    browRightRot: -10,
    browLeftY: 2,
    browRightY: 2,
    eyeScaleY: 0.75,
    mouthPath: 'M 44 67 Q 50 69 56 67',
  },
  relieved: {
    ...BASE,
    browLeftRot: -4,
    browRightRot: 4,
    browLeftY: -1,
    browRightY: -1,
    eyeScaleY: 0.4,
    mouthPath: 'M 43 66 Q 50 71 57 66',
    cheekOpacity: 0.5,
  },
  celebrating: {
    ...BASE,
    browLeftRot: -6,
    browRightRot: 6,
    browLeftY: -3,
    browRightY: -3,
    eyeScaleY: 0.3,
    mouthPath: 'M 42 65 Q 50 74 58 65',
    cheekOpacity: 0.7,
    headTilt: 3,
  },
  confused: {
    ...BASE,
    browLeftRot: -14,
    browRightRot: -4,
    browLeftY: -3,
    browRightY: 1,
    eyeScaleYLeft: 1.2,
    eyeScaleYRight: 0.8,
    eyeScaleY: 1,
    mouthPath: 'M 44 68 Q 47 66 50 68 T 56 68',
    headTilt: -6,
  },
}

export function getExpressionParams(
  expression: CapiVisioExpression,
  intensity: number
): ExpressionParams {
  const base = EXPRESSIONS[expression]
  const clamp = Math.max(0, Math.min(1, intensity))

  const isPressure =
    expression === 'focused' ||
    expression === 'frustrated' ||
    expression === 'stressed' ||
    expression === 'determined'

  if (!isPressure) return base

  const scale = 0.4 + clamp * 0.6

  return {
    ...base,
    browLeftRot: base.browLeftRot * scale,
    browRightRot: base.browRightRot * scale,
    browLeftY: base.browLeftY * scale,
    browRightY: base.browRightY * scale,
    sweatOpacity: base.sweatOpacity * clamp,
    headTilt: base.headTilt * scale,
  }
}

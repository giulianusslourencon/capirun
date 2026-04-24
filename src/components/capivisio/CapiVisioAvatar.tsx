'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  getExpressionParams,
  type CapiVisioExpression,
} from '@/lib/capiVisioExpressions'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  expression: CapiVisioExpression
  intensity: number
  size?: Size
  className?: string
}

const SIZE_PX: Record<Size, number> = { sm: 22, md: 52, lg: 96 }

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 18,
}

export function CapiVisioAvatar({
  expression,
  intensity,
  size = 'md',
  className,
}: Props) {
  const reduce = useReducedMotion()
  const px = SIZE_PX[size]
  const params = getExpressionParams(expression, intensity)

  const eyeSY = params.eyeScaleY
  const eyeSYLeft = params.eyeScaleYLeft ?? eyeSY
  const eyeSYRight = params.eyeScaleYRight ?? eyeSY

  const idleBody = reduce
    ? {}
    : {
        scaleY: [1, 1.015, 1],
        transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' as const },
      }

  const idleTail = reduce
    ? {}
    : {
        rotate: [0, 10, -6, 0],
        transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const },
      }

  const blink = reduce
    ? {}
    : {
        scaleY: [eyeSY, eyeSY, 0.05, eyeSY],
        transition: {
          duration: 4.2,
          times: [0, 0.92, 0.96, 1],
          repeat: Infinity,
          ease: 'linear' as const,
        },
      }

  const blinkLeft = reduce
    ? {}
    : {
        ...blink,
        scaleY: [eyeSYLeft, eyeSYLeft, 0.05, eyeSYLeft],
      }

  const blinkRight = reduce
    ? {}
    : {
        ...blink,
        scaleY: [eyeSYRight, eyeSYRight, 0.05, eyeSYRight],
      }

  return (
    <motion.svg
      role="img"
      aria-hidden
      viewBox="0 0 100 100"
      width={px}
      height={px}
      className={className}
      animate={{ rotate: params.headTilt }}
      transition={TRANSITION}
      style={{ originX: 0.5, originY: 0.6, overflow: 'visible' }}
    >
      <motion.g animate={idleBody} style={{ originX: 0.5, originY: 0.9 }}>
        {/* tail — behind body */}
        <motion.ellipse
          cx={18}
          cy={72}
          rx={6}
          ry={4}
          fill="#8b6340"
          animate={idleTail}
          style={{ originX: 0.5, originY: 0.5 }}
        />

        {/* ears */}
        <ellipse cx={28} cy={28} rx={8} ry={7} fill="#8b6340" />
        <ellipse cx={72} cy={28} rx={8} ry={7} fill="#8b6340" />
        <ellipse cx={28} cy={29} rx={4} ry={3.5} fill="#c49a7a" />
        <ellipse cx={72} cy={29} rx={4} ry={3.5} fill="#c49a7a" />

        {/* head */}
        <ellipse cx={50} cy={52} rx={34} ry={30} fill="#a87b54" />

        {/* snout / lighter belly area */}
        <ellipse cx={50} cy={66} rx={18} ry={12} fill="#c49a7a" />

        {/* cheeks (pink blush) */}
        <ellipse
          cx={28}
          cy={62}
          rx={5}
          ry={3}
          fill="#f4a99b"
          style={{ opacity: params.cheekOpacity }}
        />
        <ellipse
          cx={72}
          cy={62}
          rx={5}
          ry={3}
          fill="#f4a99b"
          style={{ opacity: params.cheekOpacity }}
        />

        {/* eyes */}
        <motion.ellipse
          cx={38}
          cy={50}
          rx={3.2}
          ry={4.2}
          fill="#2a1d12"
          animate={blinkLeft}
          style={{ originX: 0.5, originY: 0.5 }}
        />
        <motion.ellipse
          cx={62}
          cy={50}
          rx={3.2}
          ry={4.2}
          fill="#2a1d12"
          animate={blinkRight}
          style={{ originX: 0.5, originY: 0.5 }}
        />
        {/* eye glints */}
        <circle cx={39.2} cy={48.5} r={0.9} fill="#ffffff" />
        <circle cx={63.2} cy={48.5} r={0.9} fill="#ffffff" />

        {/* brows */}
        <motion.rect
          x={30}
          y={40}
          width={12}
          height={2.2}
          rx={1.1}
          fill="#5a3f24"
          initial={{ rotate: 0, y: 0 }}
          animate={{
            rotate: params.browLeftRot,
            y: params.browLeftY,
          }}
          transition={TRANSITION}
          style={{ originX: 0.5, originY: 0.5 }}
        />
        <motion.rect
          x={58}
          y={40}
          width={12}
          height={2.2}
          rx={1.1}
          fill="#5a3f24"
          initial={{ rotate: 0, y: 0 }}
          animate={{
            rotate: params.browRightRot,
            y: params.browRightY,
          }}
          transition={TRANSITION}
          style={{ originX: 0.5, originY: 0.5 }}
        />

        {/* nose */}
        <ellipse cx={50} cy={60} rx={2.4} ry={1.6} fill="#2a1d12" />

        {/* mouth */}
        <path
          d={params.mouthPath}
          fill="none"
          stroke="#2a1d12"
          strokeWidth={1.8}
          strokeLinecap="round"
        />

        {/* sweat drop — only visible at high intensity / stress */}
        <motion.path
          d="M 84 40 Q 81 46 84 48 Q 87 46 84 40 Z"
          fill="#60a5fa"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: params.sweatOpacity,
            y: reduce ? 0 : [0, 2, 0],
          }}
          transition={
            reduce
              ? TRANSITION
              : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const }
          }
        />
      </motion.g>
    </motion.svg>
  )
}

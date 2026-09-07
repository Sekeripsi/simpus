/**
 * Icon Component
 *
 * A reusable wrapper for Lucide React icons with standardized sizes and colors.
 * Provides consistent icon styling across the SIMPUS application.
 *
 * @example
 * // Default usage (medium size, default color)
 * <Icon icon={User} />
 *
 * @example
 * // With props
 * <Icon icon={CheckCircle2} size="lg" color="success" />
 *
 * @example
 * // With custom className
 * <Icon icon={AlertCircle} size="md" color="destructive" className="mr-2" />
 */

import React from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface IconProps {
  /**
   * The Lucide React icon component to render
   * @example: User, Mail, Settings, etc.
   */
  icon: LucideIcon

  /**
   * Icon size preset
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  /**
   * Icon color semantic variant
   * @default 'default'
   */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'muted' | 'white' | 'inherit'

  /**
   * Additional CSS classes to apply
   */
  className?: string

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string

  /**
   * Whether the icon is decorative (sets aria-hidden)
   * @default false
   */
  decorative?: boolean

  /**
   * Optional click handler for interactive icons
   */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
}

/**
 * Size map: converts semantic size names to Tailwind classes
 * These match common icon sizing patterns:
 * - xs: 12px (h-3 w-3)
 * - sm: 16px (h-4 w-4)
 * - md: 20px (h-5 w-5) — default, matches form inputs
 * - lg: 24px (h-6 w-6)
 * - xl: 32px (h-8 w-8)
 */
const sizeVariants: Record<Required<IconProps>['size'], string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
}

/**
 * Color map: converts semantic color names to Tailwind text color classes
 * Uses theme tokens from globals.css CSS variables
 */
const colorVariants: Record<Required<IconProps>['color'] | 'inherit', string> = {
  default: 'text-foreground',
  primary: 'text-primary-500',
  success: 'text-green-500',
  warning: 'text-amber-500',
  destructive: 'text-destructive',
  muted: 'text-muted-foreground',
  white: 'text-white',
  inherit: '',
}

/**
 * Icon Component
 *
 * Renders a Lucide React icon with consistent styling, sizing, and colors.
 * Supports semantic sizing and coloring for predictable usage across the app.
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      icon: LucideIcon,
      size = 'md',
      color = 'inherit',
      className,
      ariaLabel,
      decorative = false,
      onClick,
    },
    ref
  ) => {
    const sizeClass = sizeVariants[size]
    const colorClass = colorVariants[color]

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        aria-label={ariaLabel}
        aria-hidden={decorative}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                const mouseEvent = new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                }) as unknown as React.MouseEvent<HTMLSpanElement>
                onClick(mouseEvent)
              }
            }
            : undefined
        }
      >
        <LucideIcon className={cn(sizeClass, colorClass, 'shrink-0')} />
      </span>
    )
  }
)

Icon.displayName = 'Icon'

export * from './presets'

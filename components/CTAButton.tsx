'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CTAButtonProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  icon?: 'arrow-right' | 'arrow-left' | 'none'
  className?: string
}

export default function CTAButton({ 
  href, 
  onClick, 
  children, 
  variant = 'primary',
  icon = 'arrow-right',
  className = ''
}: CTAButtonProps) {
  const baseClasses = `
    inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium
    transition-all duration-300 transform hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${className}
  `

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blood-600 to-eerie-600 
      text-white shadow-lg hover:shadow-xl
      focus:ring-blood-500 animate-glow
      border border-blood-500/30
    `,
    secondary: `
      bg-transparent border-2 border-blood-500 
      text-blood-500 hover:bg-blood-500 hover:text-white
      focus:ring-blood-500
    `
  }

  const iconComponent = {
    'arrow-right': <ArrowRight className="w-4 h-4" />,
    'arrow-left': <ArrowLeft className="w-4 h-4" />,
    'none': null
  }

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
      {iconComponent[icon]}
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href}>
        {buttonContent}
      </Link>
    )
  }

  return (
    <button onClick={onClick}>
      {buttonContent}
    </button>
  )
} 
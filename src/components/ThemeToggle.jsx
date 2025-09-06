import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

/**
 * Theme toggle component for switching between dark and light modes
 * Features smooth animations and beautiful visual feedback
 */
const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 bg-muted border border-border rounded-full p-1 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="absolute top-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg z-10"
        animate={{
          x: isDark ? 0 : 24,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-primary-foreground" />
        ) : (
          <Sun className="w-3 h-3 text-primary-foreground" />
        )}
      </motion.div>
      
      {/* Background icons for visual context */}
      <div className="flex items-center justify-between px-2 h-full absolute inset-0">
        <Moon 
          className={`w-3 h-3 transition-opacity duration-300 ${
            isDark ? 'opacity-0' : 'opacity-60'
          }`} 
        />
        <Sun 
          className={`w-3 h-3 transition-opacity duration-300 ${
            isDark ? 'opacity-60' : 'opacity-0'
          }`} 
        />
      </div>
    </motion.button>
  )
}

export default ThemeToggle

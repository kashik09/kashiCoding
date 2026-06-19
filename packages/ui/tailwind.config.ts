import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--ui-background) / <alpha-value>)',
        foreground: 'oklch(var(--ui-foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'oklch(var(--ui-card) / <alpha-value>)',
          foreground: 'oklch(var(--ui-card-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'oklch(var(--ui-primary) / <alpha-value>)',
          foreground: 'oklch(var(--ui-primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--ui-secondary) / <alpha-value>)',
          foreground: 'oklch(var(--ui-secondary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--ui-accent) / <alpha-value>)',
          foreground: 'oklch(var(--ui-accent-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--ui-muted) / <alpha-value>)',
          foreground: 'oklch(var(--ui-muted-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--ui-destructive) / <alpha-value>)',
          foreground: 'oklch(var(--ui-destructive-foreground) / <alpha-value>)',
        },
        success: 'oklch(var(--ui-success) / <alpha-value>)',
        warning: 'oklch(var(--ui-warning) / <alpha-value>)',
        info: 'oklch(var(--ui-info) / <alpha-value>)',
        border: 'oklch(var(--ui-border) / <alpha-value>)',
        input: 'oklch(var(--ui-input) / <alpha-value>)',
        ring: 'oklch(var(--ui-ring) / <alpha-value>)',
      },
      borderRadius: {
        xl: 'calc(var(--ui-radius) + 4px)',
        lg: 'var(--ui-radius)',
        md: 'calc(var(--ui-radius) - 2px)',
        sm: 'calc(var(--ui-radius) - 4px)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-fade': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 300ms ease-out',
        'fade-in': 'fade-in 200ms ease-out',
        'zoom-in': 'zoom-in 200ms ease-out',
        'slide-fade': 'slide-fade 300ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

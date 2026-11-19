/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // CivicSaarthi Design Tokens
        primary: {
          DEFAULT: "#142B4A",
          50: "#E8EDF3",
          100: "#C5D1E2",
          200: "#9FB3CE",
          300: "#7994B9",
          400: "#5A7BA9",
          500: "#3C6199",
          600: "#2A4E82",
          700: "#1E3D6B",
          800: "#142B4A",
          900: "#0C1D33",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#0F8B8D",
          50: "#E0F5F5",
          100: "#B3E6E7",
          200: "#82D6D7",
          300: "#50C6C7",
          400: "#2CB9BB",
          500: "#0F8B8D",
          600: "#0D7C7E",
          700: "#0A6B6C",
          800: "#085A5B",
          900: "#053E3F",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F2A541",
          50: "#FEF4E6",
          100: "#FDE3BC",
          200: "#FBD192",
          300: "#F9BF68",
          400: "#F8B24A",
          500: "#F2A541",
          600: "#E09030",
          700: "#C97A20",
          800: "#B26413",
          900: "#8A4A08",
          foreground: "#1A1A1A",
        },
        background: {
          DEFAULT: "#F5F7FA",
          card: "#FFFFFF",
          subtle: "#EEF0F5",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Status Colors
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#D97706",
          light: "#FEF3C7",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
          foreground: "#FFFFFF",
        },
        info: {
          DEFAULT: "#2563EB",
          light: "#DBEAFE",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        telugu: ["Noto Sans Telugu", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.06)",
        "nav": "0 1px 0 0 rgba(0,0,0,0.08)",
        "modal": "0 20px 60px -10px rgba(0,0,0,0.3)",
        "glow-primary": "0 0 20px rgba(20,43,74,0.2)",
        "glow-secondary": "0 0 20px rgba(15,139,141,0.2)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #142B4A 0%, #1E3D6B 100%)",
        "gradient-secondary": "linear-gradient(135deg, #0F8B8D 0%, #0A6B6C 100%)",
        "gradient-accent": "linear-gradient(135deg, #F2A541 0%, #E09030 100%)",
        "gradient-hero": "linear-gradient(135deg, #142B4A 0%, #0F8B8D 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(20,43,74,0.03) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "shimmer": {
          from: { backgroundPosition: "-200px 0" },
          to: { backgroundPosition: "calc(200px + 100%) 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

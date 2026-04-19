import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#7C3AED", // Vibrant Purple
          blue: "#3B82F6",    // Classic Blue
          purple: "#6D28D9",  // Deep Purple
          foreground: "#FFFFFF",
        },
        sidebar: {
          DEFAULT: "#450A0A", // Deep Maroon
          foreground: "#FDF2F2", // Very Light Maroon/White
        },
        status: {
          success: "#10B981", // Emerald Green
          warning: "#FBBF24", // Sunflower Yellow
          error: "#991B1B",   // Maroon / Red-Dark
          info: "#3B82F6",    // Blue
        },
        neutral: {
          light: "#F8FAFC",   // Off White
          medium: "#64748B",  // Slate Gray
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;

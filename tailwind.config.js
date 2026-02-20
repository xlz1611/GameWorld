/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.1448 0.0046 264.4734)',
        foreground: 'oklch(0.9093 0.0069 255.5078)',
        primary: 'oklch(0.8664 0.2948 142.4911)',
        secondary: 'oklch(0.6089 0.1868 29.2339)',
        accent: 'oklch(0.7107 0.1918 49.5519)',
        muted: 'oklch(0.2686 0.0055 260.0310)',
        border: 'oklch(0.2795 0.0069 268.8777)',
      },
    },
  },
  plugins: [],
}
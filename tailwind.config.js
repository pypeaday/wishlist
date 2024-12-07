module.exports = {
  darkMode: 'class',
  content: [
    './**/*.html',
    './**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          light: {
            bg: '#f5f5f4',
            surface: '#ffffff',
            surfaceAlt: '#f0f0ef',
            primary: '#5c7b9a',
            secondary: '#83a598',
            text: '#3c4148',
            textMuted: '#6e7681',
            accent: '#7c6f64',
            border: '#e5e5e4',
            success: '#98971a',
            warning: '#d79921',
            danger: '#cc6666'
          },
          dark: {
            bg: '#171923',           // Deep space blue
            surface: '#2A313C',      // Lighter space blue
            surfaceAlt: '#3B4252',   // Nord-inspired hover state
            primary: '#81A1C1',      // Soft nordic blue
            secondary: '#88C0D0',    // Lighter nordic blue
            text: '#ECEFF4',         // Nordic snow white
            textMuted: '#D8DEE9',    // Softer snow white
            accent: '#B48EAD',       // Soft purple
            border: '#434C5E',       // Distinct but soft border
            success: '#A3BE8C',      // Soft green
            warning: '#EBCB8B',      // Soft yellow
            danger: '#BF616A'        // Soft red
          }
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom right, #171923, #2E3440)',
        'gradient-surface': 'linear-gradient(to bottom right, #2A313C, #3B4252)'
      },
      boxShadow: {
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        'dark-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'dark-glow': '0 0 15px rgba(136, 192, 208, 0.1), 0 0 3px rgba(136, 192, 208, 0.05)'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

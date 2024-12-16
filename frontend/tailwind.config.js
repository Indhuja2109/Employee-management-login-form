module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        'primary-dark': '#357ABD',
        secondary: '#F5A623',
        sky: {
          100: '#E0F7FA',
          200: '#B2EBF2', 
        },
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1.5rem',
      },
      // Disable default focus and hover effects on form elements
      backgroundColor: {
        'input-hover': '#E0F7FA', // Custom hover color, you can set it as per your need
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    extend: {
      colors: {
        primary: "#F38820",
        "red-main": "#D64457",
        "black-main": "#0F1824",
        "gray-main": "#A3A8AF",
        "custom-orange": "rgba(255, 92, 0, 1)",
        "auth-bg": "rgba(255, 236, 225, 1)",
      },
      height: {
        "full-screen": "100vh",
      },
      backgroundImage: (theme) => ({
        banner: "url('/assets/images/jpg/banner1.jpg')",
      }),
    },
    screens: {
      "2xs": "290px",
      xs: "430px",
      sm: "550px",
      md: "769px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1520px",
      "3xl": "1920px",
    },
  },
  plugins: [],
};

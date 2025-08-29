/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        nt_regular: ["NataRegular", "sans-serif"],
        nt_medium: ["NataMedium", "sans-serif"],
        nt_semi: ["NataSemiBold", "sans-serif"],
        nt_bold: ["NataBold", "sans-serif"],
        cb: ["CherryRegular", "sans-serif"],
        jersey: ["JerseyRegular", "sans-serif"],
        funnel_regular: ["FunnelRegular", "sans-serif"],
        funnel_semi: ["FunnelSemibold", "sans-serif"],
        funnel_medium: ["FunnelMedium", "sans-serif"],
        funnel_bold: ["FunnelBold", "sans-serif"]
      },
    },
  },
  plugins: [],
}
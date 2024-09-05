/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainTxt: "rgb(215, 215, 215)",
        subTxt: "rgb(185, 184, 184)",
        boldTxt: "rgb(0,0,0)",
        mainGreen: "rgb(195, 233, 86)",
        bgColor: "rgb(251, 252, 248)",
        mainGreen: "rgb(195, 233, 86)",
        subGreen1: "rgb(77, 113, 17)",
        subGreen2: "rgb(31, 75, 44)",
        bgGreen: "rgb(234, 247, 196)",
      },
    },
  },
  plugins: [require("daisyui")],
};

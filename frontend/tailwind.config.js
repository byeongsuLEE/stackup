/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBlue: "rgb(28, 119, 195)",
        subBlue: "rgb(57, 169, 219)",
        btnBlue: "rgb(64, 188, 216)",
        mainOrange: "rgb(243, 146, 55)",
        mainRed: "rgb(214, 50, 48)",
        mainTxt: "rgb(45, 45, 42)",
        toDoHigh: "rgb(58, 90, 64)",
        toDoMid: "rgb(88, 129, 87)",
        toDoLow: "rgb(163, 177, 138)",
        vacationHigh: "rgb(255, 143, 171)",
        vacationMid: "rgb(255, 179, 198)",
        vacationLow: "rgb(255, 194, 209)",
        vacationBtn: "rgb(251, 111, 146)",
        toDoBtn: "rgb(52, 78, 65)",
        toolBtn: "rgb(0, 128, 0)",
      },
    },
  },
  plugins: [require("daisyui")],
};

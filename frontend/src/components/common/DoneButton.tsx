interface ButtonProps {
  height: number;
  width: number;
  title: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // type 속성 추가
}
const DoneButton = ({ height, width, title, disabled, type="submit" }: ButtonProps) => {
  return (
    <button
      style={{ height: height, width: width }}
      className="bg-mainGreen text-white rounded-lg px-2 font-bold text-sm"
      disabled={disabled}
      type={type}
    >
      {title}
    </button>
  );
};
export default DoneButton;

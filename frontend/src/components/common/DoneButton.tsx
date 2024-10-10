interface ButtonProps {
  height: number;
  width: number;
  title: string;
  disabled?: boolean;
}
const DoneButton = ({ height, width, title, disabled }: ButtonProps) => {
  return (
    <button
      style={{ height: height, width: width }}
      className="bg-mainGreen text-white rounded-lg px-2 font-bold text-sm"
      disabled={disabled}
    >
      {title}
    </button>
  );
};
export default DoneButton;

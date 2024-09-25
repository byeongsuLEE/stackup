interface ButtonProps {
  height: number;
  width: number;
  title: string;
}
const DoneButton = ({ height, width, title }: ButtonProps) => {
  return (
    <button
      style={{ height: height, width: width }}
      className="bg-mainGreen text-white rounded-lg px-2 font-bold text-sm"
    >
      {title}
    </button>
  );
};
export default DoneButton;

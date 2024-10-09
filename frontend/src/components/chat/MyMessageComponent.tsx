interface MyMessageProps {
  message: string;
  registTime : string;
}

const MyMessageComponent = ({ message, registTime }: MyMessageProps) => {
  return (
    <div className="text-right my-2">
        <span className="left-3 top-2 text-sm text-gray-300 mr-3">{registTime}</span>
      <div className="inline-block p-3 bg-subGreen1 text-white rounded-lg m-1.5 relative">
        {message}
      </div>
    </div>
  );
};

export default MyMessageComponent;

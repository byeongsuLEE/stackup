interface OtherMessageProps {
  message: string;
  registTime : string;
}

const OtherMessageComponent = ({ message, registTime }: OtherMessageProps) => {
  return (
    <div className="text-left my-2">
      <div className="inline-block p-3 bg-gray-200 rounded-lg">
        {message}
      </div>
        <span className="left-3 top-2 text-sm text-gray-300">{registTime}</span>
    </div>
  );
};

export default OtherMessageComponent;

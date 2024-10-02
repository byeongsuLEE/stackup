interface AppliedBoxProps {
  title: string;
  company: string;
  period: string;
}

const AppliedBox = ({ title, company, period }: AppliedBoxProps) => {
  return (
    <div className="bg-bgGreen border border-mainGreen h-[150px] w-full rounded-lg p-5 flex justify-between items-center">
      <div className="flex flex-col justify-center">
        <span className="mb-3">{title} _ {company}</span>
        <span>{period}</span>
      </div>
    </div>
  )
}
export default AppliedBox;
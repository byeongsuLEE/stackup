export interface WebIconProps {
  w: number;
  h: number;
}

const WebIcon: React.FC<WebIconProps> = ({w, h}) => {
  return (
    <img style={{ width: `${w}px`, height: `${h}px` }} className="h-[50px] w-[50px]" src="/logos/Web.png" alt="WebIcon" />
  )
}
export default WebIcon;
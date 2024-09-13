interface RecommendIconProps {
  w: number;
  h: number;
}
const RecommendIcon = ({w,h}:RecommendIconProps) =>{
  return (
    <img style={{width:w, height:h}} src="./logos/Recommend.png" alt="" />
  )
}
export default RecommendIcon;
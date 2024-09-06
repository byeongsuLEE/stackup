interface ButtonProps {
  height:number;
  width:number;
  title:string;
}
const Button = ({height,width,title}:ButtonProps)=>{
  return(
    <button
    style={{height:height,width:width}}
    className="bg-mainGreen text-white rounded-md font-bold">{title}</button>
  )
}
export default Button;
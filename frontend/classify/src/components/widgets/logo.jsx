// src/components/Logo.js
import LogoImage from "../../assets/react.svg"
const Logo = () => {
  return (
    <div className="flex justify-center items-center gab-4 cursor-pointer">
      <img src={LogoImage} className="w-8 h-8"/>
      <p className="text-purple-800 text-4xl">Classify</p>
    </div>
  );
}

export default Logo;

// src/components/Navbar.js
import Logo  from './logo';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="p-4 md:px-28 bg-purple-200 flex justify-between">
      <div className="">
        <Logo />
      </div>
      <div className="flex-none">
        <button className=" bg-purple-900  py-[7px] px-[4px] w-[90px] text-white transition-transform transform hover:scale-105">
          <Link to='/signup'>Signup</Link>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

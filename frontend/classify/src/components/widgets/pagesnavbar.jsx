// src/components/Navbar.js
import Logo  from './logo';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="navbar bg-black p-4">
      <div className="flex-1">
        <Logo />
      </div>
      <div className="flex-none">
        <button className="btn btn-white text-purple-800 transition-transform transform hover:scale-105">
          <Link to='/signup'>Signup</Link>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

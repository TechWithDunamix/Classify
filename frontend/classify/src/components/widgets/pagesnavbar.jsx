// src/components/Navbar.js
import Logo  from './logo';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="navbar p-4 md:px-28 bg-purple-200">
      <div className="flex-1">
        <Logo />
      </div>
      <div className="flex-none">
        <button className="btn bg-purple-900 px-12 text-white transition-transform transform hover:scale-105">
          <Link to='/signup'>Signup</Link>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

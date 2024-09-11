import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faBook, faRobot,faUsers, faCalendar, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
export const globalContext = React.createContext()

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const globalContextValues = {
    "sidebarToggle" : setIsCollapsed  
  }
  return (
    <globalContext.Provider value={globalContextValues}>
    <div className="flex h-screen">
      <div className={`bg-secondary  text-white flex flex-col transition-width duration-300 ${isCollapsed ? 'w-0 md:w-16' : 'w-16 md:w-64'} z-50`}>
        <div className="font-bold text-2xl p-5 hidden md:inline-block text-center transition-opacity duration-300 whitespace-nowrap overflow-hidden">
          {isCollapsed ? '' : 'Classroom'} 
        </div>
        <ul className={`list-none p-0 ${isCollapsed && "hidden md:block"} mt-12`}>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
           
           <Link to={"/d"}> <FontAwesomeIcon icon={faHome} className="mr-4" />
            {!isCollapsed && <span className='hidden md:inline-block'> Home</span>}
            </Link>
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faBook} className="mr-4" />
            {!isCollapsed && <span className='hidden md:inline-block'>Classes</span>}
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
           
           <Link to={"/chatbot"}> <FontAwesomeIcon icon={faRobot} className="mr-4" />
            {!isCollapsed && <span className='hidden md:inline-block'>AI</span>}
            </Link>
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faUsers} className="mr-4" />
            {!isCollapsed && <span className='hidden md:inline-block'> People</span>}
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faCalendar} className="mr-4" />
            {!isCollapsed && <span className='hidden md:inline-block'>Calendar</span>}
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faCog} className="mr-4" />
            {!isCollapsed && <span className='hidden md:inline-block'>Settings</span>}
          </li>
        </ul>
      </div>
      <div className={`flex-1 flex flex-col transition-margin duration-300`}>
        <div className="p-4 flex justify-between items-center">
          <button className="btn btn-square btn-ghost" onClick={handleSidebarToggle}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div>Classify</div>
         
          <div className="dropdown dropdown-end">
            <button className="btn btn-square btn-ghost z-250">
              <FontAwesomeIcon icon={faUsers} />
            </button>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4 text-purple-800 z-50">
              <li><Link to="/profile">Profile</Link></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Logout</a></li>
            </ul>
          </div>
        </div>
        <div className={`flex-1 overflow-y-auto p-0 overflow-x-hidden`}>
          {children}
        </div>
      </div>
    </div>
    </globalContext.Provider>
  );
};

export default DashboardLayout;

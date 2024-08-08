import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faBook, faUsers, faCalendar, faCog } from '@fortawesome/free-solid-svg-icons';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      <div className={`bg-secondary text-white flex flex-col transition-width duration-300 ${isCollapsed ? 'w-16 md:w-16' : 'w-full md:w-64'}`}>
        <div className="font-bold text-2xl p-5 text-center transition-opacity duration-300 whitespace-nowrap overflow-hidden">
          {isCollapsed ? '' : 'Classroom'}
        </div>
        <ul className="list-none p-0">
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faHome} className="mr-4" />
            {!isCollapsed && <span>Home</span>}
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faBook} className="mr-4" />
            {!isCollapsed && <span>Classes</span>}
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faUsers} className="mr-4" />
            {!isCollapsed && <span>People</span>}
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faCalendar} className="mr-4" />
            {!isCollapsed && <span>Calendar</span>}
          </li>
          <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
            <FontAwesomeIcon icon={faCog} className="mr-4" />
            {!isCollapsed && <span>Settings</span>}
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
            <button className="btn btn-square btn-ghost">
              <FontAwesomeIcon icon={faUsers} />
            </button>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4 text-purple-800">
              <li><a href="#">Profile</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Logout</a></li>
            </ul>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 overflow-x-hidden ">
          {isCollapsed && children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

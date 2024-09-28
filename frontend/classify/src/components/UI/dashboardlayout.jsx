import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faBook, faRobot, faUsers, faCalendar, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { api } from '../../utils';
import { useEffect } from 'react';
export const globalContext = React.createContext();

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [classList, setClassList] = useState(null);

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const globalContextValues = {
    "sidebarToggle": setIsCollapsed  
  };

  const fetchCLass = () => {
    api.get("/class", {}, 50000,
        (data, status) => {
            setClassList(data);
        },
        (error, status) => {
            toast.error("An error occurred");
        },
        (error) => {
            toast.error("Server is too slow");
        }
    );
};

const handleLogout = () => {
  localStorage.clear()
  window.location.href = "/login"
}
useEffect(() => {
  fetchCLass();
}, []);

  return (
    <globalContext.Provider value={globalContextValues}>
      <div className="flex h-screen">
        <div className={`bg-secondary hidden text-white flex flex-col transition-width duration-300 ${isCollapsed ? 'w-0 md:w-16' : 'w-16 md:w-64'} z-50`}>
          <div className="font-bold text-2xl p-5 hidden md:inline-block text-center transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            {isCollapsed ? 'C' : 'Classify'}
          </div>
          <ul className={`list-none p-0 ${isCollapsed && "hidden md:block"} mt-12`}>
            <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
              <Link to={"/d"}>
                <FontAwesomeIcon icon={faHome} className="mr-4" />
                {!isCollapsed && <span className='hidden md:inline-block'> Home</span>}
              </Link>
            </li>
            {/* <li className="flex items-center p-4 cursor-pointer hover:bg-neutral">
              <FontAwesomeIcon icon={faBook} className="mr-4" />
              {!isCollapsed && <span className='hidden md:inline-block'>Classes</span>}
            </li> */}

            {/* Dropdown one */}
            <li className="relative p-4">
              <button
                onClick={() => toggleDropdown('dropdown1')}
                className="block w-full rounded flex justify-start items-center"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="mr-4" />
                {!isCollapsed && <p className='hidden md:inline-block'>Teaching</p>}
                
              </button>
              {openDropdown === 'dropdown1' && (
                <ul className="absolute left-full ml-3 top-0 mt-2 w-48 bg-purple-700 text-white space-y-2 rounded-lg shadow-lg z-60">
                  {classList?.filter((x) => x.is_admin).slice(0,5).map((data,index) => {
                    return (
                      <a href={`/class/view/${data.id}`}>
                      <div className='flex justify-between p-2 border-b-2 cursor-pointer  items-center'>
                          {data.cover_image_url ? 
                          <img src={data.cover_image_url} className='h-8 w-8 rounded-full'/> : 
                          <p className='h-8 w-8  rounded-full p-4 bg-white flex items-center justify-center text-purple-900'>{data.name.slice(0,1)}</p>}
                          <p className='text-xs'>{data.name}</p>
                      </div>
                      </a>
                    )
                  })}
                </ul>
              )}
            </li>

            {/* Dropdown two */}
            <li className="relative p-4">
              <button
                onClick={() => toggleDropdown('dropdown2')}
                className="block w-full rounded flex justify-start items-center"
              >
                <FontAwesomeIcon icon={faBook} className="mr-4" />
                {!isCollapsed && <p className='hidden md:inline-block'>Enrolled</p>}
                
              </button>
              {openDropdown === 'dropdown2' && (
                <ul className="absolute left-full ml-3 top-0 mt-2 w-48 bg-purple-700 text-white space-y-2 rounded-lg shadow-lg z-60">
                  {classList?.filter((x) => !x.is_admin).slice(0,5).map((data,index) => {
                    return (
                      <a href={`/s/${data.id}`}>
                      <div className='flex justify-between p-2 border-b-2 cursor-pointer  items-center'>
                          {data.cover_image_url ? 
                          <img src={data.cover_image_url} className='h-8 w-8 rounded-full'/> : 
                          <p className='h-8 w-8  rounded-full p-4 bg-white flex items-center justify-center text-purple-900'>{data.name.slice(0,1)}</p>}
                          <p className='text-xs'>{data.name}</p>
                      </div>
                      </a>
                    )
                  })}
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className={`flex-1 flex flex-col transition-margin duration-300`}>
          <div className="p-4 flex justify-between items-center">
            <button className="btn btn-square btn-ghost hidden md:block" onClick={handleSidebarToggle}>
              <FontAwesomeIcon icon={faBars} />
            </button>

            <button className="btn btn-square btn-ghost text-purple-900  md:hidden" onClick={handleSidebarToggle}>

              <Link to={"/d"}>
              <FontAwesomeIcon icon={faHome} />

              </Link>
            </button>

            <div>Classify</div>
            <div className="dropdown dropdown-end">
              <button className="btn btn-square btn-ghost z-50">
                <FontAwesomeIcon icon={faUsers} />
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4 text-purple-800 z-50">
                <li><Link to="/profile">Profile</Link></li>
                {/* <li><a href="#">Settings</a></li> */}
                <li><button onClick = {handleLogout}>Logout</button></li>
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

import React, { useState } from 'react';

const TabLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const tabs = ['Stream', 'Classwork', 'Topics' ,'People', 'Grades',"Setting"];

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="">
      <div className="max-w-7xl md:px-6 px-1">
        <div className="tabs flex justify-start">
          {/* Show first two tabs */}
          {tabs.slice(0, 3).map((tab, index) => (
            <button
              key={index}
              className={`tab tab-bordered ${activeTab === index ? 'tab-active bg-purple-500 text-white' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}

          {/* "More" button for small devices */}
          <div className="relative">
            <button
              className={`tab tab-bordered ${activeTab >= 3 ? 'tab-active bg-purple-500 text-white' : ''}`}
              onClick={toggleDropdown}
            >
              More
            </button>
            {showDropdown && (
              <div className="absolute bg-white shadow-lg rounded-md mt-2 z-10">
                {tabs.slice(3).map((tab, index) => (
                  <button
                    key={index + 3}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-200 ${activeTab === index + 2 ? 'bg-purple-500 text-white' : ''}`}
                    onClick={() => {
                      setActiveTab(index + 3);
                      setShowDropdown(false);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          {/* Render the active tab's content */}
          {children[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default TabLayout;

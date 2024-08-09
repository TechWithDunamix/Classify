import React, { useState } from 'react';

const TabLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const tabs = ['Stream', 'Classwork', 'People', 'Grades'];

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="tabs flex justify-start">
          {/* Show first two tabs */}
          {tabs.slice(0, 2).map((tab, index) => (
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
              className={`tab tab-bordered ${activeTab >= 2 ? 'tab-active bg-purple-500 text-white' : ''}`}
              onClick={toggleDropdown}
            >
              More
            </button>
            {showDropdown && (
              <div className="absolute bg-white shadow-lg rounded-md mt-2 z-10">
                {tabs.slice(2).map((tab, index) => (
                  <button
                    key={index + 2}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-200 ${activeTab === index + 2 ? 'bg-purple-500 text-white' : ''}`}
                    onClick={() => {
                      setActiveTab(index + 2);
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

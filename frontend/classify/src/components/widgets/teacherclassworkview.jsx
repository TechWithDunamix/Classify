import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faClipboard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const AssignmentBlock = ({ data ,fetch}) => {
  const [open, setOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const {id} = useParams()
  const handleToggle = () => {
    setOpen(!open);
  };

  const date = new Date(data.date_created);

  const readableDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = (asm_id) => {
    
    api.delete(`/class/assignment/${asm_id}?class_id=${id}`,{},50000,
      (data,status) => {
        fetch()
      },
      (error,status) => {
          if (status === 404){
            toast.error("Not found")
          }
          toast.error("An error occured")
      }
    )
  }
  return (
    <div className="bg-white p-4 w-[60%] mx-auto border-b-2 shadow-sm rounded-lg">
      <div className="flex items-center mb-2 cursor-pointer" onClick={handleToggle}>
        <FontAwesomeIcon icon={faClipboard} className="h-8 w-8 p-2 rounded-full bg-purple-500 text-white" />
        <div className="text-md ml-4 flex items-center">
          {data.title}
          {!data.is_due && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="ml-2 text-green-500 h-5 w-5"
              title="Draft"
            />
          )}
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-gray-500 text-sm">Posted: {readableDate}</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggle(); }}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleOptions(); }}
            className="text-gray-500 hover:text-gray-800 focus:outline-none relative"
          >
            <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                <button 
                onClick={(e) => handleDelete(data.id)}
                className="block w-full text-left px-4 py-2 text-red-700 hover:bg-gray-100">Delete</button>
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Update</button>

               {data.draft && <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Delete</button>}

              </div>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div>
          <div className="text-sm text-gray-700 mb-2 flex justify-between mt-2 px-5">
            <p>Total Submissions: 30</p>
            <p>Total Marked: 25</p>
          </div>
          <button className="ml-auto text-purple-900 px-4 py-2 rounded-lg hover:bg-purple-600 focus:outline-none">
            View Submissions
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentBlock;

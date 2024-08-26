import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faClipboard, faCheckDouble, faTimes } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../utils';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

const StudentAssignmentBlock = ({ data, fetch }) => {
  const [open, setOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submission, setSubmission] = useState('');
  const { id } = useParams();

  const handleToggle = () => {
    setOpen(!open);
    if (open){
      setShowForm(false)
    }
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
    api.delete(`/class/assignment/${asm_id}?class_id=${id}`, {}, 50000,
      (data, status) => {
        fetch();
      },
      (error, status) => {
        if (status === 404) {
          toast.error("Not found");
        } else {
          toast.error("An error occurred");
        }
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    api.post(`/class/assignment/submit?class_id=${id}`, { answer: submission }, 50000,
      (data, status) => {
        toast.success("Submission successful");
        setShowForm(false);
        fetch();
      },
      (error, status) => {
        toast.error("Submission failed");
      }
    );
  };

  return (
    <div className="bg-white p-4 mb-4 mx-auto border border-gray-200 rounded-lg shadow-lg md:w-[60%]">
      <div className="flex items-center mb-3 cursor-pointer" onClick={handleToggle}>
        <FontAwesomeIcon icon={faClipboard} className="h-6 w-6 p-2 rounded-full bg-purple-500 text-white" />
        <div className="ml-4 text-md  flex items-center">
          <span>{!showForm && data.title}</span>
          {data.is_due && (
            <FontAwesomeIcon
              icon={faCheckDouble}
              className="ml-2 text-green-500 h-4 w-4"
              title="Due"
            />
          )}
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <br />
          <span className="text-gray-500 text-sm hidden md:block">Posted: {readableDate}</span>
          
        </div>
      </div>
      <p className="text-gray-500 text-xs md:hidden -mt-4 ml-12">Posted: {readableDate}</p>
      
      {open && (
        <div>
          
          {showForm ? (
            <div className='mt-5'>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-800 focus:outline-none mb-4"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
              <p>{data.title}</p>
              <div className="mt-4 mb-4 text-gray-700" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.question) }} />

              
              <ReactQuill
                value={submission}
                onChange={setSubmission}
                className="mb-4 h-40 mb-20"
                placeholder="Enter your answer here..."
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowForm(true)}
                disabled={data.is_due}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none disabled:bg-gray-300"
              >
                Make Submission
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentBlock;

import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import classNames from 'classnames';

const classworks = [
  {
    id: 1,
    title: 'Classwork Title 1',
    dueDate: '2024-09-15',
    submissions: [
      { user: 'User 1', answer: 'Lorem ipsum dolor sit amet.', grade: null, comments: [] },
      { user: 'User 2', answer: 'Consectetur adipiscing elit.', grade: null, comments: [] }
    ]
  },
  {
    id: 2,
    title: 'Classwork Title 2',
    dueDate: '2024-09-22',
    submissions: [
      { user: 'User 3', answer: 'Sed do eiusmod tempor incididunt.', grade: null, comments: [] },
      { user: 'User 4', answer: 'Ut labore et dolore magna aliqua.', grade: null, comments: [] }
    ]
  }
];

const ClassworkSubmitions = () => {
  const [openClassworkId, setOpenClassworkId] = useState(null);

  const handleToggleDetails = (id) => {
    setOpenClassworkId(openClassworkId === id ? null : id);
  };

  const handleToggleSubmissions = (id) => {
    const submissionList = document.getElementById(`submissions-${id}`);
    if (submissionList) {
      submissionList.classList.toggle('hidden');
    }
  };

  const handleToggleGrade = (classworkId, submissionIndex) => {
    const gradeElement = document.getElementById(`grade-${classworkId}-${submissionIndex}`);
    const remarkElement = document.getElementById(`remark-${classworkId}-${submissionIndex}`);
    if (gradeElement && remarkElement) {
      gradeElement.classList.toggle('hidden');
      remarkElement.classList.toggle('hidden');
    }
  };

  const handleSubmitGrade = (classworkId, submissionIndex) => {
    const input = document.querySelector(`#grade-${classworkId}-${submissionIndex} input`);
    const grade = input?.value;
    if (grade) {
      const classwork = classworks.find(c => c.id === classworkId);
      if (classwork) {
        classwork.submissions[submissionIndex].grade = grade;
      }
    }
  };

  const handleAddComment = (classworkId, submissionIndex) => {
    const textarea = document.querySelector(`#comment-${classworkId}-${submissionIndex}`);
    const comment = textarea?.value;
    if (comment?.trim()) {
      const classwork = classworks.find(c => c.id === classworkId);
      if (classwork) {
        classwork.submissions[submissionIndex].comments.push(comment);
        textarea.value = ''; // Clear the textarea
      }
    }
  };

  return (
    <div className="bg-gray-100 p-8 font-sans">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Classwork Management</h1>
          <input
            id="search"
            type="text"
            placeholder="Search classwork..."
            className="border border-gray-300 rounded-lg p-2 w-full md:w-1/2"
          />
        </header>

        <div>
          {classworks.map(classwork => (
            <div
              key={classwork.id}
              className={classNames(
                'bg-white shadow-md rounded-lg p-6 mb-4 transition-transform transform hover:scale-105 hover:shadow-lg',
                {
                  'border border-blue-500': openClassworkId === classwork.id,
                }
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">{classwork.title}</h3>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors"
                  onClick={() => handleToggleDetails(classwork.id)}
                >
                  View Details
                </button>
              </div>
              <div
                id={`details-${classwork.id}`}
                className={classNames('fade-in', {
                  hidden: openClassworkId !== classwork.id
                })}
              >
                <p className="text-gray-700 mb-2">
                  Due Date: <span className="font-semibold">{classwork.dueDate}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  Number of Submissions: <span className="font-semibold">{classwork.submissions.length}</span>
                </p>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition-colors"
                  onClick={() => handleToggleSubmissions(classwork.id)}
                >
                  View Submissions
                </button>
                <div
                  id={`submissions-${classwork.id}`}
                  className={classNames('mt-4 fade-in', {
                    hidden: openClassworkId !== classwork.id
                  })}
                >
                  <ul className="space-y-2">
                    {classwork.submissions.map((submission, index) => (
                      <li
                        key={index}
                        className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col space-y-4 border border-gray-200"
                      >
                        <div className="flex items-center space-x-4">
                          <FaUserCircle className="text-gray-600 text-2xl" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{submission.user}</p>
                            <p className="text-gray-700">Answer: {submission.answer}</p>
                            <div className="flex justify-between mt-2">
                              <button
                                className="bg-yellow-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-yellow-700 transition-colors"
                                onClick={() => handleToggleGrade(classwork.id, index)}
                              >
                                Grade
                              </button>
                              <div
                                id={`grade-${classwork.id}-${index}`}
                                className="hidden fade-in"
                              >
                                <input
                                  type="number"
                                  placeholder="Enter grade"
                                  className="border p-2 rounded-md"
                                />
                                <button
                                  className="bg-blue-600 text-white px-3 py-1 rounded-md mt-2 shadow-md hover:bg-blue-700 transition-colors"
                                  onClick={() => handleSubmitGrade(classwork.id, index)}
                                >
                                  Submit Grade
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id={`remark-${classwork.id}-${index}`}
                          className="hidden fade-in"
                        >
                          <textarea
                            id={`comment-${classwork.id}-${index}`}
                            rows="3"
                            placeholder="Add a remark..."
                            className="border p-2 w-full rounded-md"
                          ></textarea>
                          <button
                            className="bg-purple-600 text-white px-4 py-2 rounded-md mt-2 shadow-md hover:bg-purple-700 transition-colors"
                            onClick={() => handleAddComment(classwork.id, index)}
                          >
                            Add Remark
                          </button>
                          <ul className="mt-2">
                            {submission.comments.map((comment, idx) => (
                              <li key={idx} className="bg-gray-200 p-2 rounded-md mt-1">{comment}</li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassworkSubmitions;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../../components/widgets/loader';
import { api } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faAdd } from '@fortawesome/free-solid-svg-icons';
import StudentAssignmentBlock from '../../components/widgets/studentclassworkview';

const StudentClassClassWork = () => {
  const { id } = useParams();
  const [classWork, setClassWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    api.get(`/class/students/assignment?class_id=${id}`, {}, 50000,
      (data, status) => {
        setClassWork(data);
      },
      (error, status) => {
        if (status === 404) {
          window.location.href = '/not-found';
        }
      },
      () => {
        alert('Error timed out');
      }
    );
  };

  useEffect(fetchData, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!classWork) {
    return (
      <div className="flex h-[70vh] justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (classWork.length === 0) {
    return (
      <div className="p-4">
        <button
          className="btn bg-purple-600 text-white ml-auto mb-4 flex items-center space-x-2"
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faAdd} />
          <Link to={`/class/cw/create/${id}`} className="ml-2">Create</Link>
        </button>
        <div className="flex h-[50vh] justify-center items-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="h-40 w-36 text-slate-400" />
            <p className="mt-5 text-gray-600">This class has no classwork attached to it!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {classWork.map((data, index) => (
        <StudentAssignmentBlock key={index} data={data} fetch={fetchData} />
      ))}
    </div>
  );
};

export default StudentClassClassWork;

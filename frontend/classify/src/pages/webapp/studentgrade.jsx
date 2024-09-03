import React, { useState, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { api } from '../../utils';
import { toast } from 'react-toastify';
import Loader from "../../components/widgets/loader";
import { useParams } from "react-router-dom";
import { useContext } from 'react';
import {globalContext} from '../../components/UI/dashboardlayout';
const StudentGrades_ = () => {
    const [student, setStudent] = useState(null);
    const { id } = useParams();
    const context = useContext(globalContext)
    const fetchData = () => {
        api.get(`/students/grading?class_id=${id}`, {}, 50000,
            (data, status) => {
                setStudent(data);
            },
            (error, status) => {
                console.error(error);
                toast.error("Failed to load data!");
            },
            (error) => {
                toast.error("Server is too slow!");
            }
        );
    };

    useEffect(() => {
        console.log(context)
        context.sidebarToggle(true)
    },[])
    useEffect(fetchData, [id]);

    if (!student) {
        return (
            <div className='h-[50vh] flex items-center justify-center'>
                <Loader />
            </div>
        );
    }

    if (student.gradings.length === 0) {
        return (
            <div className='h-[70vh] flex items-center justify-center text-slate-700'>
                <div className="text-center">
                    <ExclamationCircleIcon className="h-8 w-8 mx-auto text-red-500" />
                    <p>No grades yet!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 text-gray-800 h-screen">
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex items-center space-x-4">
                        <img src={student.user.profile_image} alt="Profile" className="h-16 w-16 rounded-full" />
                        <div>
                            <h2 className="text-xl font-bold text-purple-600">{student.user.username}</h2>
                            <p className="text-sm text-gray-500">{student.user.email}</p>
                            <p className="text-sm text-gray-500">Average Grade: <span className="text-green-500 font-semibold">{student.average}</span></p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Grades</h3>
                        <div className="overflow-x-hidden">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                                        <th className="py-3">Test</th>
                                        <th className="py-3">Date</th>
                                        <th className="py-3">Grade</th>
                                        <th className="py-3">Comments</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm">
                                    {student.gradings.map((grade, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="py-3">{grade.title}</td>
                                            <td className="py-3">{new Date(grade.date).toLocaleDateString()}</td>
                                            <td className="py-3 text-blue-500">{grade.score}</td>
                                            <td className="py-3">{grade.comment || 'No comments'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentGrades_;

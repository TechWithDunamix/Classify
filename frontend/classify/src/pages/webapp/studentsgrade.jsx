import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { api } from '../../utils';
import { toast } from 'react-toastify';

const StudentGrades = () => {
    const [students, setStudents] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    const fetchData = () => {
        api.get(`/teacher/grading?class_id=${'479117e7-a14f-4abf-9bdd-1780f0991387'}`, {}, 50000,
            (data, status) => {
                // Assuming `data` is the response object
                const formattedData = Object.values(data).map((item) => ({
                    name: item.user.full_name,
                    class: item.assignment.title,
                    average: item.score + '%',
                    grades: item.assignment.submitions.map((submission) => ({
                        test: item.assignment.title,
                        date: new Date(submission.date).toLocaleDateString(),
                        grade: submission.score + '%',
                        comments: submission.comment
                    }))
                }));
                setStudents(formattedData);
            },
            (error, status) => {
                console.error(error);
            },
            (error) => {
                toast.error("Server is too slow!");
            }
        );
    };

    useEffect(fetchData, []);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen">
            <div className="container mx-auto px-2">
                <header className="mb-10">
                    <h1 className="text-2xl md:text-4xl font-medium text-purple-700">Student Grades</h1>
                    <p className="text-gray-600">View individual student performance across different tests.</p>
                </header>

                <div id="accordion" className="bg-white rounded-lg p-5 space-y-4">
                    {students.map((student, index) => (
                        <div key={index} className="border-b border-gray-200 pb-5 mb-5">
                            <div className="flex justify-between items-center">
                                <button
                                    className="w-full text-left focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <div className="md:flex justify-between items-center">
                                        <div>
                                            <h2 className="text-lg md:text-xl font-medium text-purple-600">{student.name}</h2>
                                            <p className="text-xs md:text-sm text-gray-500">{student.class}</p>
                                        </div>
                                        <div className="text-left md:text-right mt-3 md:mt-0">
                                            <span className="text-gray-500">Total Average:</span>
                                            <span className="text-xl md:text-3xl font-light text-green-500">{student.average}</span>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    className="focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {openIndex === index ? (
                                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                            <div className={`mt-5 ${openIndex === index ? '' : 'hidden'}`}>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="text-left text-gray-600 uppercase text-xs md:text-sm tracking-wider">
                                                <th className="py-3">Test</th>
                                                <th className="py-3">Date</th>
                                                <th className="py-3">Grade</th>
                                                <th className="py-3">Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-700 text-xs md:text-sm">
                                            {student.grades.map((grade, gradeIndex) => (
                                                <tr key={gradeIndex} className="border-b border-gray-200">
                                                    <td className="py-3">{grade.test}</td>
                                                    <td className="py-3">{grade.date}</td>
                                                    <td className="py-3 text-blue-500">{grade.grade}</td>
                                                    <td className="py-3">{grade.comments}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentGrades;

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { api } from '../../utils';
import { toast } from 'react-toastify';
import Loader from "../../components/widgets/loader";

const StudentGrades = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState(null);

    const fetchData = () => {
        api.get(`/teacher/grading?class_id=${'479117e7-a14f-4abf-9bdd-1780f0991387'}`, {}, 50000,
            (data, status) => {
                setStudents(data);
                setFilteredStudents(data); // Initialize filtered students with all students
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

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = students.filter(student =>
            student.user.username.toLowerCase().includes(query)
        );
        setFilteredStudents(filtered);
    };

    if (!students.length){
        return (
            <div className='h-[50vh]'>
                <Loader />
            </div>
        )
    }

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen">
            <div className="container mx-auto px-2">
                <header className="mb-10">
                    <h1 className="text-2xl md:text-4xl font-medium text-purple-700">Student Grades</h1>
                    <p className="text-gray-600">View individual student performance across different tests.</p>
                    <input 
                        type="text" 
                        placeholder="Search by student name" 
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full mt-4 p-2 border rounded-lg bg-white"
                    />
                </header>

                <div id="accordion" className="bg-white rounded-lg p-5 space-y-4">
                    {filteredStudents.map((student, index) => (
                        <div key={index} className="border-b border-gray-200 pb-5 mb-5">
                            <div className="flex justify-between items-center">
                                <button
                                    className="w-full text-left focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <div className="md:flex justify-between items-center">
                                        <div>
                                            <img src={student.user.profile_image} className='h-4 w-4 rounded-full'/>
                                            <h2 className="text-md md:text-lg font-medium text-purple-600">{student.user.username}</h2>
                                            <small className='text-slate-400'><i>{student.user.email}</i></small>
                                            {/* <p className="text-xs md:text-sm text-gray-500">{student.class}</p> */}
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
                                            {student.gradings.map((grade, gradeIndex) => (
                                                <tr key={gradeIndex} className="border-b border-gray-200">
                                                    <td className="py-3">{grade.title}</td>
                                                    <td className="py-3">{grade.date}</td>
                                                    <td className="py-3 text-blue-500">{grade.score}</td>
                                                    <td className="py-3">{grade.comment}</td>
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

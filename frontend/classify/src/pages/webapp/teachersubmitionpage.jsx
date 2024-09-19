// ClassworkPage.js
import React, { useEffect, useState } from 'react';
import SubmissionCard from '../../components/widgets/teachersubmitionsCards';
import DashboardLayout from '../../components/UI/dashboardlayout';
import { api } from "../../utils";
import { useParams } from 'react-router-dom';
import Loader from '../../components/widgets/loader';
import { BsEmojiFrown } from 'react-icons/bs';
const ClassworkPage = () => {
    const [students, setStudents] = useState([]);
    const [submitions,setSubmitions] = useState([])
    const url = new URL(window.location.href);
    const {id} = useParams()
    const params = new URLSearchParams(url.search);
    const cwd_id =params.get("cwd")
    const title = params.get('title'); 
    const fetchSubmitions = () => {
        api.get(`/class/assignment/${id}?class_id=${cwd_id}`,{},50000,
            (data,status) => {
                setSubmitions(data.submitions)
            },
            (error,status) => {
                if(status === 404){
                    window.location.href= '/not-found'
                }
            },
            (error) => {

            }

        )
    }
    useEffect(() => {
        // Sample data
        const sampleStudents = [
            {
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                avatar: 'https://via.placeholder.com/40',
                answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'janesmith@example.com',
                avatar: 'https://via.placeholder.com/40',
                answer: 'Praesent libero. Sed cursus ante dapibus diam.'
            },
            {
                id: 3,
                name: 'Emily Johnson',
                email: 'emilyj@example.com',
                avatar: 'https://via.placeholder.com/40',
                answer: 'Maecenas malesuada. Vestibulum lacinia arcu eget nulla.'
            }
        ];
        fetchSubmitions()

        setStudents(sampleStudents);
    }, []);

    if (submitions.length < 1){
        return (
            <DashboardLayout>
            <div className='h-[50%] flex items-center justify-center'>
                <div className='text-center'>
                    <BsEmojiFrown className='w-18 h-18 text-[2rem] mx-auto my-2 text-purple-700'/>
                    <p className='text-lg text-slate-800'>No Submitions</p>

                    
                </div>
            </div>
            </DashboardLayout>
        )
    }
    return (
        <DashboardLayout>
        <div className="container mx-auto px-4 py-8 bg-gray-100 text-gray-800">
            <header className="mb-6">
                <h1 className="text-xl">{title}</h1>
            </header>
            <div className="card-grid flex flex-col justify-center gap-4">
                {submitions.map(data => (
                    <SubmissionCard key={data.id} student={data} data={data} fetch={fetchSubmitions}/>
                ))}
            </div>
        </div>
        </DashboardLayout>
    );
};

export default ClassworkPage;

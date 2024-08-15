import { useParams } from "react-router-dom";
import Loader from "../../components/widgets/loader";
import { useEffect, useState } from "react";
import { api } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faAdd } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from "react-router-dom";
import AssignmentBlock from "../../components/widgets/teacherclassworkview";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
const TeachersClassClassWork = () => {
    const { id } = useParams();
    const [classWork, setClassWork] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fetchData = () => {
        api.get(`/class/assignment?class_id=${id}`, {}, 50000,
            (data, status) => {
                setClassWork(data);
            },
            (data, status) => {
                
                if (status === 404){
                    window.location.href = "/not-found"
                }

            },
            (error) => {
                alert("Error timed out");
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
            <div>
                <button 
                    className="btn bg-purple-900 text-white ml-auto text-right"
                    onClick={openModal}
                >
                    <FontAwesomeIcon icon={faAdd} />
                    <Link to={`/class/cw/create/${id}`}>Create</Link>
                </button>
                <div className="flex h-[70vh] justify-center items-center">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-40 w-36 text-slate-400" />
                        <p className="mt-5">This class has no class work attached to it!</p>
                    </div>
                </div>

            
            </div>
        );
    }

    return (
        <div>
            <button 
                    className="btn bg-purple-900 text-white ml-auto text-right"
                    onClick={openModal}
                >
                    <FontAwesomeIcon icon={faAdd} />
                    <Link to={`/class/cw/create/${id}`}>Create</Link>
                </button>
            {classWork.map((data,index) => {
                return (
                    <AssignmentBlock key={index} data={data} fetch={fetchData}/>
                )
            })}
        </div>
    );
};

export default TeachersClassClassWork;

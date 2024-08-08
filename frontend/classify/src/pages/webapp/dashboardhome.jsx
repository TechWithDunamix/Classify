import DashboardLayout from "../../components/UI/dashboardlayout";
import { api } from "../../utils";
import { useState,useEffect } from "react";
import Loader from "../../components/widgets/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceMeh ,faPen,faUserFriends,faPenSquare} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const DashboardHome = () => {
    const [classList,setClassList] = useState(null)

    const fetchCLass = () => {
        api.get("/class",{},5000,
            (data,status) => {
                setClassList(data)
            },
            (error,status) => {
                alert("Error")
            },
            (error) => {
                alert("Network error timed out")
            }
        )
    }
    useEffect(() => {
        fetchCLass()
    },[])
    if (!classList){
        return (
            <DashboardLayout>
                <div className="min-h-[70vh] flex justify-center items-center">
                    <div>
                        <Loader />
                        <p className="mt-5 text-slate-700">Loading your class list</p>
                    </div>

                </div>
            </DashboardLayout>
        )
    }
    if (classList.length === 0){
        return (
            <DashboardLayout>
                <div className="min-h-[70vh] flex justify-center items-center">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faFaceMeh} className="w-20 h-20 text-purple-300"/>
                        <p className="mt-5 text-slate-700">Your class list is empty</p>
                        <div className="flex flex-2 mt-12 justify-between gap-14">
                            <button className="btn bg-purple-900 px-4 py-2 text-white font-extralight">
                                <FontAwesomeIcon icon={faUserFriends} />
                                Join
                            </button>
                            <button className="btn bg-white px-4 py-2 border-2 border-purple-900 text-purple-900">
                            <FontAwesomeIcon icon={faPen} />

                                <Link to='/class/new'>Create</Link>
                            </button>


                        </div>
                    </div>

                </div>
            </DashboardLayout>
        )
    }
    return (
        <DashboardLayout>
            <ul>
            {classList.map((data,index) => {
                return (
                    <li key={index}>{data.name}</li>
                )

            })}
            </ul>
        <button className="btn rounded-full text-purple-600 absolute bottom-1 p-4 right-0 m-12 bg-purple-200 text-lg animate-bounce">
            <FontAwesomeIcon icon={faPenSquare} />
            
        </button>
        </DashboardLayout>
    )
}

export default DashboardHome

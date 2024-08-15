import { api } from "../../utils"
import { useState,useEffect } from "react"
import { toast } from "react-toastify"
import Loader from "../widgets/loader"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons"
const AnnouncmentHome = () => {
    const {id} = useParams()
    const [data,setData] = useState(null)
    const fetchData = () => {
        api.get(`/class/announcement?class_id=${id}`,{},50000,
            (data,status) => {
                console.log(data)
                setData(data)
            },
            (error,status) => {
                console.log(error)
                if (status === 400){
                    toast.error("Bad request")
                }
                if (status === 404){
                    window.location.href = "/not-found"
                }
            },
            (error) => {
                toast.error("Server is too slow ")
            }
        )
    }
    useEffect(fetchData,[])

    if (!data){
        return (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        )
    }
    if (data.length === 0){
        return (
            <div className="flex justify-center items-center">
                <div className="mt-12 text-center">
                    <FontAwesomeIcon icon={faBoxOpen} className="h-32 w-32 text-gray-700"/>
                    <p>No data on your in your class stream. </p>
                </div>
            </div>
        )
    }
    return (
        <div className="md:w-[70%] bg-green-900 ml-auto">
        <p>Hello world</p>
        </div>
    )
}

export default AnnouncmentHome
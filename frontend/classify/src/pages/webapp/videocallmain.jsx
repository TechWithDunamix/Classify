import VideoCallComponent from "./videocall";
import StudentViewComponent from "./studentVideoCall";
import { api } from "../../utils";
import { useParams  } from "react-router-dom";
import { useState,useEffect } from "react";
const VideoCall = () => {
    const {id} = useParams()
    const queryParams = new URLSearchParams(window.location.search);
    const mode = queryParams.get('mode'); 
    const [data,setData] = useStates()

    const fetchData = () => {
        api.get(`/class/${id}`,{},50000,
            (data,status) => {
                setData(data)
            },
            (error,status) => {
                if (status === 404){
                    window.location.href = "/not-found"
                }
            },
            (status)=>{

            }
        )
    }

    useEffect(fetchData,[])
    return (
        <p>Hello worls </p>
    )
}


export default VideoCall
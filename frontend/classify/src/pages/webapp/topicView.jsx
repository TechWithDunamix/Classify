import {useParams} from "react-router-dom"
import DashboardLayout from "../../components/UI/dashboardlayout"
import { useEffect,useState } from "react"
import { api } from "../../utils"
import Loader from "../../components/widgets/loader"
const TopicView = () => {
    const {id} = useParams()
    const [topic,setTopic] = useState()

    const params = new URLSearchParams(window.location.search)
    const topic_id  = params.get("id")
    const topic_title = params.get("title")
    
    return (
        <DashboardLayout>
            <div className="mx-auto text-center">
                <p className="text-3xl text-slate-400">{topic_title}</p>
            </div>
            <p>TOpic View {id} with class id {topic_id}</p>
        </DashboardLayout>
    )
}

export default TopicView
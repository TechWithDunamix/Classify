import DashboardLayout from "../../components/UI/dashboardlayout";
import { api } from "../../utils";
import { useState,useEffect } from "react";
import ProfileSettings1 from "../../components/primitives/profile/profile1";
const ProfilePage = () => {
    const [userData,setUserData] = useState({})
    const fetchAPI = () => {
        api.get('/user/profile', {}, 500000,
            (data, status) => {
                
                setUserData(data)
                console.log(status)

               
            },
            (err, status) => {
                console.log(err,status)
             },
            
            (err) => {
                console.log(err)
            }

        )
    }
    // useEffect(() => {
    //     fetchAPI()
    // },[])
    return (
        <DashboardLayout>
            <ProfileSettings1/>
        </DashboardLayout>
    )
}

export default ProfilePage
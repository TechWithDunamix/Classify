import TabLayout from "../../components/UI/teachertablayout";
import DashboardLayout from "../../components/UI/dashboardlayout";
import TeachersClassHome from "./teacherclasshome";
const TeacherViewClass = () =>{
    return (
        <DashboardLayout>
        <TabLayout>
            <TeachersClassHome />
            <p>Hello world again</p>

        </TabLayout>
        </DashboardLayout>
    )
}

export default TeacherViewClass
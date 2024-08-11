import TabLayout from "../../components/UI/teachertablayout";
import DashboardLayout from "../../components/UI/dashboardlayout";
import TeachersClassHome from "./teacherclasshome";
import ClassSettings from "./teachersClassSetting";
import TeachersClassClassWork from "./teachersClassWork";
const TeacherViewClass = () =>{
    return (
        <DashboardLayout>
        <TabLayout>
            <TeachersClassHome />
            <TeachersClassClassWork />
            <p>People</p>

            <p>Grades</p>
            <ClassSettings />

        </TabLayout>
        </DashboardLayout>
    )
}

export default TeacherViewClass
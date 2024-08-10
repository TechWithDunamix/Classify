import TabLayout from "../../components/UI/teachertablayout";
import DashboardLayout from "../../components/UI/dashboardlayout";
import TeachersClassHome from "./teacherclasshome";
import ClassSettings from "./teachersClassSetting";
const TeacherViewClass = () =>{
    return (
        <DashboardLayout>
        <TabLayout>
            <TeachersClassHome />
            <p>Class work pages</p>
            <p>People</p>

            <p>Grades</p>
            <ClassSettings />

        </TabLayout>
        </DashboardLayout>
    )
}

export default TeacherViewClass
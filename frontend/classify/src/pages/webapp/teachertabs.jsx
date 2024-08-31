import TabLayout from "../../components/UI/teachertablayout";
import DashboardLayout from "../../components/UI/dashboardlayout";
import TeachersClassHome from "./teacherclasshome";
import ClassSettings from "./teachersClassSetting";
import TeachersClassClassWork from "./teachersClassWork";
import TeachersTopicPage from "./teachersTopics";
import ClassMembers from "./teachersmembers";
const TeacherViewClass = () =>{
    return (
        <DashboardLayout>
        <TabLayout>
            <TeachersClassHome />
            <TeachersClassClassWork />
            <TeachersTopicPage />
            <ClassMembers />

            <p>Grades</p>
            <ClassSettings />

        </TabLayout>
        </DashboardLayout>
    )
}

export default TeacherViewClass
import TabLayout from "../../components/UI/teachertablayout";
import DashboardLayout from "../../components/UI/dashboardlayout";
import TeachersClassHome from "./teacherclasshome";
import ClassSettings from "./teachersClassSetting";
import TeachersClassClassWork from "./teachersClassWork";
import TeachersTopicPage from "./teachersTopics";
import ClassMembers from "./teachersmembers";
import StudentGrades from "./studentsgrade";
import ChatBubble from "../../components/widgets/chat";

const TeacherViewClass = () =>{
    return (
        <DashboardLayout>
        <TabLayout>
            <TeachersClassHome />
            <ChatBubble />
            <TeachersClassClassWork />
            
            <ClassMembers />

            <StudentGrades />
            <ClassSettings />

        </TabLayout>
        </DashboardLayout>
    )
}

export default TeacherViewClass
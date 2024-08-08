// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpForm from './components/signupform';
import DashboardHome from './pages/webapp/dashboardhome';
import PrivateRoute from './pages/protectedroutes';
import ProfilePage from './pages/webapp/profile';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="signup" element={<SignUpForm />} />
        <Route path="d" element={<PrivateRoute element={<DashboardHome />} />} />
        <Route path="profile" element={<PrivateRoute element={<ProfilePage />} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

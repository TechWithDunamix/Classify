import {BrowserRouter,Routes,Route} from "react-router-dom"
import SignUpForm from "./components/signupform"
// import HomePage from "./pages/site/home"
function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route index element={<SignUpForm />} />

        </Routes>
    
    </BrowserRouter>
  )
}

export default App

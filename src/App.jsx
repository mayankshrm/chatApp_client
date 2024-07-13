import {Route,BrowserRouter,Routes} from "react-router-dom"
import Home from "./Pages/Home/Home"
import Login from "./Pages/Login/Login"
import Register from "./Pages/Register/Register"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"


export default function App() {

  const{user}=useContext(AuthContext)

  
  return (

    <BrowserRouter>
<Routes>

    <Route path="/" element={<Home/>} />
    <Route path="/login"  element={<Login/>}/>
    <Route path="/signup" element={<Register/>}/>

</Routes>

    </BrowserRouter>
  )
}

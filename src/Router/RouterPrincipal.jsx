import {Route, BrowserRouter, Routes} from "react-router-dom"
import Registro from '../Paginas/Registro'
import Home from '../Paginas/Home'




const RouterPrincipal = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} ></Route>
            <Route path='/registro' element={<Registro/>}></Route>
        </Routes>
        </BrowserRouter>
    )
}

export default RouterPrincipal
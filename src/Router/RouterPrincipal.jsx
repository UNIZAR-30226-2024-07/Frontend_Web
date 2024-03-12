import {Route, BrowserRouter, Routes} from "react-router-dom"
import Registro from '../Pages/Registro'
import Home from '../Pages/Home'
import root from '../constants'
import InicioSesion from "../Pages/InicioSesion"



const RouterPrincipal = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={root} element={<Home/>} ></Route>
                <Route path={root + 'registro'} element={<Registro/>}></Route>
                <Route path={root + 'inicioSesion'} element={<InicioSesion/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterPrincipal
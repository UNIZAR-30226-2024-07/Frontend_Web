import {Route, BrowserRouter, Routes} from "react-router-dom"
import Registro from '../Pages/Registro'
import Home from '../Pages/Home'
import constants from '../constants'
import InicioSesion from "../Pages/InicioSesion"

// import EjemploSubidaFoto from "../Pages/EjemploSubidaFoto"


const RouterPrincipal = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={constants.root} element={<Home/>} ></Route>
                <Route path={constants.root + 'registro'} element={<Registro/>}></Route>
                <Route path={constants.root + 'inicioSesion'} element={<InicioSesion/>}></Route>

                {/* <Route path={constants.root + 'ejemploSubidaFoto'} element={<EjemploSubidaFoto/>}></Route> */}

            </Routes>
        </BrowserRouter>
    )
}

export default RouterPrincipal
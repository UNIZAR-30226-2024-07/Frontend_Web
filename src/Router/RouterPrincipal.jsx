import {Route, BrowserRouter, Routes} from "react-router-dom"
import { AuthProvider } from "../Context/AuthContext"
import { ProtectedRoute } from "./ProtectedRoute"
import Registro from '../Pages/Registro'
import Home from '../Pages/Home'
import constants from '../constants'
import InicioSesion from "../Pages/InicioSesion"

import EjemploSubidaFoto from "../Pages/EjemploSubidaFoto"
import PruebaMatch from "../Pages/PruebaMatch"


const RouterPrincipal = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={constants.root} element={<Home/>} ></Route>
                    <Route path={constants.root + 'registro'} element={<Registro/>}></Route>
                    <Route path={constants.root + 'inicioSesion'} element={<InicioSesion/>}></Route>
                    <Route path={constants.root + 'pruebaMatch'} element={<PruebaMatch/>}></Route>

                    <Route element={<ProtectedRoute />}>

                        <Route path={constants.root + 'ejemploSubidaFoto'} element={<EjemploSubidaFoto/>}></Route>

                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default RouterPrincipal
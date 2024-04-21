import {Route, BrowserRouter, Routes} from "react-router-dom"
import { AuthProvider } from "../Context/AuthContext"
import { ProtectedRoute } from "./ProtectedRoute"
import { ProtectedRouteAdmin } from "./ProtectedRouteAdmin"
import { PageHome } from "../Pages/PageHome"
import { PageFriendFind } from "../Pages/PageFriendFind"
import { PageFriendList } from "../Pages/PageFriendList"
import { PageFriendRequest } from "../Pages/PageFriendRequest"
import { PageRegister } from "../Pages/PageRegister"
import { PageLogin } from "../Pages/PageLogin"
import constants from '../constants'
import { PageDashboard } from "../Pages/PageDashboard"
import EjemploSubidaFoto from "../Pages/EjemploSubidaFoto"
import PruebaMatch from "../Pages/PruebaMatch"
import CrearCuentaAdmin from "../Pages/CrearCuentaAdmin"
import HomeAdmin from "../Pages/HomeAdmin"
import CrearSala from "../Pages/CrearSala"
import AjustesUser from "../Pages/AjustesUser"
import { CambiarContrasena } from "../Pages/CambiarContrasena"
import {CambiarUsuario} from "../Pages/CambiarUsuario"
import EstadisticasUser from "../Pages/EstadisticasUser"
import { MyAvatar } from "../Components/MyAvatar"
import {PageTienda} from "../Pages/PageTienda"
import { SelectAvatar } from "../Pages/SelectAvatar"
const RouterPrincipal = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={constants.root} element={<PageHome/>} ></Route>
                    <Route path={constants.root + 'PageLogin'} element={<PageLogin/>}></Route>                   
                    <Route path={constants.root + 'PageRegister'} element={<PageRegister/>}></Route>                   

                    <Route element={<ProtectedRoute />}>
                        
                        <Route path={constants.root + 'pruebaMatch'} element={<PruebaMatch/>}></Route>
                        
                        <Route path={constants.root + 'PageFriendFind'} element={<PageFriendFind/>}></Route>
                        <Route path={constants.root + 'PageFriendList'} element={<PageFriendList/>}></Route>
                        <Route path={constants.root + 'PageAllUsers'} element={<MyAvatar/>}></Route>
                        <Route path={constants.root + 'PageFriendRequest'} element={<PageFriendRequest/>}></Route>
                        <Route path={constants.root + 'PageDashboard'} element={<PageDashboard/>}></Route>
                        <Route path={constants.root + 'AjustesUser'} element={<AjustesUser/>}></Route>  
                        <Route path={constants.root + 'CambiarUsuario'} element={<CambiarUsuario/>}></Route>  
                        <Route path={constants.root + 'CambiarContrasena'} element={<CambiarContrasena/>}></Route>  
                        <Route path={constants.root + 'AjustesUser'} element={<AjustesUser/>}></Route>  
                        <Route path={constants.root + 'EstadisticasUser'} element={<EstadisticasUser/>}></Route>  
                        <Route path={constants.root + 'SelectAvatar'} element={<SelectAvatar/>}></Route>  
                        <Route path={constants.root + 'PageTienda'} element={<PageTienda/>}></Route>  

                    </Route>

                    <Route element={<ProtectedRouteAdmin />}>
                        
                        <Route path={constants.root + 'ejemploSubidaFoto'} element={<EjemploSubidaFoto/>}></Route>

                        <Route path={constants.root + 'HomeAdmin'} element={<HomeAdmin/>}></Route>
                        <Route path={constants.root + 'CrearCuentaAdmin'} element={<CrearCuentaAdmin/>}></Route>
                        <Route path={constants.root + 'CrearSala'} element={<CrearSala/>}></Route>

                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default RouterPrincipal
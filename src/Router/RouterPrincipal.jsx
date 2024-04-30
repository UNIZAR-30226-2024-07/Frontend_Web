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
import {PageTienda} from "../Pages/PageTienda"
import { SelectAvatar } from "../Pages/SelectAvatar"
import {PageTrophyRanking} from "../Pages/PageTrophyRanking"
import {PageMoneyRanking} from "../Pages/PageMoneyRanking"
import MenuPartidaPublica from "../Pages/MenuPartidaPublica"
import PruebaPublicBoard from "../Pages/PublicBoard/PruebaPublicBoard"
import PartidaPublica from "../Pages/PartidaPublica"
import PartidaPrivada from "../Pages/PantallaPrivada"
import SingleBoard from "../Pages/SingleBoard/SingleBoard"

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
                        <Route path={constants.root + 'public'} element={<PruebaPublicBoard/>}></Route>
                        <Route path={constants.root + 'PartidaSolitario'} element={<SingleBoard />}></Route>
                        
                        <Route path={constants.root + 'PageFriendFind'} element={<PageFriendFind/>}></Route>
                        <Route path={constants.root + 'PageFriendList'} element={<PageFriendList/>}></Route>
                        <Route path={constants.root + 'Ranking'} element={<PageTrophyRanking/>}></Route>
                        <Route path={constants.root + 'PageFriendRequest'} element={<PageFriendRequest/>}></Route>
                        <Route path={constants.root + 'PageDashboard'} element={<PageDashboard/>}></Route>
                        <Route path={constants.root + 'AjustesUser'} element={<AjustesUser/>}></Route>  
                        <Route path={constants.root + 'CambiarUsuario'} element={<CambiarUsuario/>}></Route>  
                        <Route path={constants.root + 'CambiarContrasena'} element={<CambiarContrasena/>}></Route>  
                        <Route path={constants.root + 'AjustesUser'} element={<AjustesUser/>}></Route>  
                        <Route path={constants.root + 'EstadisticasUser'} element={<EstadisticasUser/>}></Route>  
                        <Route path={constants.root + 'SelectAvatar'} element={<SelectAvatar/>}></Route>  
                        <Route path={constants.root + 'PageTienda'} element={<PageTienda/>}></Route>  
                        <Route path={constants.root + 'PageTrophyRanking'} element={<PageTrophyRanking/>}></Route>  
                        <Route path={constants.root + 'PageMoneyRanking'} element={<PageMoneyRanking/>}></Route>  
                        <Route path={constants.root + 'MenuPartidaPublica'} element={<MenuPartidaPublica/>}></Route>  
                        <Route path={constants.root + 'PartidaPublica'} element={<PartidaPublica/>}></Route>  
                        <Route path={constants.root + 'PartidaPrivada'} element={<PartidaPrivada/>}></Route>  

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
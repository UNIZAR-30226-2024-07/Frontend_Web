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
import PublicBoard from "../Pages/PublicBoard/PublicBoard"
import PartidaPublica from "../Pages/PartidaPublica"
import PartidaPrivada from "../Pages/PantallaPrivada"
import SingleBoard from "../Pages/SingleBoard/SingleBoard"
import AgnadirTorneo from "../Pages/AgnadirTorneo"
import AgnadirProducto from "../Pages/AgnadirProducto"
import TournamentBoard from "../Pages/TournamentBoard/TournamentBoard"
import PrivateBoard from "../Pages/PrivateBoard/PrivateBoard"
import AgnadirAvatar from "../Pages/AgnadirAvatar"
import AgnadirBaraja from "../Pages/AgnadirBaraja"
import AgnadirTapete from "../Pages/AgnadirTapete"
import PausedPrivateBoard from "../Pages/PrivateBoard/PausedPrivateBoard"
import PartidasPausadas from "../Pages/PartidasPausadas"
import PausedPublicBoard from "../Pages/PublicBoard/PausedPublicBoard"
import PausedTournamentBoard from "../Pages/TournamentBoard/PausedTournamentBoard"
import EliminarTorneoAdmin from "../Pages/EliminarTorneoAdmin"
import EliminarSalaAdmin from "../Pages/EliminarSalaAdmin"
import ModificarEliminarCuenta from "../Pages/ModificarEliminarCuenta"



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
                        <Route path={constants.root + 'SingleBoard'} element={<SingleBoard />}></Route>
                        <Route path={constants.root + 'TournamentBoard'} element={<TournamentBoard />}></Route>
                        <Route path={constants.root + 'PublicBoard'} element={<PublicBoard/>}></Route>
                        <Route path={constants.root + 'PrivateBoard'} element={<PrivateBoard/>}></Route>
                        <Route path={constants.root + 'PausedTournamentBoard/:id'} element={<PausedTournamentBoard/>}></Route>
                        <Route path={constants.root + 'PausedPublicBoard/:id'} element={<PausedPublicBoard/>}></Route>
                        <Route path={constants.root + 'PausedPrivateBoard/:id'} element={<PausedPrivateBoard/>}></Route>
                        <Route path={constants.root + 'PartidasPausadas'} element={<PartidasPausadas/>}></Route>

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
                        <Route path={constants.root + 'PartidaPublica'} element={<PartidaPublica/>}></Route>  
                        <Route path={constants.root + 'PartidaPrivada'} element={<PartidaPrivada/>}></Route>  

                    </Route>

                    <Route element={<ProtectedRouteAdmin />}>
                        
                        <Route path={constants.root + 'ejemploSubidaFoto'} element={<EjemploSubidaFoto/>}></Route>

                        <Route path={constants.root + 'HomeAdmin'} element={<HomeAdmin/>}></Route>
                        <Route path={constants.root + 'CrearCuentaAdmin'} element={<CrearCuentaAdmin/>}></Route>
                        <Route path={constants.root + 'CrearSala'} element={<CrearSala/>}></Route>
                        <Route path={constants.root + 'AgnadirTorneo'} element={<AgnadirTorneo/>}></Route>
                        <Route path={constants.root + 'AgnadirProducto'} element={<AgnadirProducto/>}></Route>
                        <Route path={constants.root + 'AgnadirAvatar'} element={<AgnadirAvatar/>}></Route>
                        <Route path={constants.root + 'AgnadirBaraja'} element={<AgnadirBaraja/>}></Route>
                        <Route path={constants.root + 'AgnadirTapete'} element={<AgnadirTapete/>}></Route>
                        <Route path={constants.root + 'EliminarTorneoAdmin'} element={<EliminarTorneoAdmin/>}></Route>
                        <Route path={constants.root + 'EliminarSalaAdmin'} element={<EliminarSalaAdmin/>}></Route>
                        <Route path={constants.root + 'ModificarEliminarCuenta'} element={<ModificarEliminarCuenta/>}></Route>



                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default RouterPrincipal
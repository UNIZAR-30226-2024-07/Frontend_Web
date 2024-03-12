import {Route, BrowserRouter, Routes} from "react-router-dom"
import Registro from '../Pages/Registro'
import Home from '../Pages/Home'

import root from '../constants'



const RouterPrincipal = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={root} element={<Home/>} ></Route>
                <Route path={root + 'registro'} element={<Registro/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterPrincipal
import { useState } from "react";
import { Navbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { MyIcon } from "./MyIcon";
import { MyButton } from "./MyButton";
import './MyNav.css';
import { FaShopify } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import constants from '../constants';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

export function MyNav({ isLoggedIn, isDashboard }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth(); // Obtiene la función logout del contexto de autenticación
  const navigate = useNavigate(); // Obtiene la función navigate de react-router-dom
  const destino = isLoggedIn ? constants.root  : constants.root + "PageDashboard" ;


  const menuItems = [
    { text: "Amigos", path: constants.root + "PageFriendList" },
    { text: "Ranking", path: constants.root + "PageAllUsers" },
    { text: "Skins", path: constants.root + "PageFriendList" },
    { text: "Log out", onClick: handleLogout } // Asigna la función handleLogout al botón "Log out"
  ];

  // Función para manejar el logout
  function handleLogout() {
    logout(); // Llama a la función logout del contexto de autenticación
    navigate(constants.root); // Redirige a la página de inicio después de cerrar sesión
  }
  

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen} className="custom-navbar" maxWidth="2xl">
      <NavbarContent justify="start" className="navbar-start">
        <div className="icon-container">
          <Link to={destino}>
            <MyIcon />
          </Link>
        </div>
      </NavbarContent>
      <NavbarContent justify="end">
        {isLoggedIn && (
          <>
            <NavbarItem className="navbar-item lg:flex">
              <Link to={constants.root + "PageLogin"}>
                <MyButton className="button-nav" color="grey" size="md">Iniciar sesión</MyButton>
              </Link>
            </NavbarItem>
            <NavbarItem className="navbar-item">
              <Link to={constants.root + "PageRegister"}>
                <MyButton className="button-nav" color="grey" size="md">Registrarse</MyButton>
              </Link>
            </NavbarItem>
          </>
        )}
        {isDashboard && (
          <>
            <NavbarContent justify="end">
              <Link to={constants.root + "Tienda"} style={{ color: 'black', cursor: 'pointer', marginRight: '20px' }}>
                <FaShopify className="text-4xl" />
              </Link>
              <Link to={constants.root + "AjustesUser"} style={{ color: 'white', cursor: 'pointer', marginRight: '20px' }}>
                <IoSettingsOutline className="text-4xl" />
              </Link>
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              />
            </NavbarContent>
            <NavbarMenu className="nav-menu">
              {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item.text}-${index}`} onClick={item.onClick}>
                  <Link to={item.path} size="">{item.text}</Link>  
                </NavbarMenuItem>
              ))}
            </NavbarMenu>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}

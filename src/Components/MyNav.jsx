import { useState } from "react";
import { Navbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { MyIcon } from "./MyIcon";
import { MyButton } from "./MyButton";
import './MyNav.css';
import { FaShopify } from "react-icons/fa";
import { Link } from "react-router-dom";
import constants from '../constants';

export function MyNav({ isLoggedIn, isDashboard }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Amigos",
    "Ranking",
    "Skins",
    "Log out"
  ];

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen} className="custom-navbar" maxWidth="2xl">
      <NavbarContent justify="start" className="navbar-start">
        <div className="icon-container">
          <Link to={constants.root}>
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
              <Link to="/" style={{ color: 'black', cursor: 'pointer', marginRight: '20px' }}>
                <FaShopify className="text-4xl" />
              </Link>
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              />
            </NavbarContent>
            <NavbarMenu className="nav-menu">
              {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link to="/" size="">{item}</Link>  
                </NavbarMenuItem>
              ))}
            </NavbarMenu>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}

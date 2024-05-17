import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Navbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { MyIcon } from "./MyIcon";
import { MyButton } from "./MyButton";
import './MyNav.css';
import { FaShopify } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import constants from '../constants';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPause } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { FaHeart } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";

export function MyNav({ isLoggedIn, isDashboard, monedas, isBoard, coinsCurrent, pausa, salir,isBoardWithLives, lives}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const destino = isLoggedIn ? constants.root : constants.root + "PageDashboard";

  const menuItems = [
    { text: "Amigos", path: constants.root + "PageFriendList" },
    { text: "Ranking", path: constants.root + "Ranking" },
    { text: "Skins", path: constants.root + "SelectAvatar" },
    { text: "Log out", onClick: handleLogout },
    { text: "Partidas pausadas", path: constants.root + "PartidasPausadas" }
  ];

  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const saberMonedas = async () => {
      try {
        const response = await axios.get('/user/verify');
        setCoins(response.data.user.coins);
      } catch (error) {
        console.error('Failed to load cards:', error);
      }
    };
    saberMonedas();
  }, []);

  function handleLogout() {
    logout();
    navigate(constants.root);
  }
  
  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen} className="custom-navbar" maxWidth="2xl">
      <NavbarContent justify="start" className="navbar-start">
        <div className="icon-container">
          {!isBoard && (
            <Link to={destino}>
              <MyIcon />
            </Link>
          )}
          {isBoard && <MyIcon />}
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
            <NavbarContent justify="center">
              <div className='div-inicia'>
                <div className='moned'>
                  <img src="./../../Frontend_Web/Imagenes/moneda.png" className="moneda-icono" />
                  {coins}
                </div>
              </div>
            </NavbarContent>

            <NavbarContent justify="end">
              <Link to={constants.root + "PageTienda"} style={{ color: 'white', cursor: 'pointer', marginRight: '20px' }}>
                <FaShopify className="text-4xl" />
              </Link>
              <Link to={constants.root + "AjustesUser"} style={{ color: 'white', cursor: 'pointer', marginRight: '20px' }}>
                <IoSettingsOutline className="text-4xl" />
              </Link>
              <NavbarMenuToggle style={{ color: 'white', cursor: 'pointer', marginRight: '20px' }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              />
            
              <NavbarMenu className="nav-menu">
                {menuItems.map((item, index) => (
                  <NavbarMenuItem key={`${item.text}-${index}`} onClick={item.onClick}>
                    <Link to={item.path} size="">{item.text}</Link>  
                  </NavbarMenuItem>
                ))}
              </NavbarMenu>
            </NavbarContent>
          </>
        )}
        {monedas && (
          <>
            <NavbarContent justify="center">
              <div className='div-inicia'>
                <div className='moned'>
                  <img src="./../../Frontend_Web/Imagenes/moneda.png" className="moneda-icono" />
                  {coins}
                </div>
              </div>
            </NavbarContent>
          </>
        )}
        {isBoard && (
          <>
            <NavbarContent justify="end">
              <div className='partida-icon'>
                {coinsCurrent !==0 && (
                  <div className='moned'>
                    <img src="./../../Frontend_Web/Imagenes/moneda.png" className="moneda-icono" />
                    {coinsCurrent}
                  </div>
                )}
                {pausa !== 0 && <FaPause className="icon-pause" onClick={pausa}/>}
                <RxExit className="icon-pause" onClick={salir}/>
              </div>
            </NavbarContent>
          </>
        )}
        {isBoardWithLives && (
          <>
            <NavbarContent justify="end">
              <div className='partida-icon'>
                { lives === 5 ? (
                  <>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  </>
                ) : lives === 4.5 ? (
                  <>
                  <CiHeart  className="heart"></CiHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  </>
                ) : lives === 4 ? (
                  <>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  </>
                ) : lives === 3.5 ? (
                  <>
                  <CiHeart  className="heart"></CiHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  </>
                ) : lives === 3 ? (
                  <>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  </>
                ) : lives === 2.5 ? (
                  <>
                  <CiHeart  className="heart"></CiHeart>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  </>
                ) : lives === 2 ? (
                  <>
                  <FaHeart className="heart"></FaHeart>
                  <FaHeart className="heart"></FaHeart>
                  </>
                ) : lives === 1.5 ? (
                  <>
                  <CiHeart  className="heart"></CiHeart>
                  <FaHeart className="heart"></FaHeart>
                  </>
                ) : lives === 1 ? (
                  <FaHeart  className="heart"></FaHeart>
                ) : lives === 0.5 ? (
                  <CiHeart  className="heart"></CiHeart>
                ) : (
                  <p></p>
                )}
                {coinsCurrent !==0 && !isBoardWithLives && (
                  <div className='moned'>
                    <img src="./../../Frontend_Web/Imagenes/moneda.png" className="moneda-icono" />
                    {coinsCurrent}
                  </div>
                )}
                {pausa !== 0 && <FaPause className="icon-pause" onClick={pausa}/>}
                <RxExit className="icon-pause" onClick={salir}/>
              </div>
            </NavbarContent>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}

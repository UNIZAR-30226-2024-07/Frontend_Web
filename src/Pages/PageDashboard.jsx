import { MyNav } from "../Components/MyNav";
import { MyAvatar } from "../Components/MyAvatar";
import { MyButton } from "../Components/MyButton";
import "./PageDashboard.css"
import { useNavigate } from "react-router-dom";
export function PageDashboard() {
  const navigate = useNavigate();

  const handlePartidaPublica = () => {
    // Lógica para navegar a la pantalla de cambio de nombre de usuario
    navigate('/Frontend_Web/MenuPartidaPublica');
  };
  return (
    <>
    <div className="page-dashboard">
      <MyNav isLoggedIn={false} isDashboard={true}/>
      <div className="avatar-dashboard">
          <MyAvatar>
          </MyAvatar>
      </div>
      <div className="option-dashboard">
          <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={handlePartidaPublica}>Partida Publica</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered">Partida Privada</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered">Torneo</MyButton>
      </div>
    </div>
    </>
  );
}

import { MyNav } from "../Components/MyNav";
import { MyAvatar } from "../Components/MyAvatar";
import { MyButton } from "../Components/MyButton";
import "./PageDashboard.css"
import { useNavigate } from "react-router-dom";

export function PageDashboard() {
  const navigate = useNavigate();

  const ajustes = () => {
    navigate('/Frontend_Web/AjustesUser');
  }
  
  return (
    <>
      <MyNav isLoggedIn={false} isDashboard={true}/>
      <div className="avatar-dashboard">
          <MyAvatar>
          </MyAvatar>
      </div>
      <div className="option-dashboard">
          <MyButton color="midnightblue" size="xxl" variant="bordered">Partida Publica</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered">Partida Privada</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered">Torneo</MyButton>
          <MyButton color="midnightblue" size="xxl" variant="bordered" onClick={ajustes}>Ajustes</MyButton>

      </div>
    </>
  );
}

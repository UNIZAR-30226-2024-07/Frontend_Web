import { MyNav } from "../Components/MyNav";
import { MyAvatar } from "../Components/MyAvatar";
import { MyButton } from "../Components/MyButton";
import "./PageDashboard.css"

export function PageDashboard() {
    return (
      <>
      <div className="page-dashboard">
        <MyNav isLoggedIn={false} isDashboard={true}/>
        <div className="avatar-dashboard">
            <MyAvatar>
            </MyAvatar>
        </div>
        <div className="option-dashboard">
            <MyButton color="midnightblue" size="xxl" variant="bordered">Partida Publica</MyButton>
            <MyButton color="midnightblue" size="xxl" variant="bordered">Partida Privada</MyButton>
            <MyButton color="midnightblue" size="xxl" variant="bordered">Torneo</MyButton>
        </div>
      </div>
      </>
  );
}

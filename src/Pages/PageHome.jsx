import { MyNav } from "../Components/MyNav"
import "./PageHome.css"

export function PageHome() {
  return (
    <div className='inicio'>
      <MyNav isLoggedIn={true} isDashboard={false} />
      <div className="text-home">
      <h1>Bienvenido a BlackJack Master</h1>
      <p>Crea una cuenta o regístrate para continuar</p>
      </div>
    </div>
  );
}

import "./MyFoundRival.css"
import { MyNav } from "./MyNav";

const MyFoundRival = () => {
  return (
    <div className="found-rival">
    <MyNav></MyNav>
        <div className="contenedor">
            <p className="texto-rival">!!RIVAL ENCONTRADO!!</p>
        </div>
        <div className="rival">
        <div className="my-rival-container">
            <img src="" className="rival-avatar-image" alt="Avatar" />
        </div>
        <div className="contenedor-abajo">
            <p className="texto-rival">NOMBRE</p>
        </div>
        <div className="contenedor-abajo">
            <p className="texto-rival">Nº VICTORIAS: </p>
        </div>
        </div>
    </div>
  );
};



export default MyFoundRival;

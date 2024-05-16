import MyWinOrLose from "../Components/MyWinOrLose"; // Importa el componente desde su ruta relativa
import { MyNav } from "../Components/MyNav";
const PageWinTournament = () => {
  return (
    <div>
   <MyNav isLoggedIn={false} isDashboard={false} />
      <MyWinOrLose
        imageUrl="./../../Frontend_Web/Imagenes/trofeo.png"
        text="¡ENHORABUENA!"
        leftRightImageUrl="./../../Frontend_Web/Imagenes/medalla.jpg"
        message="¡HAS GANADO EL TORNEO!"
        moneyValue={100}
      />
    </div>
  );
};

export default PageWinTournament;

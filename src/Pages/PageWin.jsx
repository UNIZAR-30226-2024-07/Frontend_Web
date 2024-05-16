import MyWinOrLose from "../Components/MyWinOrLose"; // Importa el componente desde su ruta relativa
import { MyNav } from "../Components/MyNav";
const PageWin = () => {
  return (
    <div>
   <MyNav isLoggedIn={false} isDashboard={false} />
      <MyWinOrLose
        imageUrl="./../../Frontend_Web/Imagenes/victoria.png"
        text="¡FELICIDADES!"
        leftRightImageUrl="./../../Frontend_Web/Imagenes/star.jpg"
        message="Avanzas a la siguiente ronda"
        moneyValue={100}
      />
    </div>
  );
};

export default PageWin;

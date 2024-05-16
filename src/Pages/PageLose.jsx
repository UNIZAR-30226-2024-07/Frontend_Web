import MyWinOrLose from "../Components/MyWinOrLose"; // Importa el componente desde su ruta relativa
import { MyNav } from "../Components/MyNav";
const PageLose = () => {
  return (
    
    <div>
        <MyNav isLoggedIn={false} isDashboard={false} />
        <MyWinOrLose
        imageUrl="./../../Frontend_Web/Imagenes/derrota.png"
        text="¡LÁSTIMA!"
        leftRightImageUrl="./../../Frontend_Web/Imagenes/calavera.jpg"
        message="HAS QUEDADO ELIMINADO"
        moneyValue={0}
      />
    </div>
  );
};

export default PageLose;

import { MyNav } from "../Components/MyNav";
import { MyAvatar } from "../Components/MyAvatar"
import "./PageRivalEncontrado.css"

const PageRivalEncontrado = () => {
    return (
        <div className="rival-encontrado">
            <MyNav isLoggedIn={false} isDashboard={false} />
            <MyAvatar/>
        </div>
      );
    };
export default PageRivalEncontrado;

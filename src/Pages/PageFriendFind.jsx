import { MyFriend } from "../Components/MyFriend";
import { MyNav } from "../Components/MyNav";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import "./PageFriendList.css"
import "./PageFriendFind.css"

export function PageFriendFind () {
    const [busqueda, setBusqueda] = useState('');
    const handleInputChange = (e) => {
      setBusqueda(e.target.value);
      console.log(busqueda)
    };
  
    return (
   
   <div className="page-friend">
        <MyNav isLoggedIn={false} isDashboard={false} />
        <div className="find-friend">
        <input
        className="find"
        type="text"
        placeholder="Buscar amigos"
        value={busqueda}
        onChange={handleInputChange}
        />
        <HiMagnifyingGlass className="glass"></HiMagnifyingGlass>
        </div>     
        
        <div className="friend">

            <ul className="friend-list">

                <li className="friend-list-item">
                    <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 1" isFriendList={false} isRequestList={false} isFriendFind={true} />
                </li>

                <li className="friend-list-item">
                    <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 2" isFriendList={false} isRequestList={false} isFriendFind={true} />
                </li>

                <li className="friend-list-item">
                    <MyFriend imageUrl='public/Imagenes/logo.png' name="Amigo 3" isFriendList={false} isRequestList={false} isFriendFind={true}/>
                </li>
        
            </ul>

        </div>
    </div>
    );
}
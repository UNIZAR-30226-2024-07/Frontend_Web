import { useState, useEffect} from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import './ModificarAvatar.css';
import constants from '../constants';
import { Input, CircularProgress } from "@nextui-org/react";
import { MyNavAdmin } from '../Components/MyNavAdmin';

const ModificarAvatar = () => {

  const navigate = useNavigate();
  const {id} = useParams()
  const [error, setError] = useState(null);



  const [newAvatar, setNewAvatar] = useState(
    {
        image: '',
        price: ''
    }
  )

  const [avatarLoaded, setAvatarLoaded] = useState(false)

  useEffect(() => {
    const getAvatar = async () => {
        try {
          console.log("El id de avatar recibido es " + id);
          const response = await axios.get('/avatar/avatarById/' + id);
          if (response.status !== 200) {
              return console.error(response.data);
          } else {
              console.log("Datos de avatar cargados correctamente");
              console.log(response.data);
              console.log(response.data.avatar.image)
              setNewAvatar({
                image: response.data.avatar.image,
                price: response.data.avatar.price
              });
              console.log("El image del avatar una vez cargado es: " + newAvatar.image);
              setAvatarLoaded(true);
          }
          
        } catch (e) {
            console.error("Error al pedir los datos de avatar. " + e.message);
        }
        
    };
    getAvatar(); // Llama a la función al cargar el componente

}, []); // El array de dependencias está vacío para que se ejecute solo una vez

// useEffect(() =>{
  
// }, [newAvatar]);

  const handleChange = (e) => {
    setNewAvatar({...newAvatar, [e.target.name]: e.target.value})
  }




  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('price', newAvatar.price) 
    formData.append('image', newAvatar.image) 

    if(newAvatar.price =='' || newAvatar.image ==''){
      setError('Todos los campos deben de estar completados')
      return;
    }

    try {
        const response = await axios.put('/avatar/update/' + id, formData)
        if (response.status !== 200) {
            console.log("Fallo al obtener Avatares: ", response.data);
            throw new Error('Error al obtener avatares');
        }
        else{
          navigate(constants.root + 'HomeAdmin');
        }
        console.log('Respuesta:', response.data);
    } catch (error) {
        console.error('Error:', error);
        setError('El nombre de avatar que estás intentando utilizar ya está en uso')
    }
  }


  return (
    <div>
      <div className="ModificarAvatar">
        <MyNavAdmin></MyNavAdmin>
        {avatarLoaded ? (
          <form  encType="multipart/form-data" className="questionnaire-container">
            <h2 className="questionnaire-tittle"> Modificar avatar</h2>
              <div className="form-input">Avatar name</div>
              <Input
                  type="text"
                  //placeholder="Enter the avatar name"
                  name="image"
                  defaultValue={newAvatar.image}
                  onChange={handleChange}
                  required
              />
              
              <div className="form-input">Avatar price</div>
              <Input
                  type="number"
                  //placeholder="Enter the avatar price"
                  name="price"
                  defaultValue={newAvatar.price}
                  onChange={handleChange}
                  required
                  className="custom-input"
              />

              <Link to={constants.root} onClick={handleSubmit} className="submit-button">Confirmar</Link>

          </form>
        ) : (
          <CircularProgress aria-label="Loading..." />
        )}
      </div>
      {error && <div className="error-login">{error}</div>}
    </div>
  );
}

export default ModificarAvatar
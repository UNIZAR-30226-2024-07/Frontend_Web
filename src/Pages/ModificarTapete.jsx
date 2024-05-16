import { useState, useEffect} from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import './ModificarTapete.css';
import constants from '../constants';
import { Input, CircularProgress } from "@nextui-org/react";
import { MyNavAdmin } from '../Components/MyNavAdmin';

const ModificarTapete = () => {

  const navigate = useNavigate();
  const {id} = useParams()



  const [newTapete, setNewTapete] = useState(
    {
        image: '',
        price: ''
    }
  )

  const [tapeteLoaded, setTapeteLoaded] = useState(false)

  useEffect(() => {
    const getTapete = async () => {
        try {
          console.log("El id de tapete recibido es " + id);
          const response = await axios.get('/rug/rugById/' + id);
          if (response.status !== 200) {
              return console.error(response.data);
          } else {
              console.log("Datos de tapete cargados correctamente");
              console.log(response.data);
              console.log(response.data.rug.image)
              setNewTapete({
                image: response.data.rug.image,
                price: response.data.rug.price
              });
              console.log("El image del tapete una vez cargado es: " + newTapete.image);
              setTapeteLoaded(true);
          }
          
        } catch (e) {
            console.error("Error al pedir los datos de tapete. " + e.message);
        }
        
    };
    getTapete(); // Llama a la función al cargar el componente

}, []); // El array de dependencias está vacío para que se ejecute solo una vez

// useEffect(() =>{
  
// }, [newAvatar]);

  const handleChange = (e) => {
    setNewTapete({...newTapete, [e.target.name]: e.target.value})
  }




  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('price', newTapete.price) 
    formData.append('image', newTapete.image) 

    try {
        const response = await axios.put('/rug/update/' + id, formData)
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
    }
  }


  return (
    <div>
      <div className="ModificarTapete">
        <MyNavAdmin></MyNavAdmin>
        {tapeteLoaded ? (
          <form  encType="multipart/form-data" className="questionnaire-container">
            <h2 className="questionnaire-tittle"> Modificar tapete</h2>
              <div className="form-input">Rug name</div>
              <Input
                  type="text"
                  //placeholder="Enter the avatar name"
                  name="image"
                  defaultValue={newTapete.image}
                  onChange={handleChange}
                  required
              />
              
              <div className="form-input">Rug price</div>
              <Input
                  type="number"
                  //placeholder="Enter the avatar price"
                  name="price"
                  defaultValue={newTapete.price}
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
    </div>
  );
}

export default ModificarTapete
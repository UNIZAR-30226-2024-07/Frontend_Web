import { useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './AgnadirBaraja.css';
import constants from '../constants';
import { Input } from "@nextui-org/react";
import { MyNavAdmin } from '../Components/MyNavAdmin'

const AgnadirBaraja = () => {

  const navigate = useNavigate();

  const [newCard, setNewCard] = useState(
    {
        image: '',
        price: '',
        imageFileName: null,
        preview: ''
    }
  )



  const handleChange = (e) => {
    setNewCard({...newCard, [e.target.name]: e.target.value})
  }

  const handlePhoto = (e) => {
    setNewCard({...newCard, 
                  imageFileName: e.target.files[0],
                  preview: URL.createObjectURL(e.target.files[0])
                })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('imageFileName', newCard.imageFileName) 
    formData.append('price', newCard.price) 
    formData.append('image', newCard.image) 

    try {
        const response = await axios.post('/card/add', formData)
        if (response.status !== 200) {
            console.log("Fallo al obtener Cartas: ", response.data);
            throw new Error('Error al obtener cartas');
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
    <div className="AgnadirBaraja">
      <MyNavAdmin></MyNavAdmin>
      <form  encType="multipart/form-data" className="questionnaire-container">
        <h2 className="questionnaire-tittle"> Añadir nueva baraja</h2>
          <label htmlFor="upload-button">
          {newCard.preview ? (
              <img
              src={newCard.preview}
              alt="dummy"
              width="200"
              height="200"
              />
          ) : (
              <>
              <p>
                  Upload Image
              </p>
              </>
          )}
          </label>
          <input
              type="file"
              accept=".png, .jpg, .jpg"
              name="imageFileName"
              onChange={handlePhoto}
              id="upload-button"
              required
          />
          <div className="form-input">Card name</div>
          <Input
              type="text"
              placeholder="Enter the card name"
              name="image"
              value={newCard.image}
              onChange={handleChange}
              required
          />
          
          <div className="form-input">Card price</div>
          <Input
              type="number"
              placeholder="Enter the card price"
              name="price"
              value={newCard.price}
              onChange={handleChange}
              required
          />

          <Link to={constants.root} onClick={handleSubmit} className="submit-button">Confirmar</Link>
          {/* <input 
              className="submit-button"
              type="submit"  
          /> */}

      </form>
      </div>
  );
}

export default AgnadirBaraja
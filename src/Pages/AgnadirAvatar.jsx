import { useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './AgnadirAvatar.css';
import constants from '../constants';
import { Input } from "@nextui-org/react";
import { MyNavAdmin } from '../Components/MyNavAdmin'

const AgnadirAvatar = () => {

  const navigate = useNavigate();
  const [error, setError] = useState(null);


  const [newAvatar, setNewAvatar] = useState(
    {
        image: '',
        price: '',
        imageFileName: null,
        preview: ''
    }
  )



  const handleChange = (e) => {
    setNewAvatar({...newAvatar, [e.target.name]: e.target.value})
  }

  const handlePhoto = (e) => {
    setNewAvatar({...newAvatar, 
                  imageFileName: e.target.files[0],
                  preview: URL.createObjectURL(e.target.files[0])
                })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('imageFileName', newAvatar.imageFileName) 
    formData.append('price', newAvatar.price) 
    formData.append('image', newAvatar.image) 
    if(newAvatar.imageFileName ==null || newAvatar.price =='' || newAvatar.image ==''){
      setError('Todos los campos deben de estar completados')
      return;
  }

    try {
        const response = await axios.post('/avatar/add', formData)
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
        setError('El image que estás intentando utilizar ya está en uso')
    }
  }


  return (
    <div className="AgnadirAvatar">
      <MyNavAdmin></MyNavAdmin>
      <form  encType="multipart/form-data" className="questionnaire-container">
        <h2 className="questionnaire-tittle"> Añadir nuevo avatar</h2>
          <label htmlFor="upload-button">
          {newAvatar.preview ? (
              <img
              src={newAvatar.preview}
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
          <div className="form-input">Avatar name</div>
          <Input
              type="text"
              placeholder="Enter the avatar name"
              name="image"
              value={newAvatar.image}
              onChange={handleChange}
              required
          />
          
          <div className="form-input">Avatar price</div>
          <Input
              type="number"
              placeholder="Enter the avatar price"
              name="price"
              value={newAvatar.price}
              onChange={handleChange}
              required
              className="custom-input"
          />

          <Link to={constants.root} onClick={handleSubmit} className="submit-button">Confirmar</Link>

      </form>
      {error && <div className="error-login">{error}</div>}
      </div>
  );
}

export default AgnadirAvatar
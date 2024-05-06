import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './AgnadirTapete.css';
import constants from '../constants';
import { Input } from "@nextui-org/react";
import { MyNavAdmin } from '../Components/MyNavAdmin'

const AgnadirTapete = () => {

  const navigate = useNavigate();

  const [newRug, setNewRug] = useState(
    {
        image: '',
        price: '',
        imageFileName: null,
        preview: ''
    }
  )



  const handleChange = (e) => {
    setNewRug({...newRug, [e.target.name]: e.target.value})
  }

  const handlePhoto = (e) => {
    setNewRug({...newRug, 
                  imageFileName: e.target.files[0],
                  preview: URL.createObjectURL(e.target.files[0])
                })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('imageFileName', newRug.imageFileName) 
    formData.append('price', newRug.price) 
    formData.append('image', newRug.image) 

    try {
        const response = await axios.post('/rug/add', formData)
        if (response.status !== 200) {
            console.log("Fallo al obtener Tapetes: ", response.data);
            throw new Error('Error al obtener tapetes');
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
    <div className="AgnadirTapete">
      <MyNavAdmin></MyNavAdmin>
      <form  encType="multipart/form-data" className="questionnaire-container">
        <h2 className="questionnaire-tittle"> Añadir nuevo tapete</h2>
          <label htmlFor="upload-button">
          {newRug.preview ? (
              <img
              src={newRug.preview}
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
          <div className="form-input">Rug name</div>
          <Input
              type="text"
              placeholder="Enter the rug name"
              name="image"
              value={newRug.image}
              onChange={handleChange}
              required
          />
          
          <div className="form-input">Rug price</div>
          <Input
              type="number"
              placeholder="Enter the rug price"
              name="price"
              value={newRug.price}
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

export default AgnadirTapete
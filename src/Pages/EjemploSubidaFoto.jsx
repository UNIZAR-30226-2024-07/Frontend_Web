import { useState, useEffect } from "react";
import "../App.css"

import axios from '../api/axios'
import Avatar from "../Components/Avatar";

const EjemploSubidaFoto = () => {
    
    const [allAvatars, setAllAvatars] = useState(null)
    
    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const response = await axios.get('/avatar/getAllAvatars')
                if (response.status !== 200) {
                    console.log("Fallo al obtener Avatares: ", response.data);
                    throw new Error('Error al obtener avatares');
                }
                console.log('Avatares:', response.data);
                setAllAvatars(response.data.avatar); // Actualizar el estado con los avatares obtenidos
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAvatars();
    }, []);

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

        try {
            const headers = {
                'Content-Type': 'multipart/form-data'
            };  
            const token = localStorage.getItem("token");
            if (token) {
              headers["Authorization"] = token;
            }
            const response = await axios.post('/avatar/add', formData, { headers })
            if (response.status !== 200) {
                console.log("Fallo al obtener Avatares: ", response.data);
                throw new Error('Error al obtener avatares');
            }
            console.log('Respuesta:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label htmlFor="upload-button">
            {newAvatar.preview ? (
                <img
                src={newAvatar.preview}
                alt="dummy"
                width="300"
                height="300"
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
            <input
                type="text"
                placeholder="Nombre imagen"
                name="image"
                value={newAvatar.image}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                placeholder="Precio"
                name="price"
                value={newAvatar.price}
                onChange={handleChange}
                required
            />

            <div className="bg">

            </div>

            <input 
                type="submit"
            />

        </form>

        {allAvatars && (
            <div className="avatar-container">
                {allAvatars.map((avatar) => (
                    avatar && avatar._id && <Avatar key={avatar._id} avatarId={avatar._id} />
                ))}
            </div>
        )}
        </>
    );
} 

export default EjemploSubidaFoto


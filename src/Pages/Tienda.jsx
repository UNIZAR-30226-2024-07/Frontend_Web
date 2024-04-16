import { useState, useEffect } from 'react';
import axios from '../api/axios';
import './Tienda.css';
import constants from '../constants'
import { MyNav } from '../Components/MyNav';

export const Tienda = () => {
  const [avatars, setAvatars] = useState([]);
  const [rugs, setRugs] = useState([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get('/avatar/getAllAvatars');
        setAvatars(response.data.avatar);
      } catch (error) {
        console.error('Failed to load avatars:', error);
      }
    };

    const fetchRugs = async () => {
      try {
        const response = await axios.get('/rug/getAllRugs');
        console.log("holaa?");
        setRugs(response.data.rug);
      } catch (error) {
        console.error('Failed to load avatars:', error);
      }
    };
    fetchAvatars();
    fetchRugs();
  }, []);


  return (
    <div className='tienda'>
    
    <MyNav isLoggedIn={false} isDashboard={true}/>
      <div className="avatar-container">
        <div className="avatar-scroll">
          <ul className="avatar-list">
            {avatars.map(avatar => (
              <li key={avatar._id}>
                <img 
                  src={constants.dirApi + "/" + constants.uploadsFolder + "/" + avatar.imageFileName}
                  alt={avatar.name}
                  className="avatar-image"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="avatar-container">
        <div className="avatar-scroll">
          <ul className="avatar-list">
            {rugs.map(rug => (
              <li key={rug._id}>
                <img 
                  src={constants.dirApi + "/" + constants.uploadsFolder + "/" + rug.imageFileName}
                  alt={rug.name}
                  className="avatar-image"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
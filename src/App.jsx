import { useState } from 'react'
import bjLogo from './assets/logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [avatarData, setAvatarData] = useState(null);

  const handleClick = async () => {
    setCount((count) => count + 1)
    const response = await fetch('https://backend-uf65.onrender.com/api/avatar/avatarById/65ea25df0b5bd47a75ff5da8', {
        method: 'GET',
    })
    const json = await response.json()
    if (response.ok) {
      console.log(json)
      setAvatarData(json.avatar)
    }else {
      console.log("Nada, ERROR")
    }
  }

  return (
    <>
      <div>
        <a href="https://github.com/UNIZAR-30226-2024-07/Frontend_Web/" target="_blank">
          <img src={bjLogo} className="logo" alt="Black Jack Master logo" />
        </a>
      </div>
      <h1>Black Jack Master</h1>
      <button className='button' onClick={handleClick}>Obtener un Avatar</button>

      {avatarData && (
        <div>
          <p>Avatar ID: {avatarData._id}</p>
          <p>Avatar Image: {avatarData.image}</p>
          <p>Avatar Price: {avatarData.price}</p>
          <p>Created At: {avatarData.createdAt}</p>
          <p>Updated At: {avatarData.updatedAt}</p>
        </div>
      )}
      <div className="card">
       <button className='button'>Numero veces pulsado boton 'Obtener Avatar': {count}</button>
      </div>
    </>
  )
}

export default App
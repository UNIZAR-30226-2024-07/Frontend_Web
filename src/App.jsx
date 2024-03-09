import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = async () => {
    const response = await fetch('https://backend-uf65.onrender.com/api/avatar/avatarById/65ea25df0b5bd47a75ff5da8', {
        method: 'GET',
    })
    const json = await response.json()
    if (response.ok) {
      console.log(json)
    }else {
      console.log("Nada, ERROR")
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <button className='button' onClick={handleClick}>ObtenerAvatar</button>

    </>
  )
}

export default App
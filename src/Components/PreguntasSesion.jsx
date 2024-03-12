import '../App.css'; 

function PreguntasSesion({ type, value, onChange }) {
  let prompt;


    // Dependiendo del tipo de cuestionario, asignamos el mensaje adecuado
    switch (type) {
        case 'password':
            prompt = 'Contraseña';
            break;
        case 'Nick':
            prompt = 'Nick';
            break;
        case 'email':
            prompt = 'Correo electrónico';
            break;
        case 'name':
            prompt = 'Nombre';
            break;
        case 'phone':
            prompt = 'Número de teléfono';
            break;
        default:
            prompt = 'Introduzca su respuesta';
    }

    return (
        <div className="question-container">
            <div>
                <p className="question-text">{prompt}</p>
                <input
                    type={type === 'password' ? 'password' : 'text'}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export default PreguntasSesion;

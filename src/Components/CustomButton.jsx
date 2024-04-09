import './CustomButton.css';

export function CustomButton({ text, onClick }) {
  return (
    <button className="custom-button" onClick={onClick}>
      {text}
    </button>
  );
}

// export { CustomButton }; // Exporta CustomButton como un componente nombrado

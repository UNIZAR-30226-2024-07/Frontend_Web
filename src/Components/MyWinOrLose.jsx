import PropTypes from 'prop-types';
import "./MyWinOrLose.css"
import { BsChatLeftTextFill } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";

const MyWinOrLose = ({ imageUrl, text, leftRightImageUrl, message, moneyValue }) => {
  return (
    <div className="wrapper">
      <BsChatLeftTextFill className="icon"></BsChatLeftTextFill>
      <div className="red-box">
        <MdOutlineAttachMoney /> <FiPlus className="plus-icon"/>  <span className="money-value">{moneyValue}</span>
      </div>
      <div className="container">
        <div className="content">
          <img src={leftRightImageUrl} alt="Left" className="small-image" />
          <div className="text-and-image">
            <p>{text}</p>
            <img src={imageUrl} alt="Centered" className="image" />
            <p className="message">{message}</p>
          </div>
          <img src={leftRightImageUrl} alt="Right" className="small-image" />
        </div>
      </div>
      <button className="red-button"><FaArrowRightLong></FaArrowRightLong></button> {/* Botón rojo */}
    </div>
  );
};

MyWinOrLose.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  leftImageUrl: PropTypes.string.isRequired,
  rightImageUrl: PropTypes.string.isRequired,
  moneyValue: PropTypes.number.isRequired
};

export default MyWinOrLose;

import "./MyRanking.css"
import "./MyFriend.css"

export function MyRanking({ user, isTrophyList, isCoinsList, numberRanking, value }) {
  let backgroundColor;
  
  if (numberRanking === 1) {
    backgroundColor = "yellow";
  } else if (numberRanking === 2) {
    backgroundColor = "grey";
  } else if (numberRanking === 3) {
    backgroundColor = "#bf8970";
  } else {
    backgroundColor = "#3F497F";
  }

  return (
    <div className="circular-photo">
      <div className="ranking">
      <p className="number-ranking" style={{ backgroundColor: backgroundColor }}>{numberRanking}</p>
      </div>
      <div className="user-info">
        <img src={user.avatar} alt="User" className="photo" />
        <span className="name">{user.name}</span>
      </div>
      {isTrophyList && (
        <div className="button-container">
          <p className="name">Torneos ganados: {value}</p>
        </div>
      )}
      {isCoinsList && (
        <div className="button-container">
          <p className="name">Monedas ganadas en total: {value}</p>
        </div>
      )}
    </div>
  );
}

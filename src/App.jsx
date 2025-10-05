import { memo, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
// import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer"
import "./App.css";

const gameIcons = [
  "🐒",
  "🐓",
  "🐈",
  "🐢",
  "🐎",
  "🦌",
  "🦬",
  "🦏",
  "🐏",
  "🐄",
  "🐳",
  "🦜",
];

function App() {
  const [pieces, setPieces] = useState([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);


  useEffect(() => {
    if (pieces.length > 0 && pieces.every((p) => p.solved)) {
      setTimeout(() => {
        if (level < 3) {
          setLevel((lvl) => lvl + 1);
          startGame();
          setTimeLeft(60);
        } else {
          setIsGameCompleted(true); // game finished
          ConfettiSideCannons(); // launch confetti
        }
      }, 1200);
    }
  }, [pieces]);

  useEffect(() => {
    if (!gameStarted || isGameCompleted || isGameLost) return;
    if (timeLeft <= 0){ 
      setIsGameLost(true);
      return;
    }  
       
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStarted, isGameCompleted, isGameLost]);

  const startGame = () => {
    setTimeLeft(60);
    setIsGameLost(false);
     setIsGameCompleted(false); 


    const pairCount = Math.pow(2, level); // 2, 4, 8 ...

    // 1. Pick random unique icons
    const shuffledIcons = [...gameIcons].sort(() => 0.5 - Math.random());
    const selectedIcons = shuffledIcons.slice(0, pairCount);

    // 2. Duplicate to create pairs
    const duplicateIcons = [...selectedIcons, ...selectedIcons];

    // 3. Shuffle the duplicate icons
    const newGameIcons = duplicateIcons
      .sort(() => 0.5 - Math.random())
      .map((emoji, index) => ({
        emoji,
        flipped: false,
        solved: false,
        position: index,
      }));

    setPieces(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, [level]);

  const handleActive = (data) => {
    if (isGameLost || isGameCompleted) return;
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) return;

    const newPieces = pieces.map((piece) =>
      piece.position === data.position
        ? { ...piece, flipped: !piece.flipped }
        : piece
    );

    setPieces(newPieces);
  };

  const getCardFlipped = () => {
    const flippedData = pieces.filter((p) => p.flipped && !p.solved);

    if (flippedData.length === 2) {
      setTimeout(() => {
        if (flippedData[0].emoji === flippedData[1].emoji) {
          setPieces((prev) =>
            prev.map((piece) =>
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
                ? { ...piece, solved: true }
                : piece
            )
          );
        } else {
          setPieces((prev) =>
            prev.map((piece) =>
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
                ? { ...piece, flipped: false }
                : piece
            )
          );
        }
      }, 600);
    }
  };

  useEffect(() => {
    getCardFlipped();
  }, [pieces]);

  //confiti
  const ConfettiSideCannons = () => {
    const end = Date.now() + 5 * 1000;
    const colors = ["#4515caff", "#d41d1dff", "#1ac835ff", "#e3e935ff"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    
    <main>
      {/* <Header/> */}
      <h2>Memory Card Game</h2>

      {!gameStarted && (
        <button
          onClick={() => {
            setGameStarted(true);
            startGame(); // initialize cards
            setTimeLeft(60); // start timer
          }}
          className="start-btn"
        >
          Start Game 🎮
        </button>
      )}

      {gameStarted && (
        <div className="counter">
          <h3>
            Time : {timeLeft} | Level : {level}{" "}
          </h3>
        </div>
      )}

      <div className="container">
        {gameStarted &&
          pieces.map((data, index) => (
            <div
              className={`flip-card ${
                data.flipped || data.solved ? "active" : ""
              }`}
              key={index}
              onClick={() => handleActive(data)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front" />
                <div className="flip-card-back">{data.emoji}</div>
              </div>
            </div>
          ))}
      </div>

      {isGameCompleted && (
        <div className="game-completed">
          <h1>YOU WIN!!!</h1>
        </div>
      )}

      {isGameLost && ( 
        <div className="game-over">
          <h1>YOU LOSE!!!</h1>
        </div>
     )}
    <Footer/>
    </main>
    
  );
  
}

export default App;

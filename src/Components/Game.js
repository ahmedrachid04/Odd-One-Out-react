import React, { useState, useEffect } from "react";
import { topics } from "./topics";

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const flattenTopics = () => Object.values(topics).flat();

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState({});
  const [roundData, setRoundData] = useState(null);
  const [votes, setVotes] = useState({});
  const [gamePhase, setGamePhase] = useState("setup");
  const [loading, setLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    document.title = "🎯 Odd One Out Game!";
  }, []);

  const startGame = () => {
    setLoading(true);
    setTimeout(() => {
      const scoreInit = {};
      players.forEach((p) => (scoreInit[p] = 0));
      const realTopic = getRandomItem(flattenTopics());
      const outPlayer = getRandomItem(players);
      let asker = getRandomItem(players);
      let answerer = getRandomItem(players.filter(p => p !== asker));
      setRoundData({ asker, answerer, outPlayer, topic: realTopic, questionsAsked: 0 });
      setScores(scoreInit);
      setGamePhase("question");
      setLoading(false);
    }, 1000);
  };

  const handleVote = (voter, votee) => {
    setVotes((prev) => ({ ...prev, [voter]: votee }));
  };

  const endVoting = () => {
    setLoading(true);
    setTimeout(() => {
      setGamePhase("guess");
      setLoading(false);
    }, 1000);
  };

  const handleGuess = (guess) => {
    setLoading(true);
    setTimeout(() => {
      let newScores = { ...scores };
      const correctGuess = guess === roundData.topic;
      players.forEach((p) => {
        if (p === roundData.outPlayer) {
          newScores[p] += correctGuess ? roundData.questionsAsked * 10 : 0;
        } else if (votes[p] === roundData.outPlayer) {
          newScores[p] += 30;
        }
      });
      setScores(newScores);
      setGamePhase("leaderboard");
      setLoading(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayers([]);
    setScores({});
    setRoundData(null);
    setVotes({});
    setGamePhase("setup");
  };

  const pageStyles = {
    padding: "20px",
    maxWidth: "420px",
    margin: "0 auto",
    fontFamily: "'Comic Sans MS', 'Poppins', cursive",
    animation: "fadeIn 1s ease-in-out",
  };

  const buttonStyles = (bgColor) => ({
    padding: "12px",
    width: "100%",
    marginTop: "10px",
    borderRadius: "30px",
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: bgColor,
    color: "white",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const buttonHover = {
    transform: "scale(1.05)",
    filter: "brightness(110%)",
  };

  const bubbleBox = {
    backgroundColor: "#f0f9ff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  };

  const spinnerStyle = {
    width: "50px",
    height: "50px",
    border: "6px solid lightgray",
    borderTop: "6px solid #ff6b81",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "30px auto",
  };

  return (
    <div style={pageStyles}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", textAlign: "center", marginBottom: "20px", color: "#ff6b81" }}>
        🎯 Odd One Out
      </h1>

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <div style={spinnerStyle}></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div style={bubbleBox}>
          {gamePhase === "setup" && (
            <>
              <input
                placeholder="Enter player name..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "20px",
                  border: "2px solid #ffcccb",
                  marginBottom: "10px",
                  fontSize: "16px",
                }}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button
                style={{
                  ...buttonStyles("#ff9ff3"),
                  ...(hoveredButton === "add" ? buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton("add")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => {
                  if (playerName && !players.includes(playerName)) {
                    setPlayers([...players, playerName]);
                    setPlayerName("");
                  }
                }}
              >
                ➕ Add Player
              </button>

              <ul style={{ listStyle: "none", textAlign: "center", marginTop: "10px", padding: 0 }}>
                {players.map((p) => (
                  <li key={p} style={{ margin: "4px 0", fontSize: "18px" }}>{p}</li>
                ))}
              </ul>

              <button
                disabled={players.length < 3}
                style={{
                  ...buttonStyles("#00cec9"),
                  marginTop: "20px",
                  ...(hoveredButton === "start" ? buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton("start")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={startGame}
              >
                🚀 Start Game
              </button>
            </>
          )}

          {gamePhase === "question" && roundData && (
            <>
              <p style={{ textAlign: "center", fontSize: "18px", marginBottom: "10px" }}>
                Topic: <strong>{roundData.outPlayer === roundData.asker || roundData.outPlayer === roundData.answerer ? "❓ SECRET" : roundData.topic}</strong>
              </p>
              <p style={{ textAlign: "center", marginBottom: "20px" }}>
                Asker: <b>{roundData.asker}</b> | Answerer: <b>{roundData.answerer}</b>
              </p>
              <button
                style={{
                  ...buttonStyles("#74b9ff"),
                  ...(hoveredButton === "ask" ? buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton("ask")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => setRoundData({ ...roundData, questionsAsked: roundData.questionsAsked + 1 })}
              >
                ❓ Ask Question
              </button>
              <button
                style={{
                  ...buttonStyles("#a29bfe"),
                  ...(hoveredButton === "next" ? buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton("next")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => setGamePhase("vote")}
              >
                ➡️ Next Phase
              </button>
            </>
          )}

          {gamePhase === "vote" && (
            <>
              <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>
                🗳️ Vote for the Odd One Out
              </h2>
              {players.map((voter) => (
                <div key={voter} style={{ marginBottom: "10px" }}>
                  <label><b>{voter}</b> votes:</label>
                  <select
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "15px",
                      marginTop: "5px",
                      border: "2px solid #81ecec",
                    }}
                    onChange={(e) => handleVote(voter, e.target.value)}
                  >
                    <option value="">--</option>
                    {players.filter(p => p !== voter).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                style={{
                  ...buttonStyles("#fab1a0"),
                  ...(hoveredButton === "submit" ? buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton("submit")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={endVoting}
              >
                ✅ Submit Votes
              </button>
            </>
          )}

          {gamePhase === "guess" && (
            <>
              <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>
                🎯 Guess the Topic!
              </h2>
              <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
                {Object.entries(topics).map(([category, items]) => (
                  <div key={category} style={{ marginBottom: "10px" }}>
                    <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>{category}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                      {items.map((item) => (
                        <button
                          key={item}
                          style={{
                            padding: "8px",
                            borderRadius: "15px",
                            backgroundColor: "#ffeaa7",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() => handleGuess(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {gamePhase === "leaderboard" && (
            <>
              <h2 style={{ textAlign: "center", fontSize: "28px", marginBottom: "20px", color: "#00b894" }}>
                🏆 Leaderboard
              </h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([player, score]) => (
                  <li key={player} style={{ marginBottom: "8px", fontSize: "18px", textAlign: "center" }}>
                    {player}: <strong>{score}</strong> pts
                  </li>
                ))}
              </ul>
              <button
                style={{
                  ...buttonStyles("#55efc4"),
                  marginTop: "20px",
                  ...(hoveredButton === "newgame" ? buttonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton("newgame")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={resetGame}
              >
                🔄 New Game
              </button>
            </>
          )}
        </div>
      )}

      {/* Animations keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Game;

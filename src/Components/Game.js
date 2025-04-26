import React, { useState } from "react";
import { topics } from "./topics";

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const flattenTopics = () => Object.values(topics).flat();

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "5px solid lightgray",
  borderTop: "5px solid #3498db",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "20px auto",
};

const buttonStyle = {
  padding: "12px",
  width: "100%",
  borderRadius: "8px",
  border: "none",
  color: "white",
  backgroundColor: "#3498db",
  fontSize: "16px",
  cursor: "pointer",
  transition: "transform 0.2s, background-color 0.3s",
};

const buttonHoverStyle = {
  transform: "scale(1.05)",
  backgroundColor: "#2980b9",
};

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState({});
  const [roundData, setRoundData] = useState(null);
  const [votes, setVotes] = useState({});
  const [gamePhase, setGamePhase] = useState("setup");
  const [loading, setLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

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

  return (
    <div style={{
      padding: "20px",
      maxWidth: "400px",
      margin: "0 auto",
      animation: "fadeIn 0.8s ease-in-out",
    }}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>
        Odd One Out
      </h1>

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <div style={spinnerStyle}></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {gamePhase === "setup" && (
            <>
              <input
                placeholder="Enter player name"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  border: "1px solid lightgray",
                  fontSize: "16px",
                }}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button
                style={{
                  ...buttonStyle,
                  ...(hoveredButton === "add" ? buttonHoverStyle : {}),
                  backgroundColor: "#2ecc71",
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
                Add Player
              </button>

              <ul style={{ textAlign: "center", marginTop: "10px" }}>
                {players.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              <button
                disabled={players.length < 3}
                style={{
                  ...buttonStyle,
                  marginTop: "20px",
                  ...(hoveredButton === "start" ? buttonHoverStyle : {}),
                  backgroundColor: "#e67e22",
                }}
                onMouseEnter={() => setHoveredButton("start")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={startGame}
              >
                Start Game
              </button>
            </>
          )}

          {gamePhase === "question" && roundData && (
            <>
              <div style={{ textAlign: "center", marginBottom: "10px", fontSize: "18px" }}>
                Topic: <i>{roundData.outPlayer === roundData.asker || roundData.outPlayer === roundData.answerer ? "SECRET" : roundData.topic}</i>
              </div>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                Asker: <strong>{roundData.asker}</strong> | Answerer: <strong>{roundData.answerer}</strong>
              </div>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#9b59b6",
                  ...(hoveredButton === "ask" ? buttonHoverStyle : {}),
                }}
                onMouseEnter={() => setHoveredButton("ask")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() =>
                  setRoundData({ ...roundData, questionsAsked: roundData.questionsAsked + 1 })
                }
              >
                Ask Question
              </button>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#34495e",
                  marginTop: "10px",
                  ...(hoveredButton === "next" ? buttonHoverStyle : {}),
                }}
                onMouseEnter={() => setHoveredButton("next")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => setGamePhase("vote")}
              >
                Next Phase
              </button>
            </>
          )}

          {gamePhase === "vote" && (
            <>
              <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                Vote for the Odd One Out
              </h2>
              {players.map((voter) => (
                <div key={voter} style={{ marginBottom: "10px" }}>
                  <label style={{ fontWeight: "bold" }}>{voter}:</label>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "5px",
                      borderRadius: "8px",
                      border: "1px solid lightgray",
                    }}
                    onChange={(e) => handleVote(voter, e.target.value)}
                  >
                    <option value="">--</option>
                    {players.filter(p => p !== voter).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#e74c3c",
                  ...(hoveredButton === "submit" ? buttonHoverStyle : {}),
                }}
                onMouseEnter={() => setHoveredButton("submit")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={endVoting}
              >
                Submit Votes
              </button>
            </>
          )}

          {gamePhase === "guess" && (
            <>
              <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
                {roundData.outPlayer}, guess the topic!
              </h2>
              <div style={{ maxHeight: "50vh", overflowY: "scroll" }}>
                {Object.entries(topics).map(([category, items]) => (
                  <div key={category}>
                    <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>{category}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                      {items.map((item) => (
                        <button
                          key={item}
                          style={{
                            padding: "10px",
                            backgroundColor: "#ecf0f1",
                            border: "none",
                            borderRadius: "8px",
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
              <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                Leaderboard
              </h2>
              <ul style={{ listStyleType: "none", padding: "0" }}>
                {Object.entries(scores)
                  .sort((a, b) => b[1] - a[1])
                  .map(([player, score]) => (
                    <li
                      key={player}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        fontSize: "18px",
                      }}
                    >
                      <span>{player}</span>
                      <span>{score} pts</span>
                    </li>
                  ))}
              </ul>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#1abc9c",
                  marginTop: "30px",
                  ...(hoveredButton === "newgame" ? buttonHoverStyle : {}),
                }}
                onMouseEnter={() => setHoveredButton("newgame")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={resetGame}
              >
                New Game
              </button>
            </>
          )}
        </>
      )}

      {/* Animations keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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

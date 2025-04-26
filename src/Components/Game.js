import React, { useState, useEffect } from "react";
import { topics } from "./topics"; // your same topics.js
import Confetti from "react-confetti";

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState({});
  const [phase, setPhase] = useState("setup");
  const [chosenTopic, setChosenTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [outPlayer, setOutPlayer] = useState("");
  const [revealedPlayers, setRevealedPlayers] = useState([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [currentVotingIndex, setCurrentVotingIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [guessOptions, setGuessOptions] = useState([]);
  const [gameResult, setGameResult] = useState("");
  const [asker, setAsker] = useState("");
  const [answerer, setAnswerer] = useState("");

  useEffect(() => {
    if (phase === "voting-result") {
      calculateVotingResults();
    }
  }, [phase]);
  

  const pageStyle = {
    fontFamily: "'Poppins', 'Comic Sans MS', cursive",
    textAlign: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #fceabb, #f8b500)",
    minHeight: "100vh",
    color: "#333",
  };

  const buttonStyle = {
    backgroundColor: "#ff6b81",
    color: "white",
    padding: "15px 20px",
    border: "none",
    borderRadius: "30px",
    marginTop: "20px",
    fontSize: "18px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
  };

  const nextButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#1abc9c",
  };

  const voteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#74b9ff",
    marginTop: "10px",
  };

  const resetButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#636e72",
    marginTop: "30px",
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "20px",
    border: "2px solid #fab1a0",
    width: "80%",
    marginBottom: "10px",
    fontSize: "16px",
  };

  const startGame = () => {
    const scoreInit = {};
    players.forEach(p => (scoreInit[p] = scores[p] || 0));
    setScores(scoreInit);
    setPhase("choose-topic");
  };

  const chooseTopic = (topic) => {
    setChosenTopic(topic);
    const selectedSubject = getRandomItem(topics[topic]);
    setSubject(selectedSubject);
    const chosenOutPlayer = getRandomItem(players);
    setOutPlayer(chosenOutPlayer);
    setRevealedPlayers([]);
    setCurrentRevealIndex(0);
    setPhase("reveal-roles");
  };

  const handleReveal = () => {
    if (currentRevealIndex + 1 < players.length) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    } else {
      chooseRandomPair();
      setPhase("ask-answer");
    }
  };

  const chooseRandomPair = () => {
    let [p1, p2] = getTwoDifferentRandomPlayers();
    if (Math.random() < 0.5) {
      setAsker(p1);
      setAnswerer(p2);
    } else {
      setAsker(p2);
      setAnswerer(p1);
    }
  };

  const getTwoDifferentRandomPlayers = () => {
    let p1 = getRandomItem(players);
    let p2 = getRandomItem(players.filter(p => p !== p1));
    return [p1, p2];
  };

  const startVoting = () => {
    setCurrentVotingIndex(0);
    setVotes({});
    setPhase("voting");
  };

  const castVote = (votedFor) => {
    setVotes({ ...votes, [players[currentVotingIndex]]: votedFor });
    if (currentVotingIndex + 1 < players.length) {
      setCurrentVotingIndex(currentVotingIndex + 1);
    } else {
      setPhase("voting-result");
    }
  };

  const calculateVotingResults = () => {
    const voteCounts = {};
    Object.values(votes).forEach(v => voteCounts[v] = (voteCounts[v] || 0) + 1);
    const mostVoted = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b);
    const correct = mostVoted === outPlayer;

    const newScores = { ...scores };
    players.forEach(p => {
      if (correct && votes[p] === outPlayer) {
        newScores[p] += 10;
      } else if (!correct && p === outPlayer) {
        newScores[p] += 5;
      }
    });

    setScores(newScores);
    setGameResult(correct ? "Players found the out of topic!" : "Wrong vote! The out of topic survived!");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const startGuessing = () => {
    setGuessOptions([...topics[chosenTopic]]);
    setPhase("spy-guess");
  };

  const spyGuess = (guess) => {
    const newScores = { ...scores };
    if (guess === subject) {
      newScores[outPlayer] += 15;
    }
    setScores(newScores);
    setPhase("end-round");
  };

  const resetForNewRound = () => {
    setPhase("choose-topic");
  };

  const resetGame = () => {
    setPlayers([]);
    setScores({});
    setPhase("setup");
  };

  return (
    <div style={pageStyle}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {phase === "setup" && (
        <>
          <h1>🎈 Odd One Out Party 🎈</h1>
          <input
            placeholder="Enter player name..."
            style={inputStyle}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <br />
          <button style={buttonStyle} onClick={() => {
            if (playerName && !players.includes(playerName)) {
              setPlayers([...players, playerName]);
              setPlayerName("");
            }
          }}>
            ➕ Add Player
          </button>
          <div style={{ marginTop: "20px" }}>
            {players.map((p, idx) => (
              <div key={idx}>{p}</div>
            ))}
          </div>
          {players.length >= 3 && (
            <button style={nextButtonStyle} onClick={startGame}>
              🚀 Start Game
            </button>
          )}
        </>
      )}

      {phase === "choose-topic" && (
        <>
          <h2>Choose a Topic</h2>
          {Object.keys(topics).map((topic) => (
            <button key={topic} style={voteButtonStyle} onClick={() => chooseTopic(topic)}>
              {topic}
            </button>
          ))}
        </>
      )}

      {phase === "reveal-roles" && (
        <>
          <h2>🔎 Role Reveal</h2>
          <h3>{players[currentRevealIndex]}</h3>
          <button style={buttonStyle} onClick={() => {
            alert(players[currentRevealIndex] === outPlayer
              ? "❌ You are out of topic!"
              : `✅ Your subject: ${subject}`);
            handleReveal();
          }}>
            I am {players[currentRevealIndex]}
          </button>
        </>
      )}

      {phase === "ask-answer" && (
        <>
          <h2>❓ Question Time</h2>
          <p><strong>{asker}</strong> asks a question to <strong>{answerer}</strong>!</p>
          <button style={nextButtonStyle} onClick={chooseRandomPair}>
            🔄 Next Pair
          </button>
          <br />
          <button style={voteButtonStyle} onClick={startVoting}>
            🗳️ Start Voting
          </button>
        </>
      )}

      {phase === "voting" && (
        <>
          <h2>🗳️ {players[currentVotingIndex]}, who do you vote for?</h2>
          {players.filter(p => p !== players[currentVotingIndex]).map((p) => (
            <button key={p} style={voteButtonStyle} onClick={() => castVote(p)}>
              {p}
            </button>
          ))}
        </>
      )}

      {phase === "voting-result" && (
        <>
          <h2>🎉 Voting Results!</h2>
          <p>{gameResult}</p>
          <button style={nextButtonStyle} onClick={startGuessing}>
            🎯 Spy Guess!
          </button>
        </>
      )}

      {phase === "spy-guess" && (
        <>
          <h2>🎯 {outPlayer}, guess the subject!</h2>
          {guessOptions.map((option) => (
            <button key={option} style={voteButtonStyle} onClick={() => spyGuess(option)}>
              {option}
            </button>
          ))}
        </>
      )}

      {phase === "end-round" && (
        <>
          <h2>✅ Round Finished!</h2>
          <button style={nextButtonStyle} onClick={resetForNewRound}>
            🔄 Start New Round
          </button>
          <button style={resetButtonStyle} onClick={() => setPhase("leaderboard")}>
            🏆 See Leaderboard
          </button>
        </>
      )}

      {phase === "leaderboard" && (
        <>
          <h2>🏆 Leaderboard</h2>
          {Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([player, score]) => (
              <div key={player} style={{ fontSize: "20px", marginBottom: "8px" }}>
                {player}: {score} pts
              </div>
            ))}
          <button style={nextButtonStyle} onClick={resetGame}>
            🔄 Start New Game
          </button>
        </>
      )}
    </div>
  );
};

export default Game;

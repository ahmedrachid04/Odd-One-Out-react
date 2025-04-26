import React, { useState } from "react";
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

  const startGame = () => {
    const scoreInit = {};
    players.forEach((p) => (scoreInit[p] = 0));
    const realTopic = getRandomItem(flattenTopics());
    const outPlayer = getRandomItem(players);
    let asker = getRandomItem(players);
    let answerer = getRandomItem(players.filter(p => p !== asker));
    setRoundData({ asker, answerer, outPlayer, topic: realTopic, questionsAsked: 0 });
    setScores(scoreInit);
    setGamePhase("question");
  };

  const handleVote = (voter, votee) => {
    setVotes((prev) => ({ ...prev, [voter]: votee }));
  };

  const endVoting = () => {
    setGamePhase("guess");
  };

  const handleGuess = (guess) => {
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
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Odd One Out</h1>

      {gamePhase === "setup" && (
        <>
          <input
            placeholder="Enter player name"
            className="w-full p-3 border rounded"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white p-3 rounded"
            onClick={() => {
              if (playerName && !players.includes(playerName)) {
                setPlayers([...players, playerName]);
                setPlayerName("");
              }
            }}
          >
            Add Player
          </button>

          <ul className="space-y-1 text-center">
            {players.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <button
            disabled={players.length < 3}
            className="w-full bg-green-600 text-white p-3 rounded mt-4"
            onClick={startGame}
          >
            Start Game
          </button>
        </>
      )}

      {gamePhase === "question" && roundData && (
        <div className="space-y-4">
          <p className="text-center text-lg font-semibold">Topic: <span className="italic">{roundData.outPlayer === roundData.asker || roundData.outPlayer === roundData.answerer ? "SECRET" : roundData.topic}</span></p>
          <p className="text-center">Asker: <strong>{roundData.asker}</strong></p>
          <p className="text-center">Answerer: <strong>{roundData.answerer}</strong></p>
          <button
            className="w-full bg-yellow-500 text-white p-3 rounded"
            onClick={() =>
              setRoundData({
                ...roundData,
                questionsAsked: roundData.questionsAsked + 1,
              })
            }
          >
            Ask Question
          </button>
          <button
            className="w-full bg-indigo-600 text-white p-3 rounded"
            onClick={() => setGamePhase("vote")}
          >
            Go to Voting
          </button>
        </div>
      )}

      {gamePhase === "vote" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">Vote who’s out of the loop</h2>
          {players.map((voter) => (
            <div key={voter} className="flex flex-col">
              <label className="mb-1 font-medium">{voter}'s vote:</label>
              <select
                className="p-2 border rounded"
                onChange={(e) => handleVote(voter, e.target.value)}
              >
                <option value="">--</option>
                {players
                  .filter((p) => p !== voter)
                  .map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
              </select>
            </div>
          ))}
          <button
            className="w-full bg-red-500 text-white p-3 rounded"
            onClick={endVoting}
          >
            Submit Votes
          </button>
        </div>
      )}

      {gamePhase === "guess" && (
        <div>
          <h2 className="text-xl font-bold text-center mb-4">
            {roundData.outPlayer}, guess the topic!
          </h2>
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {Object.entries(topics).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-semibold text-gray-700">{category}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {items.map((item) => (
                    <button
                      key={item}
                      className="bg-gray-100 p-2 text-sm rounded"
                      onClick={() => handleGuess(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gamePhase === "leaderboard" && (
        <div>
          <h2 className="text-2xl font-bold text-center">Leaderboard</h2>
          <ul className="mt-4 space-y-2">
            {Object.entries(scores)
              .sort((a, b) => b[1] - a[1])
              .map(([player, score]) => (
                <li key={player} className="flex justify-between border-b p-2">
                  <span>{player}</span>
                  <span>{score} pts</span>
                </li>
              ))}
          </ul>
          <button
            className="w-full bg-black text-white p-3 rounded mt-6"
            onClick={() => {
              setGamePhase("setup");
              setPlayers([]);
              setScores({});
              setRoundData(null);
              setVotes({});
            }}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;

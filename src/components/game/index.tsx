import { useEffect, useState } from "react";
import Board from "../board";
import { generateBoard, isGameOver, moveTiles } from "../gameLogic";
import ModalWin from "./modal/index.tsx";
import styles from "./styles.module.scss";
import { Board as BoardType, Direction } from "../../types/game.ts";

const useGameLogic = () => {
  const [tiles, setTiles] = useState<BoardType>(generateBoard);
  const [score, setScore] = useState<number>(0);
  const [newTiles, setNewTiles] = useState<Set<string>>(new Set());
  const [mergedTiles, setMergedTiles] = useState<Set<string>>(new Set());
  const [bestScore, setBestScore] = useState<number>(
    Number(localStorage.getItem("bestScore")) || 0,
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("bestScore", bestScore.toString());
  }, [bestScore]);

  const handleMove = (direction: Direction) => {
    const { newBoard, points, newTiles, mergedTiles } = moveTiles(
      tiles,
      direction,
    );
    setTiles(newBoard);
    setScore(score + points);
    setNewTiles(newTiles);
    setMergedTiles(mergedTiles);

    if (score + points > bestScore) {
      setBestScore(score + points);
    }

    if (isGameOver(newBoard)) {
      setShowModal(true);
    }
  };

  const resetGame = () => {
    setTiles(generateBoard);
    setScore(0);
    setShowModal(false);
  };

  return {
    tiles,
    score,
    bestScore,
    showModal,
    newTiles,
    mergedTiles,
    setShowModal,
    handleMove,
    resetGame,
  };
};

const Game = () => {
  const {
    tiles,
    score,
    bestScore,
    showModal,
    newTiles,
    mergedTiles,
    setShowModal,
    handleMove,
    resetGame,
  } = useGameLogic();

  return (
    <>
      <div className={styles.game}>
        <div className={styles.topContainer}>
          <div className={styles.scoreContainer}>
            <div className={styles.gameNaming}>2048</div>
            <div className={styles.scoreBox}>
              SCORE <span>{score}</span>
            </div>
            <div className={styles.scoreBox}>
              BEST SCORE <span>{bestScore}</span>
            </div>
          </div>

          <button className={styles.resetButton} onClick={resetGame}>
            RESET GAME
          </button>
        </div>

          <Board
              tiles={tiles}
              onMove={handleMove}
              newTiles={newTiles}
              mergedTiles={mergedTiles}
          />
        </div>

        <ModalWin
            isOpen={showModal}
            score={score}
            onClose={() => setShowModal(false)}
        />
    </>
  );
};

export default Game;

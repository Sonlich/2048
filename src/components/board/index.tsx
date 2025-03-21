import { useEffect } from "react";
import Tile from "../tile/index.tsx";
import styles from "./styles.module.scss";
import { Board as BoardType, Direction } from "../../types/game.ts";

interface BoardProps {
  tiles: BoardType;
  onMove: (direction: Direction) => void;
  newTiles: Set<string>;
  mergedTiles: Set<string>;
}

const Board = ({ tiles, onMove, newTiles, mergedTiles }: BoardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        onMove(event.key as Direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onMove]);

  return (
    <div className={styles.board}>
      {tiles.map((row, rowIndex) =>
        row.map((num, colIndex) => (
          <Tile
                key={`${rowIndex}-${colIndex}`}
                num={num}
                isNew={newTiles.has(`${rowIndex}-${colIndex}`)}
                isMerged={mergedTiles.has(`${rowIndex}-${colIndex}`)}
          />
        )),
      )}
    </div>
  );
};

export default Board;

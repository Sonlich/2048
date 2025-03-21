import { Board, Direction } from "../types/game.ts";

export const generateBoard = (): Board => {
  const board: Board = Array.from({ length: 4 }, () => Array(4).fill(0));

  addRandomTile(board);
  addRandomTile(board);

  return board;
};

export const addRandomTile = (board: Board): void => {
  const emptyTiles = getEmptyTiles(board);
  if (emptyTiles.length === 0) return;

  const { row, col } = randomTile(emptyTiles);
  board[row][col] = Math.random() > 0.9 ? 4 : 2;
};

export const isGameOver = (board: Board): boolean => {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) return false;

      if (col < 3 && board[row][col] === board[row][col + 1]) return false;
      if (row < 3 && board[row][col] === board[row + 1][col]) return false;
    }
  }

  return true;
};

export const moveTiles = (
  board: Board,
  direction: Direction,
): {
  newBoard: Board;
  points: number;
  newTiles: Set<string>;
  mergedTiles: Set<string>;
} => {
  let points = 0;
  let newBoard: Board = board.map((row) => [...row]);
  const newTiles = new Set<string>();
  const mergedTiles = new Set<string>();
  let boardChanged = false;

  const mergeLine = (row: number[]): number[] => {
    const filtered = row.filter((val) => val !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        points += filtered[i];
        filtered.splice(i + 1, 1);
      }
    }

    return [...filtered, ...Array(4 - filtered.length).fill(0)];
  };

  const getColumn = (board: Board, colIndex: number): number[] => {
    return board.map((row) => row[colIndex]);
  };

  const setColumn = (
    board: Board,
    colIndex: number,
    newCol: number[],
  ): void => {
    newCol.forEach((value, rowIndex) => {
      board[rowIndex][colIndex] = value;
    });
  };

  const directions = {
    ArrowLeft: () => {
      newBoard = newBoard.map((row, index) => {
        const mergedRow = mergeLine(row);
        if (!boardChanged && !arrayEqual(row, mergedRow)) boardChanged = true;
        mergedRow.forEach((val, col) => {
          if (val !== 0 && val !== row[col]) mergedTiles.add(`${index}-${col}`);
        });
        return mergedRow;
      });
    },

    ArrowRight: () => {
      newBoard = newBoard.map((row, index) => {
        const reverseRow = [...row].reverse();
        const mergedRow = mergeLine(reverseRow).reverse();
        if (!boardChanged && !arrayEqual(row, mergedRow)) boardChanged = true;
        mergedRow.forEach((val, col) => {
          if (val !== 0 && val !== row[col]) mergedTiles.add(`${index}-${col}`);
        });
        return mergedRow;
      });
    },

    ArrowUp: () => {
      for (let col = 0; col < 4; col++) {
        const column = getColumn(newBoard, col);
        const mergedColumn = mergeLine(column);
        if (!boardChanged && !arrayEqual(column, mergedColumn))
          boardChanged = true;
        mergedColumn.forEach((val, row) => {
          if (val !== 0 && val !== column[row])
            mergedTiles.add(`${row}-${col}`);
        });
        setColumn(newBoard, col, mergedColumn);
      }
    },

    ArrowDown: () => {
      for (let col = 0; col < 4; col++) {
        const column = getColumn(newBoard, col);
        const reverseColumn = [...column].reverse();
        const mergedColumn = mergeLine(reverseColumn).reverse();
        if (!boardChanged && !arrayEqual(column, mergedColumn))
          boardChanged = true;
        mergedColumn.forEach((val, row) => {
          if (val !== 0 && val !== column[row])
            mergedTiles.add(`${row}-${col}`);
        });
        setColumn(newBoard, col, mergedColumn);
      }
    },
  };

  directions[direction]();

  if (boardChanged) {
    const emptyTiles = getEmptyTiles(newBoard);

    if (emptyTiles.length) {
      const { row, col } = randomTile(emptyTiles);
      newBoard[row][col] = Math.random() > 0.9 ? 4 : 2;
      newTiles.add(`${row}-${col}`);
    }
  }

  return { newBoard, points, newTiles, mergedTiles };
};

const getEmptyTiles = (board: Board): { row: number; col: number }[] => {
  const emptyTiles: { row: number; col: number }[] = [];

  board.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile === 0) emptyTiles.push({ row: rowIndex, col: colIndex });
    });
  });

  return emptyTiles;
};

const randomTile = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const arrayEqual = (a: number[], b: number[]) =>
  a.every((val, index) => val === b[index]);

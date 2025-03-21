import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";

interface TileProps {
  num: number;
  isNew?: boolean;
  isMerged?: boolean;
}

const Tile = ({ num, isNew, isMerged }: TileProps) => {
  const tileRef = useRef<HTMLDivElement>(null);
  const getTileColor = (num: number) => {
    if (num === 0) return "var(--empty-tile-color)";
    const makeDarkerColor = 85 - Math.log2(num) * 6;
    return `hsl(35, 70%, ${makeDarkerColor}%)`;
  };

  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;

    if (isNew || isMerged) {
      el.classList.remove(styles.new, styles.merged);

      void el.offsetWidth;

      if (isNew) el.classList.add(styles.new);
      if (isMerged) el.classList.add(styles.merged);
    }
  }, [isNew, isMerged]);

  return (
    <div
      className={`${styles.tile} ${isNew ? styles.new : ""} ${isMerged ? styles.merged : ""}`}
      style={{ backgroundColor: getTileColor(num) }}
    >
      {num !== 0 ? num : ""}
    </div>
  );
};

export default Tile;

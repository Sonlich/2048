import ReactModal from "react-modal";
import styles from "./styles.module.scss";

interface ModalWinProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
}

ReactModal.setAppElement("#root");

const ModalWin = ({ isOpen, onClose, score }: ModalWinProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.overlay}
      closeTimeoutMS={300}
    >
      <h2>Game Over!</h2>
      <p>
        Score: <strong>{score}</strong>
      </p>
      <button onClick={onClose} className={styles.closeButton}>
        Close
      </button>
    </ReactModal>
  );
};

export default ModalWin;

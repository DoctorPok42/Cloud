import React from 'react';

import styles from './style.module.scss';

interface AlertDialogProps {
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertDialog = ({
  title,
  content,
  onClose,
  onConfirm,
}: AlertDialogProps) => {
  return (
    <div className={styles.AlertDialog_container}>
      <div className={styles.AlertDialog_content}>
        <div className={styles.AlertDialog_title}>
          <h2>
            {title}
          </h2>
        </div>

        <div className={styles.AlertDialog_body}>
          <p>
            {content}
          </p>
        </div>

        <div className={styles.AlertDialog_footer}>
          <button onClick={onClose} className={styles.AlertDialog_button} style={{
            backgroundColor: "transparent",
            color: "var(--black)",
          }}>
            Annuler
          </button>
          <button onClick={onConfirm} className={styles.AlertDialog_button}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;

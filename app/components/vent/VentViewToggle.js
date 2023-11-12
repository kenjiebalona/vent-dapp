import React, { useState } from 'react';
import styles from '../../styles/Vent.module.css';

const VentViewToggle = ({ onViewChange }) => {
  const handleButtonClick = (view) => {
    onViewChange(view);
  };

  return (
    <div className={styles.ventViewToggle}>
      <button
        className={styles.ventViewButton}
        onClick={() => handleButtonClick('own')}
      >
        Own
      </button>
      <button
        className={styles.ventViewButton}
        onClick={() => handleButtonClick('all')}
      >
        All
      </button>
    </div>
  );
};

export default VentViewToggle;

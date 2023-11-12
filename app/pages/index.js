import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useVent } from '../hooks/vent';
import Loading from '../components/Loading';
import VentSection from '../components/vent/VentSection';
import VentViewToggle from '../components/vent/VentViewToggle';
import styles from '../styles/Home.module.css';
import { useState } from 'react';

const Home = () => {
  const {
    initialized,
    initializeUser,
    loading,
    transactionPending,
    vents,
    allVents,
    addVent,
    removeVent,
    markStaticVent,
    input,
    handleChange,
  } = useVent();

  const [view, setView] = useState('all');

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        {initialized ? (
          <div className={styles.ventInput}>
            <div className={`${styles.ventCheckbox} ${styles.checked}`} />
            <div className={styles.inputContainer}>
              <form onSubmit={addVent}>
                <input
                  value={input}
                  onChange={handleChange}
                  id={styles.inputField}
                  type="text"
                  placeholder="Share your thoughts and feelings here..."
                />
              </form>
            </div>
            <div className={styles.iconContainer}></div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.button}
            onClick={() => initializeUser()}
            disabled={transactionPending}
          >
            Initialize
          </button>
        )}
        <WalletMultiButton />
      </div>

      <div className={styles.mainContainer}>
        <VentViewToggle onViewChange={handleViewChange} />
        <Loading loading={loading}>
          {view === 'own' ? (
            <VentSection
              title="Yours"
              vents={vents}
              action={removeVent}
            />
          ) : (
            <VentSection
              title="All"
              vents={allVents}
              action={removeVent}
            />
          )}
        </Loading>
      </div>
    </div>
  );
};

export default Home;

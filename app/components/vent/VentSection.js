import styles from '../../styles/Vent.module.css';
import VentList from './VentList';

const VentSection = ({ title, vents, action }) => {
  return (
    <div className={styles.ventSection}>
      <h1 className="title">
        {title} - {vents.length}
      </h1>

      <VentList vents={vents} action={action} />
    </div>
  );
};

export default VentSection;

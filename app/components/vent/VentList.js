import styles from '../../styles/Vent.module.css';
import VentItem from './VentItem';

const VentList = ({ vents, action }) => {
  return (
    <ul className={styles.ventList}>
      {vents.map((vent) => (
        <VentItem
          key={vent.account.idx}
          {...vent.account}
          publicKey={vent.publicKey}
          action={action}
        />
      ))}
    </ul>
  );
};

export default VentList;

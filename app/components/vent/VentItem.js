import styles from '../../styles/Vent.module.css';
import { CalendarIcon, TrashIcon } from '@heroicons/react/outline';
import sliceAddress from '../../utils/sliceAddress';
import Link from 'next/link';

const VentItem = ({
  idx,
  content,
  marked,
  dateline,
  publicKey,
  action,
  authority,
}) => {
  const handleMarkVent = () => {
    // Only allow unchecked vent to be marked
    if (marked) return;

    action(idx);
  };

  const handleRemoveVent = () => {
    // Only allow checked vent to be removed
    if (!marked) return;

    action(publicKey, idx);
  };

  return (
    <li key={idx} className={styles.ventItem}>
      <div className={styles.contentContainer}>
        <span className="ventText">{content}</span>

        {dateline && (
          <div className={styles.ventDateline}>
            <CalendarIcon className={styles.calendarIcon} />
            <span>{dateline}</span>
          </div>
        )}
        <div className={styles.addressContainer}>
          <span className={styles.address}>
            by:{' '}
            <a
              href={`https://explorer.solana.com/address/${authority.toString()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sliceAddress(authority.toString())}
            </a>
          </span>
          <span className={styles.address}>
            pubKey:{' '}
            <a
              href={`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sliceAddress(publicKey.toString())}
            </a>
          </span>
        </div>
      </div>
      {/* <div className={styles.iconContainer}>
        <TrashIcon
          onClick={handleRemoveVent}
          className={`${styles.trashIcon} ${!marked && styles.checked}`}
        />
      </div> */}
    </li>
  );
};

export default VentItem;

import { motion } from 'framer-motion';
import styles from '@/styles/Toast.module.css';

const ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️'
};

export default function Toast({ message, type = 'info', onClose }) {
  return (
    <motion.div
      className={`${styles.toast} ${styles[type]}`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <span className={styles.icon}>{ICONS[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
    </motion.div>
  );
}
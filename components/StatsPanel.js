import { motion } from 'framer-motion';
import styles from '@/styles/StatsPanel.module.css';

const TIPO_LABELS = {
  pothole: 'Baches',
  traffic_light: 'Semáforos',
  light: 'Alumbrado',
  other: 'Otros'
};

const TIPO_COLORS = {
  pothole: '#e74c3c',
  traffic_light: '#f39c12',
  light: '#3498db',
  other: '#9b59b6'
};

const ESTADO_LABELS = {
  pendiente: 'Pendientes',
  'en proceso': 'En Proceso',
  terminado: 'Terminados',
  rechazado: 'Rechazados'
};

const ESTADO_COLORS = {
  pendiente: '#e74c3c',
  'en proceso': '#f39c12',
  terminado: '#27ae60',
  rechazado: '#95a5a6'
};

export default function StatsPanel({ estadisticas, onItemClick }) {
  if (!estadisticas) return null;

  const { tiposReportes = [], estados, totalReportes, materiales } = estadisticas;

  const tipoData = Object.keys(TIPO_LABELS).map(tipo => {
    const found = tiposReportes.find(t => t.tipo === tipo);
    return {
      tipo,
      label: TIPO_LABELS[tipo],
      cantidad: found?.cantidad || 0,
      color: TIPO_COLORS[tipo]
    };
  });

  const estadoData = estados
    ? Object.entries(ESTADO_LABELS).map(([key, label]) => ({
        key,
        label,
        cantidad: estados[key] || 0,
        color: ESTADO_COLORS[key]
      }))
    : [];

  return (
    <div className={styles.container}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Estadísticas
      </motion.h2>

      <div className={styles.totalCard}>
        <motion.div
          className={styles.totalNumber}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {totalReportes || 0}
        </motion.div>
        <p className={styles.totalLabel}>Total Reportes</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Por Tipo</h3>
        <div className={styles.cardsGrid}>
          {tipoData.map((item, index) => (
            <motion.div
              key={item.tipo}
              className={styles.statCard}
              style={{ '--card-color': item.color }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: `0 10px 30px ${item.color}40` }}
              onClick={() => onItemClick(item.label)}
            >
              <div className={styles.cardIcon}>
                {item.tipo === 'pothole' && '🕳️'}
                {item.tipo === 'traffic_light' && '🚦'}
                {item.tipo === 'light' && '💡'}
                {item.tipo === 'other' && '📋'}
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{item.cantidad}</span>
                <span className={styles.cardLabel}>{item.label}</span>
              </div>
              <div className={styles.cardBar}>
                <motion.div
                  className={styles.barFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${totalReportes ? (item.cantidad / totalReportes) * 100 : 0}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Por Estado</h3>
        <div className={styles.estadoGrid}>
          {estadoData.map((item, index) => (
            <motion.div
              key={item.key}
              className={styles.estadoItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <span className={styles.estadoDot} style={{ background: item.color }} />
              <span className={styles.estadoLabel}>{item.label}</span>
              <span className={styles.estadoValue}>{item.cantidad}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {materiales && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Materiales Requeridos</h3>
          <div className={styles.materialesGrid}>
            <motion.div
              className={styles.materialCard}
              whileHover={{ scale: 1.02 }}
            >
              <span className={styles.materialIcon}>🏗️</span>
              <span className={styles.materialValue}>
                {materiales.asfalto || 0}
              </span>
              <span className={styles.materialLabel}>kg Asfalto</span>
            </motion.div>
            <motion.div
              className={styles.materialCard}
              whileHover={{ scale: 1.02 }}
            >
              <span className={styles.materialIcon}>🚦</span>
              <span className={styles.materialValue}>
                {materiales.semaforos || 0}
              </span>
              <span className={styles.materialLabel}>Semáforos</span>
            </motion.div>
            <motion.div
              className={styles.materialCard}
              whileHover={{ scale: 1.02 }}
            >
              <span className={styles.materialIcon}>💡</span>
              <span className={styles.materialValue}>
                {materiales.luminarias || 0}
              </span>
              <span className={styles.materialLabel}>Luminarias</span>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
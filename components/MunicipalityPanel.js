import { motion } from 'framer-motion';
import styles from '@/styles/MunicipalityPanel.module.css';

export default function MunicipalityPanel({ estadisticas }) {
  if (!estadisticas || !estadisticas.municipiosConMasReportes) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Municipios</h2>
        <p className={styles.noData}>No hay datos disponibles</p>
      </div>
    );
  }

  const { municipiosConMasReportes } = estadisticas;
  const totalMunicipios = municipiosConMasReportes.reduce((acc, m) => acc + m.total, 0);

  return (
    <div className={styles.container}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Municipios
      </motion.h2>

      <div className={styles.municipiosList}>
        {municipiosConMasReportes.map((municipio, index) => {
          const percentage = totalMunicipios ? (municipio.total / totalMunicipios) * 100 : 0;
          const reportes = municipio.reportes || {};

          return (
            <motion.div
              key={municipio.municipio}
              className={styles.municipioCard}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.municipioHeader}>
                <span className={styles.municipioRank}>#{index + 1}</span>
                <h3 className={styles.municipioName}>{municipio.municipio}</h3>
                <span className={styles.municipioTotal}>{municipio.total}</span>
              </div>

              <div className={styles.municipioBar}>
                <motion.div
                  className={styles.barFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                />
              </div>

              <div className={styles.reportesBreakdown}>
                <p className={styles.breakdownTitle}>Detalle de reportes:</p>
                <div className={styles.breakdownGrid}>
                  {Object.entries(reportes).map(([tipo, cantidad]) => (
                    <div key={tipo} className={styles.breakdownItem}>
                      <span className={styles.tipoLabel}>{formatearTipo(tipo)}</span>
                      <span className={styles.tipoCount}>{cantidad}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Resumen</h3>
        <div className={styles.summaryStats}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{municipiosConMasReportes.length}</span>
            <span className={styles.summaryLabel}>Municipios monitoreados</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{totalMunicipios}</span>
            <span className={styles.summaryLabel}>Total reportes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatearTipo(tipo) {
  const tipos = {
    pothole: 'Baches',
    traffic_light: 'Semáforos',
    light: 'Alumbrado',
    other: 'Otros'
  };
  return tipos[tipo] || tipo;
}
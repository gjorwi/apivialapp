import { motion } from 'framer-motion';
import styles from '@/styles/ReportModal.module.css';

const TIPO_LABELS = {
  pothole: 'Bache',
  traffic_light: 'Semáforo',
  light: 'Alumbrado',
  other: 'Otro'
};

const TIPO_COLORS = {
  pothole: '#e74c3c',
  traffic_light: '#f39c12',
  light: '#3498db',
  other: '#9b59b6'
};

const ESTADO_COLORS = {
  pendiente: '#e74c3c',
  'en proceso': '#f39c12',
  terminado: '#27ae60',
  rechazado: '#95a5a6'
};

export default function ReportModal({ reporte, onClose }) {
  if (!reporte) return null;

  const coords = reporte.ubicacion?.coordinates || [];

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.header} style={{ borderColor: TIPO_COLORS[reporte.tipo] }}>
          <span
            className={styles.tipoBadge}
            style={{ background: TIPO_COLORS[reporte.tipo] }}
          >
            {TIPO_LABELS[reporte.tipo] || 'Otro'}
          </span>
          <h2 className={styles.title}>{reporte.titulo}</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            {reporte.fotoUrl ? (
              <motion.img
                src={reporte.fotoUrl}
                alt={reporte.titulo}
                className={styles.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            ) : (
              <div className={styles.noImage}>📷 Sin imagen</div>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.detailGroup}>
              <label className={styles.label}>Descripción</label>
              <p className={styles.value}>{reporte.descripcion}</p>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailGroup}>
                <label className={styles.label}>Estado</label>
                <span
                  className={styles.estadoBadge}
                  style={{ background: ESTADO_COLORS[reporte.estado] }}
                >
                  {reporte.estado}
                </span>
              </div>

              <div className={styles.detailGroup}>
                <label className={styles.label}>Nivel</label>
                <span className={`${styles.nivelBadge} ${styles[reporte.nivel]}`}>
                  {reporte.nivel}
                </span>
              </div>
            </div>

            <div className={styles.detailGroup}>
              <label className={styles.label}>📍 Ubicación</label>
              <p className={styles.value}>
                {reporte.direccion || 'Sin dirección'}
              </p>
              <p className={styles.subValue}>
                {reporte.municipio && `Municipio: ${reporte.municipio}`}
                {reporte.parroquia && ` - Parroquia: ${reporte.parroquia}`}
              </p>
            </div>

            {coords.length === 2 && (
              <div className={styles.detailGroup}>
                <label className={styles.label}>Coordenadas</label>
                <p className={styles.coords}>
                  Lat: {coords[1].toFixed(6)}, Lng: {coords[0].toFixed(6)}
                </p>
              </div>
            )}

            {reporte.medidas && (
              <div className={styles.detailGroup}>
                <label className={styles.label}>📏 Dimensiones</label>
                <div className={styles.medidas}>
                  {reporte.medidas.largo && (
                    <span>Largo: {reporte.medidas.largo}cm</span>
                  )}
                  {reporte.medidas.ancho && (
                    <span>Ancho: {reporte.medidas.ancho}cm</span>
                  )}
                  {reporte.medidas.alto && (
                    <span>Alto: {reporte.medidas.alto}cm</span>
                  )}
                </div>
              </div>
            )}

            {reporte.cantidadTrafficLight > 0 && (
              <div className={styles.detailGroup}>
                <label className={styles.label}>🚦 Semáforos requeridos</label>
                <p className={styles.value}>{reporte.cantidadTrafficLight}</p>
              </div>
            )}

            {reporte.cantidadLight > 0 && (
              <div className={styles.detailGroup}>
                <label className={styles.label}>💡 Lámparas requeridas</label>
                <p className={styles.value}>{reporte.cantidadLight}</p>
              </div>
            )}

            <div className={styles.detailGroup}>
              <label className={styles.label}>Vialidad</label>
              <p className={styles.value}>{formatearVialidad(reporte.vialidad)}</p>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.userInfo}>
              <p className={styles.userName}>👤 {reporte.nombreUsuario}</p>
              <p className={styles.userEmail}>{reporte.emailUsuario}</p>
            </div>
            <p className={styles.fecha}>
              📅 {new Date(reporte.fechaReporte).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function formatearVialidad(vialidad) {
  if (!vialidad) return 'No especificado';
  const vialidades = {
    carretera_nacional: 'Carretera Nacional',
    avenida_principal: 'Avenida Principal',
    troncal: 'Troncal',
    calle_principal: 'Calle Principal',
    calle: 'Calle'
  };
  return vialidades[vialidad] || vialidad;
}
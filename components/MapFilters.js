import { motion } from 'framer-motion';
import styles from '@/styles/MapFilters.module.css';

const TIPO_CONFIG = {
  pothole: { label: 'Bache', color: '#e74c3c' },
  traffic_light: { label: 'Semáforo', color: '#f39c12' },
  light: { label: 'Alumbrado', color: '#3498db' },
  other: { label: 'Otro', color: '#9b59b6' }
};

const VIALIDAD_CONFIG = {
  carretera_nacional: { label: 'Carretera Nacional', color: '#27ae60' },
  avenida_principal: { label: 'Avenida Principal', color: '#8e44ad' },
  troncal: { label: 'Troncal', color: '#e67e22' },
  calle_principal: { label: 'Calle Principal', color: '#1abc9c' },
  calle: { label: 'Calle', color: '#95a5a6' }
};

const NIVEL_CONFIG = {
  alto: { label: 'Alto', color: '#e74c3c' },
  medio: { label: 'Medio', color: '#f39c12' },
  bajo: { label: 'Bajo', color: '#2ecc71' }
};

export default function MapFilters({
  selectedType,
  selectedVialidad,
  selectedMunicipio,
  selectedNivel,
  onFilterChange,
  filtrosAdicionales = {}
}) {
  const { vialidades = [], municipios = [] } = filtrosAdicionales;

  const handleChange = (key, value) => {
    onFilterChange(key, selectedType === value ? null : value);
  };

  const hasActiveFilters = selectedType || selectedVialidad || selectedMunicipio || selectedNivel;

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span className={styles.title}>Tipo de problema:</span>
        <div className={styles.filterButtons}>
          {Object.entries(TIPO_CONFIG).map(([tipo, config]) => (
            <motion.button
              key={tipo}
              className={`${styles.filterBtn} ${selectedType === tipo ? styles.active : ''}`}
              style={{ '--filter-color': config.color }}
              onClick={() => onFilterChange('tipo', selectedType === tipo ? null : tipo)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.dot} />
              {config.label}
            </motion.button>
          ))}
        </div>
      </div>

      {vialidades.length > 0 && (
        <div className={styles.section}>
          <span className={styles.title}>Tipo de vialidad:</span>
          <div className={styles.filterButtons}>
            {vialidades.map((v) => {
              const config = VIALIDAD_CONFIG[v] || { label: v, color: '#7f8c8d' };
              return (
                <motion.button
                  key={v}
                  className={`${styles.filterBtn} ${selectedVialidad === v ? styles.active : ''}`}
                  style={{ '--filter-color': config.color }}
                  onClick={() => onFilterChange('vialidad', selectedVialidad === v ? null : v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.dot} />
                  {config.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {municipios.length > 0 && (
        <div className={styles.section}>
          <span className={styles.title}>Municipio:</span>
          <div className={styles.filterButtons}>
            {municipios.map((m) => (
              <motion.button
                key={m}
                className={`${styles.filterBtn} ${selectedMunicipio === m ? styles.active : ''}`}
                style={{ '--filter-color': '#3498db' }}
                onClick={() => onFilterChange('municipio', selectedMunicipio === m ? null : m)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.dot} />
                {m}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <span className={styles.title}>Nivel de urgencia:</span>
        <div className={styles.filterButtons}>
          {Object.entries(NIVEL_CONFIG).map(([nivel, config]) => (
            <motion.button
              key={nivel}
              className={`${styles.filterBtn} ${selectedNivel === nivel ? styles.active : ''}`}
              style={{ '--filter-color': config.color }}
              onClick={() => onFilterChange('nivel', selectedNivel === nivel ? null : nivel)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.dot} />
              {config.label}
            </motion.button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          className={styles.clearFilter}
          onClick={() => onFilterChange('clear', null)}
        >
          Limpiar filtros
        </button>
      )}

      <div className={styles.section}>
        <h4 className={styles.legendTitle}>Leyenda</h4>
        {Object.entries(TIPO_CONFIG).map(([tipo, config]) => (
          <div key={tipo} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: config.color }} />
            {config.label}
          </div>
        ))}
      </div>
    </div>
  );
}
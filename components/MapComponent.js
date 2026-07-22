import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import styles from '@/styles/Map.module.css';

const DEFAULT_CENTER = [11.4167, -69.6833];

const TIPO_CONFIG = {
  pothole: {
    label: 'Bache',
    color: '#e74c3c',
    icon: '🕳️'
  },
  traffic_light: {
    label: 'Semáforo',
    color: '#f39c12',
    icon: '🚦'
  },
  light: {
    label: 'Alumbrado',
    color: '#3498db',
    icon: '💡'
  },
  other: {
    label: 'Otro',
    color: '#9b59b6',
    icon: '📍'
  }
};

const PRIORITY_COLORS = [
  '#27ae60',  // 0-20 verde
  '#d4a017',  // 21-40 dorado
  '#e67e22',  // 41-60 naranja
  '#e74c3c',  // 61-80 rojo
  '#c0392b'   // 81-100 rojo oscuro
];

function getPriorityColor(score) {
  if (score >= 81) return PRIORITY_COLORS[4];
  if (score >= 61) return PRIORITY_COLORS[3];
  if (score >= 41) return PRIORITY_COLORS[2];
  if (score >= 21) return PRIORITY_COLORS[1];
  return PRIORITY_COLORS[0];
}

const createCustomIcon = (tipo) => {
  const config = TIPO_CONFIG[tipo] || TIPO_CONFIG.other;
  return L.divIcon({
    html: `<div style="
      background: ${config.color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.4);
      border: 2px solid white;
    "><span style="transform: rotate(45deg);">${config.icon}</span></div>`,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

export default function MapComponent({
  reportes,
  onMarkerClick,
  selectedType,
  selectedVialidad,
  selectedMunicipio,
  selectedNivel
}) {
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {}
      );
    }
  }, []);

  const filteredReportes = reportes.filter(r => {
    if (selectedType && r.tipo !== selectedType) return false;
    if (selectedVialidad && r.vialidad !== selectedVialidad) return false;
    if (selectedMunicipio && r.municipio !== selectedMunicipio) return false;
    if (selectedNivel && r.nivel !== selectedNivel) return false;
    return true;
  });

  return (
    <MapContainer
      center={center}
      zoom={13}
      className={styles.map}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {filteredReportes.map((reporte, index) => {
        const coords = reporte.ubicacion?.coordinates;
        if (!coords || coords.length !== 2) return null;

        return (
          <Marker
            key={reporte._id || index}
            position={[coords[1], coords[0]]}
            icon={createCustomIcon(reporte.tipo)}
          >
            <Popup>
              <div className={styles.popup}>
                <h3>{reporte.titulo}</h3>
                <p className={styles.popupTipo} style={{ color: TIPO_CONFIG[reporte.tipo]?.color }}>
                  {TIPO_CONFIG[reporte.tipo]?.label || 'Otro'}
                </p>
                <p>{reporte.descripcion}</p>
                <p className={styles.popupLocation}>
                  📍 {reporte.ubicacion?.direccion || reporte.direccion || 'Sin dirección'}
                </p>
                <p className={styles.popupStatus}>
                  Estado: <span className={`${styles.status} ${styles[reporte.estado]}`}>
                    {reporte.estado}
                  </span>
                </p>
                <p className={styles.popupPriority}>
                  Prioridad: <span
                    className={styles.priorityBadge}
                    style={{ background: getPriorityColor(reporte.priorityScore || 0) }}
                  >
                    {reporte.priorityScore || 0}
                  </span>
                </p>
                <button
                  className={styles.detailBtn}
                  onClick={() => onMarkerClick(reporte)}
                >
                  Ver detalle
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
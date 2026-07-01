import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/Home.module.css';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });
const StatsPanel = dynamic(() => import('@/components/StatsPanel'), { ssr: false });
const MapFilters = dynamic(() => import('@/components/MapFilters'), { ssr: false });
const MunicipalityPanel = dynamic(() => import('@/components/MunicipalityPanel'), { ssr: false });
const ReportModal = dynamic(() => import('@/components/ReportModal'), { ssr: false });
const Toast = dynamic(() => import('@/components/Toast'), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [reportes, setReportes] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedVialidad, setSelectedVialidad] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedNivel, setSelectedNivel] = useState(null);
  const [filters, setFilters] = useState({ vialidades: [], municipios: [] });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    switch (key) {
      case 'tipo': setSelectedType(value); break;
      case 'vialidad': setSelectedVialidad(value); break;
      case 'municipio': setSelectedMunicipio(value); break;
      case 'nivel': setSelectedNivel(value); break;
      case 'clear':
        setSelectedType(null);
        setSelectedVialidad(null);
        setSelectedMunicipio(null);
        setSelectedNivel(null);
        break;
    }
  };

  const getUniqueValues = (data, key) => [...new Set(data.map(r => r[key]).filter(Boolean))];

  useEffect(() => {
    if (reportes.length > 0) {
      const vialidades = getUniqueValues(reportes, 'vialidad');
      const municipios = getUniqueValues(reportes, 'municipio');
      setFilters({ vialidades, municipios });
    }
  }, [reportes]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportesRes, estadisticasRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/reportes`),
        fetch(`${API_URL}/api/v1/dashboard/estadisticas`)
      ]);

      const reportesData = await reportesRes.json();
      const estadisticasData = await estadisticasRes.json();

      if (reportesData.success) {
        setReportes(reportesData.data);
      }
      if (estadisticasData.success) {
        setEstadisticas(estadisticasData.data);
      }

      setLoading(false);
      showToast('Datos cargados exitosamente', 'success');
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      showToast('Error al cargar datos', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleMarkerClick = (reporte) => {
    setSelectedReport(reporte);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.spinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>VialActivo - Panel de Control</title>
        <meta name="description" content="Panel de control de reportes viales" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.dashboard}>
        <header className={styles.header}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            VialActivo
          </motion.h1>
          <span className={styles.subtitle}>Panel de Control y Estadísticas</span>
        </header>

        <div className={`${styles.panelOverlay} ${(leftPanelOpen || rightPanelOpen) ? styles.open : ''}`} onClick={() => { setLeftPanelOpen(false); setRightPanelOpen(false); }} />
        <div className={styles.mainContent}>
          <aside className={`${styles.leftPanel} ${styles.leftPanelDrawer} ${leftPanelOpen ? styles.open : ''}`}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Filtros</span>
              <button className={styles.closeBtn} onClick={() => setLeftPanelOpen(false)}>✕</button>
            </div>
            <div className={styles.filtersSection}>
              <MapFilters
                selectedType={selectedType}
                selectedVialidad={selectedVialidad}
                selectedMunicipio={selectedMunicipio}
                selectedNivel={selectedNivel}
                onFilterChange={handleFilterChange}
                filtrosAdicionales={filters}
              />
            </div>
          </aside>

          <main className={styles.mapContainer}>
            <MapComponent
              reportes={reportes}
              onMarkerClick={handleMarkerClick}
              selectedType={selectedType}
              selectedVialidad={selectedVialidad}
              selectedMunicipio={selectedMunicipio}
              selectedNivel={selectedNivel}
            />
          </main>

          <aside className={`${styles.rightPanel} ${styles.rightPanelDrawer} ${rightPanelOpen ? styles.open : ''}`}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Estadísticas</span>
              <button className={styles.closeBtn} onClick={() => setRightPanelOpen(false)}>✕</button>
            </div>
            <div className={styles.statsSection}>
              <StatsPanel estadisticas={estadisticas} onItemClick={(tipo) => showToast(`Ver detalles de ${tipo}`, 'info')} />
            </div>
            <MunicipalityPanel estadisticas={estadisticas} />
          </aside>
        </div>

        <div className={styles.bottomNav}>
          <button className={styles.bottomNavBtn} onClick={() => setLeftPanelOpen(!leftPanelOpen)}>
            ☰ Filtros
          </button>
          <button className={styles.bottomNavBtn} onClick={() => setRightPanelOpen(!rightPanelOpen)}>
            📊 Estadísticas
          </button>
        </div>

        <footer className={styles.footer}>
          <p>VialActivo - Sistema de Gestión de Reportes Viales</p>
        </footer>
      </div>

      <AnimatePresence>
        {selectedReport && (
          <ReportModal
            reporte={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'info' })} />
        )}
      </AnimatePresence>
    </>
  );
}
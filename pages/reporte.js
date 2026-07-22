import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Reporte.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TIPO_LABELS = { pothole: 'Baches', traffic_light: 'Semáforos', light: 'Alumbrado', other: 'Otros' };
const TIPO_COLORS = { pothole: '#e74c3c', traffic_light: '#f39c12', light: '#3498db', other: '#9b59b6' };

function totalPorTipo(reportes, tipo) {
  return reportes.filter(r => r.tipo === tipo).length;
}

function totalPorEstado(reportes, estado) {
  return reportes.filter(r => r.estado === estado).length;
}

export default function Reporte() {
  const reportRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resR, resE] = await Promise.all([
          fetch(`${API_URL}/api/v1/reportes?sortBy=priority`),
          fetch(`${API_URL}/api/v1/dashboard/estadisticas`)
        ]);
        const dataR = await resR.json();
        const dataE = await resE.json();
        if (dataR.success) setReportes(dataR.data);
        if (dataE.success) setEstadisticas(dataE.data);
      } catch (e) {
        console.error('Error cargando datos:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const pages = reportRef.current.querySelectorAll('[data-page]');
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pageH = (canvas.height * pw) / canvas.width;
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pw, Math.min(pageH, ph));
      }
      pdf.save(`VialActivo-Reporte-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('Error generando PDF:', e);
    } finally {
      setGenerating(false);
    }
  };

  const tipos = ['pothole', 'traffic_light', 'light', 'other'];
  const total = reportes.length;
  const pendientes = totalPorEstado(reportes, 'pendiente');
  const enProceso = totalPorEstado(reportes, 'en proceso');
  const terminados = totalPorEstado(reportes, 'terminado');
  const maxTipo = Math.max(...tipos.map(t => totalPorTipo(reportes, t)), 1);

  const prioridadDist = { critica: 0, alta: 0, media: 0, baja: 0 };
  reportes.filter(r => r.estado === 'pendiente').forEach(r => {
    const s = r.priorityScore || 0;
    if (s >= 61) prioridadDist.critica++;
    else if (s >= 41) prioridadDist.alta++;
    else if (s >= 21) prioridadDist.media++;
    else prioridadDist.baja++;
  });
  const maxPrioridad = Math.max(...Object.values(prioridadDist), 1);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Cargando datos del reporte...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Head>
        <title>VialActivo - Reporte Detallado</title>
      </Head>

      <div className={styles.toolbar}>
        <Link href="/" className={styles.backBtn}>← Volver al dashboard</Link>
        <button className={styles.downloadBtn} onClick={handleDownloadPDF} disabled={generating}>
          ⬇ {generating ? 'Generando...' : 'Descargar PDF'}
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.report} ref={reportRef}>

          {/* PAGE 1: Header + Resumen + Por Tipo + Por Estado */}
          <div data-page>
            <div className={styles.header}>
              <img src="/logo.png" alt="VialActivo" className={styles.headerLogo} />
              <h1 className={styles.headerTitle}>Reporte Detallado de Averías</h1>
              <p className={styles.headerDate}>Generado el {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Resumen General</h2>
              <div className={styles.kpiRow}>
                <div className={styles.kpi}><span className={styles.kpiValue}>{total}</span><span className={styles.kpiLabel}>Total reportes</span></div>
                <div className={styles.kpi}><span className={styles.kpiValue}>{pendientes}</span><span className={styles.kpiLabel}>Pendientes</span></div>
                <div className={styles.kpi}><span className={styles.kpiValue}>{enProceso}</span><span className={styles.kpiLabel}>En proceso</span></div>
                <div className={styles.kpi}><span className={styles.kpiValue}>{terminados}</span><span className={styles.kpiLabel}>Terminados</span></div>
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Distribución por Tipo de Avería</h2>
              <div className={styles.chartRow}>
                <div className={styles.chartCol}>
                  <div className={styles.barChart}>
                    {tipos.map(t => {
                      const c = totalPorTipo(reportes, t);
                      const pct = total ? Math.round((c / total) * 100) : 0;
                      return (
                        <div key={t} className={styles.barItem}>
                          <span className={styles.barLabel}>{TIPO_LABELS[t]}</span>
                          <div className={styles.barTrack}>
                            <div className={styles.barFill} style={{ width: `${(c / maxTipo) * 100}%`, background: TIPO_COLORS[t] }} />
                          </div>
                          <span className={styles.barVal}>{c} ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.chartCol}>
                  <div className={styles.dataTable}>
                    <div className={styles.dataRow}><span>Total reportes</span><span className={styles.dataVal}>{total}</span></div>
                    <div className={styles.dataRow}><span>Pendientes</span><span className={styles.dataVal}>{pendientes}</span></div>
                    <div className={styles.dataRow}><span>En proceso</span><span className={styles.dataVal}>{enProceso}</span></div>
                    <div className={styles.dataRow}><span>Terminados</span><span className={styles.dataVal}>{terminados}</span></div>
                    <div className={styles.dataRow}><span>Prioridad crítica</span><span className={styles.dataVal}>{prioridadDist.critica}</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Estado de los Reportes</h2>
              <div className={styles.estadoChart}>
                {[
                  { label: 'Pendientes', val: pendientes, color: '#e74c3c' },
                  { label: 'En proceso', val: enProceso, color: '#f39c12' },
                  { label: 'Terminados', val: terminados, color: '#27ae60' },
                ].map(item => {
                  const pct = total ? Math.round((item.val / total) * 100) : 0;
                  return (
                    <div key={item.label} className={styles.barItem}>
                      <span className={styles.barLabel}>{item.label}</span>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                      <span className={styles.barVal}>{item.val} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PAGE 2: Prioridad + Materiales + Municipios + Tabla */}
          <div data-page>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Distribución de Prioridad (Pendientes)</h2>
              <div className={styles.barChart}>
                {[
                  { label: 'Crítica (61-100)', val: prioridadDist.critica, color: '#c0392b' },
                  { label: 'Alta (41-60)', val: prioridadDist.alta, color: '#e67e22' },
                  { label: 'Media (21-40)', val: prioridadDist.media, color: '#d4a017' },
                  { label: 'Baja (0-20)', val: prioridadDist.baja, color: '#27ae60' },
                ].map(item => (
                  <div key={item.label} className={styles.barItem}>
                    <span className={styles.barLabel}>{item.label}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${(item.val / maxPrioridad) * 100}%`, background: item.color }} />
                    </div>
                    <span className={styles.barVal}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
            {estadisticas?.materiales && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Materiales Requeridos</h2>
                <div className={styles.kpiRow}>
                  <div className={styles.kpi}><span className={styles.kpiValue}>{parseFloat(estadisticas.materiales.asfalto).toFixed(2)}</span><span className={styles.kpiLabel}>kg de Asfalto</span></div>
                  <div className={styles.kpi}><span className={styles.kpiValue}>{estadisticas.materiales.semaforos}</span><span className={styles.kpiLabel}>Semáforos</span></div>
                  <div className={styles.kpi}><span className={styles.kpiValue}>{estadisticas.materiales.luminarias}</span><span className={styles.kpiLabel}>Luminarias</span></div>
                </div>
              </div>
            )}
            {estadisticas?.municipiosConMasReportes?.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Municipios con Mayor Incidencia</h2>
                <div className={styles.municipioChart}>
                  {estadisticas.municipiosConMasReportes.map((m, i) => {
                    const totalM = estadisticas.municipiosConMasReportes.reduce((a, b) => a + b.total, 0);
                    const pct = totalM ? Math.round((m.total / totalM) * 100) : 0;
                    return (
                      <div key={m.municipio} className={styles.barItem}>
                        <span className={styles.barLabel}>{i + 1}. {m.municipio}</span>
                        <div className={styles.barTrack}>
                          <div className={styles.barFill} style={{ width: `${pct}%`, background: '#27a0a3' }} />
                        </div>
                        <span className={styles.barVal}>{m.total} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Reportes Recientes (Top 10 por prioridad)</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Prioridad</th>
                      <th>Estado</th>
                      <th>Municipio</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportes.slice(0, 10).map(r => (
                      <tr key={r._id}>
                        <td>{r.titulo}</td>
                        <td>{TIPO_LABELS[r.tipo] || r.tipo}</td>
                        <td><span className={styles.priorityBadge} style={{ background: r.priorityScore >= 61 ? '#c0392b' : r.priorityScore >= 41 ? '#e67e22' : r.priorityScore >= 21 ? '#d4a017' : '#27ae60' }}>{r.priorityScore || 0}</span></td>
                        <td>{r.estado}</td>
                        <td>{r.municipio || '-'}</td>
                        <td>{r.fechaReporte ? new Date(r.fechaReporte).toLocaleDateString('es-ES') : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.footer}>
              VialActivo — Reporte generado automáticamente — {new Date().getFullYear()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Brochure.module.css';

function SvgCamera() {
  return (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function SvgWifi() {
  return (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="#27a0a3" stroke="none" />
    </svg>
  );
}

function SvgMapPin() {
  return (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SvgChart() {
  return (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

function SvgBox() {
  return (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function SvgBuilding() {
  return (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01" />
      <path d="M8 10h.01M16 10h.01" />
      <path d="M8 14h.01M16 14h.01" />
    </svg>
  );
}

function SvgTarget() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function SvgPeople() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SvgWallet() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  );
}

function SvgClipboard() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#27a0a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 14h6" />
      <path d="M9 18h4" />
    </svg>
  );
}

export default function Brochure() {
  const brochureRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!brochureRef.current) return;
    setGenerating(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const pages = brochureRef.current.querySelectorAll('[data-page]');
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pageCanvasH = (canvas.height * pdfWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(pageCanvasH, pdfHeight));
      }

      pdf.save('VialActivo-Brochure-Falcon.pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  const features = [
    { icon: <SvgCamera />, title: 'Reporte con Foto', desc: 'Captura hasta 3 imágenes con geolocalización precisa y mediciones de cada avería.' },
    { icon: <SvgWifi />, title: 'Soporte Offline', desc: 'Los reportes se guardan localmente y se sincronizan automáticamente al recuperar la conexión.' },
    { icon: <SvgMapPin />, title: 'Mapa Interactivo', desc: 'Visualiza todas las averías en un mapa con filtros por tipo, estado, nivel y municipio.' },
    { icon: <SvgChart />, title: 'Estadísticas', desc: 'Dashboard con métricas en tiempo real: reportes por tipo, estado, municipio y tendencias.' },
    { icon: <SvgBox />, title: 'Materiales', desc: 'Cálculo automático de asfalto, semáforos y luminarias necesarios para las reparaciones.' },
    { icon: <SvgBuilding />, title: 'Por Municipio', desc: 'Identifica los municipios con mayor incidencia de averías y distribuye recursos eficientemente.' },
  ];

  const impacts = [
    { icon: <SvgTarget />, title: 'Decisiones basadas en datos', desc: 'Obtén información objetiva para priorizar inversiones y asignar recursos donde más se necesitan.' },
    { icon: <SvgPeople />, title: 'Usuarios participativos', desc: 'Los usuarios autorizados se convierten en aliados reportando averías y dando seguimiento a las reparaciones.' },
    { icon: <SvgWallet />, title: 'Optimización de recursos', desc: 'Conoce anticipadamente los materiales necesarios y evita compras de emergencia o desperdicios.' },
    { icon: <SvgClipboard />, title: 'Gestión transparente', desc: 'Reportes históricos, trazabilidad de cada reparación y métricas de gestión para rendición de cuentas.' },
  ];

  return (
    <div className={styles.page}>
      <Head>
        <title>VialActivo - Brochure</title>
        <meta name="description" content="VialActivo - Sistema de Gestión de Averías Viales para el estado Falcón" />
      </Head>

      <div className={styles.toolbar}>
        <Link href="/" className={styles.backBtn}>
          ← Volver al dashboard
        </Link>
        <button
          className={styles.downloadBtn}
          onClick={handleDownloadPDF}
          disabled={generating}
        >
          ⬇ {generating ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.brochure} ref={brochureRef}>

          {/* PAGE 1: Hero + Problema */}
          <div data-page>
            <div className={styles.hero}>
              <div className={styles.heroLogoWrap}>
                <img src="/logo.png" alt="VialActivo" className={styles.heroLogo} />
              </div>
              <h1 className={styles.heroTitle}>VialActivo</h1>
              <p className={styles.heroSubtitle}>Sistema de Gestión de Averías Viales</p>
              <p className={styles.heroTagline}>Gestión inteligente para la vialidad del estado Falcón</p>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={`${styles.sectionTitleIcon} ${styles.iconRed}`}><span className={styles.iconRedDot}>●</span></span>
                El Problema
              </h2>
              <ul className={styles.problemList}>
                <li className={styles.problemItem}>
                  <span className={styles.problemBullet}>●</span>
                  <p className={styles.problemText}>
                    <strong>Deterioro progresivo de las vías.</strong> Las carreteras, avenidas y calles del estado Falcón presentan un deterioro continuo que afecta la movilidad y seguridad de los usuarios.
                  </p>
                </li>
                <li className={styles.problemItem}>
                  <span className={styles.problemBullet}>●</span>
                  <p className={styles.problemText}>
                    <strong>Sin sistema centralizado.</strong> No existe una plataforma única que consolide los reportes de averías, lo que dificulta la toma de decisiones y la asignación de recursos.
                  </p>
                </li>
                <li className={styles.problemItem}>
                  <span className={styles.problemBullet}>●</span>
                  <p className={styles.problemText}>
                    <strong>Priorización reactiva.</strong> Las reparaciones se realizan sin criterios objetivos de prioridad, basándose en quejas puntuales en lugar de datos concretos.
                  </p>
                </li>
                <li className={styles.problemItem}>
                  <span className={styles.problemBullet}>●</span>
                  <p className={styles.problemText}>
                    <strong>Desconocimiento de materiales.</strong> Se desconoce anticipadamente la cantidad de asfalto, semáforos y luminarias necesarias para cada intervención.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* PAGE 2: Solución + Características */}
          <div data-page>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={`${styles.sectionTitleIcon} ${styles.iconGreen}`}><span className={styles.iconGreenDot}>●</span></span>
                La Solución
              </h2>
              <div className={styles.solutionItem}>
                <span className={styles.solutionBullet}>●</span>
                <p className={styles.solutionText}>
                  <strong>01 &mdash; App móvil para reportes.</strong> Los usuarios autorizados y el personal de vialidad pueden reportar averías con fotografía, geolocalización y mediciones precisas, incluso sin conexión a internet.
                </p>
              </div>
              <div className={styles.solutionItem}>
                <span className={styles.solutionBullet}>●</span>
                <p className={styles.solutionText}>
                  <strong>02 &mdash; Dashboard web en tiempo real.</strong> Mapa interactivo con todas las averías, estadísticas actualizadas, y filtros por tipo, municipio, vialidad y nivel de urgencia.
                </p>
              </div>
              <div className={styles.solutionItem}>
                <span className={styles.solutionBullet}>●</span>
                <p className={styles.solutionText}>
                  <strong>03 &mdash; Priorización inteligente.</strong> Algoritmo que asigna puntaje de prioridad a cada reporte basado en tipo de vialidad, tipo de avería, nivel de urgencia, días sin resolver y densidad de la zona.
                </p>
              </div>
              <div className={styles.solutionItem}>
                <span className={styles.solutionBullet}>●</span>
                <p className={styles.solutionText}>
                  <strong>04 &mdash; Cálculo automático de materiales.</strong> El sistema estima la cantidad de asfalto, semáforos y luminarias requeridas para atender las averías pendientes.
                </p>
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={`${styles.sectionTitleIcon} ${styles.iconBlue}`}><span className={styles.iconBlueDot}>●</span></span>
                Características
              </h2>
              <div className={styles.grid3}>
                {features.map((f, i) => (
                  <div key={i} className={styles.featureCard}>
                    <div className={styles.featureIconWrap}>{f.icon}</div>
                    <h3 className={styles.featureTitle}>{f.title}</h3>
                    <p className={styles.featureDesc}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAGE 3: Impacto Estadísticas + Flujo */}
          <div data-page>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={`${styles.sectionTitleIcon} ${styles.iconBlue}`}><span className={styles.iconBlueDot}>●</span></span>
                Impacto Esperado
              </h2>
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>-60%</span>
                  <span className={styles.statLabel}>Tiempo de diagnóstico</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>+40%</span>
                  <span className={styles.statLabel}>Eficiencia operativa</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>100%</span>
                  <span className={styles.statLabel}>Transparencia</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>24/7</span>
                  <span className={styles.statLabel}>Monitoreo continuo</span>
                </div>
              </div>
              <div className={styles.impactGrid}>
                {impacts.map((item, i) => (
                  <div key={i} className={styles.impactCard}>
                    <div className={styles.impactIconWrap}>{item.icon}</div>
                    <h3 className={styles.impactTitle}>{item.title}</h3>
                    <p className={styles.impactDesc}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={`${styles.sectionTitleIcon} ${styles.iconGreen}`}><span className={styles.iconGreenDot}>●</span></span>
                Flujo del Proceso
              </h2>
              <p className={styles.flowIntro}>
                Desde que un usuario autorizado reporta una avería hasta que la reparación es verificada,
                VialActivo acompaña cada etapa con información precisa y actualizada.
              </p>
            </div>
          </div>

          {/* PAGE 4: Flujo (continuación) + Distribución + CTA + Footer */}
          <div data-page>
            <div className={styles.section}>
              <div className={styles.flowRow}>
                <div className={styles.flowStep}>
                  <div className={styles.flowNumber}>1</div>
                  <div className={styles.flowCard}>
                    <h3 className={styles.flowTitle}>Reporte</h3>
                    <p className={styles.flowDesc}>El usuario autorizado reporta con foto, GPS y mediciones desde la app móvil.</p>
                    <span className={styles.flowStrength}>Funciona sin internet</span>
                  </div>
                  <div className={styles.flowArrow}>→</div>
                </div>
                <div className={styles.flowStep}>
                  <div className={styles.flowNumber}>2</div>
                  <div className={styles.flowCard}>
                    <h3 className={styles.flowTitle}>Priorización</h3>
                    <p className={styles.flowDesc}>El sistema asigna puntaje de prioridad basado en vialidad, urgencia y densidad.</p>
                    <span className={styles.flowStrength}>Score automático 0–100</span>
                  </div>
                  <div className={styles.flowArrow}>→</div>
                </div>
                <div className={styles.flowStep}>
                  <div className={styles.flowNumber}>3</div>
                  <div className={styles.flowCard}>
                    <h3 className={styles.flowTitle}>Planificación</h3>
                    <p className={styles.flowDesc}>Se agrupan averías por zona y se calculan los materiales necesarios.</p>
                    <span className={styles.flowStrength}>Agrupación por cercanía</span>
                  </div>
                  <div className={styles.flowArrow}>→</div>
                </div>
                <div className={styles.flowStep}>
                  <div className={styles.flowNumber}>4</div>
                  <div className={styles.flowCard}>
                    <h3 className={styles.flowTitle}>Reparación</h3>
                    <p className={styles.flowDesc}>La cuadrilla ejecuta la obra con materiales pre-calculados y registra el avance.</p>
                    <span className={styles.flowStrength}>Materiales pre-calculados</span>
                  </div>
                  <div className={styles.flowArrow}>→</div>
                </div>
                <div className={styles.flowStep}>
                  <div className={styles.flowNumber}>5</div>
                  <div className={styles.flowCard}>
                    <h3 className={styles.flowTitle}>Verificación</h3>
                    <p className={styles.flowDesc}>La avería pasa a completado y queda registrada en el historial.</p>
                    <span className={styles.flowStrength}>Seguimiento en tiempo real</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={`${styles.sectionTitleIcon} ${styles.iconBlue}`}><span className={styles.iconBlueDot}>●</span></span>
              </h2>
              <div className={styles.distribRow}>
                <div className={styles.distribCol}>
                  <p className={styles.distribText}>
                    Las averías se clasifican en tres categorías, permitiendo una gestión especializada
                    y la asignación precisa de cuadrillas de reparación.
                  </p>
                  <div className={styles.mockChart}>
                    <div className={styles.chartCol}>
                      <div className={styles.chartBar} style={{ height: '140px', background: 'linear-gradient(to top, #e74c3c, #c0392b)' }}>
                        <span className={styles.chartBarValue}>65%</span>
                      </div>
                      <span className={styles.chartBarLabel}>Baches</span>
                    </div>
                    <div className={styles.chartCol}>
                      <div className={styles.chartBar} style={{ height: '90px', background: 'linear-gradient(to top, #f39c12, #e67e22)' }}>
                        <span className={styles.chartBarValue}>20%</span>
                      </div>
                      <span className={styles.chartBarLabel}>Semáforos</span>
                    </div>
                    <div className={styles.chartCol}>
                      <div className={styles.chartBar} style={{ height: '70px', background: 'linear-gradient(to top, #3498db, #2980b9)' }}>
                        <span className={styles.chartBarValue}>15%</span>
                      </div>
                      <span className={styles.chartBarLabel}>Alumbrado</span>
                    </div>
                  </div>
                </div>
                <div className={styles.distribCol}>
                  <p className={styles.distribText}>
                    El sistema prioriza automáticamente las intervenciones según el tipo de vialidad,
                    la antigüedad del reporte y la concentración de averías en la zona.
                  </p>
                  <div className={styles.legendList}>
                    <div className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: '#e74c3c' }} />
                      <span>Carreteras nacionales — Prioridad crítica</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: '#e67e22' }} />
                      <span>Avenidas principales — Prioridad alta</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: '#d4a017' }} />
                      <span>Calles y troncales — Prioridad media</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.cta}>
              <h2 className={styles.ctaTitle}>Transformemos la vialidad de Falcón</h2>
              <p className={styles.ctaText}>
                VialActivo es la herramienta que permite a la institución de vialidad del estado Falcón
                gestionar de manera eficiente, transparente e inteligente el mantenimiento de las vías.
              </p>
              <p className={styles.ctaText}>
                Con datos en tiempo real, priorización automática y la participación de los usuarios autorizados,
                cada recurso invertido tiene el máximo impacto en la calidad de vida del estado Falcón.
              </p>
              <p className={styles.ctaContact}>Solicite una demostración y conozca cómo VialActivo puede implementarse en el estado Falcón</p>
            </div>
            <div className={styles.footer}>
              VialActivo — Sistema de Gestión de Averías Viales — {new Date().getFullYear()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

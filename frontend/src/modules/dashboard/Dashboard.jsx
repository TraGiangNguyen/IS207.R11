import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ScatterChart, Scatter, Legend
} from 'recharts';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import UploadButton from '../../components/UploadButton/UploadButton';
import './Dashboard.css';

/* ─── Static Demo Data ─────────────────────────────────────── */
const salesData = [
  { month: 'Jan', revenue: 12400, orders: 240 },
  { month: 'Feb', revenue: 18200, orders: 310 },
  { month: 'Mar', revenue: 15800, orders: 280 },
  { month: 'Apr', revenue: 22100, orders: 390 },
  { month: 'May', revenue: 19600, orders: 350 },
  { month: 'Jun', revenue: 27300, orders: 480 },
  { month: 'Jul', revenue: 24800, orders: 420 },
  { month: 'Aug', revenue: 31500, orders: 520 },
  { month: 'Sep', revenue: 28900, orders: 460 },
  { month: 'Oct', revenue: 35200, orders: 590 },
  { month: 'Nov', revenue: 41800, orders: 680 },
  { month: 'Dec', revenue: 48295, orders: 810 },
];

const recentOrders = [
  { id: '#BPL-0091', customer: 'Linh Nguyen',   status: 'Delivered',  amount: '$124.50', avatar: 'LN' },
  { id: '#BPL-0090', customer: 'Minh Tran',     status: 'Processing', amount: '$89.00',  avatar: 'MT' },
  { id: '#BPL-0089', customer: 'Ha Pham',        status: 'Delivered',  amount: '$210.75', avatar: 'HP' },
  { id: '#BPL-0088', customer: 'Bao Le',         status: 'Cancelled',  amount: '$55.20',  avatar: 'BL' },
  { id: '#BPL-0087', customer: 'Thu Hoang',      status: 'Delivered',  amount: '$178.00', avatar: 'TH' },
  { id: '#BPL-0086', customer: 'Quyen Dinh',     status: 'Processing', amount: '$340.00', avatar: 'QD' },
];

const topProducts = [
  { name: 'Rose Glow Serum',      sales: 1284, change: '+18%', color: '#10b981' },
  { name: 'Hydra Boost Cream',    sales:  972, change: '+12%', color: '#06b6d4' },
  { name: 'Vitamin C Brightener', sales:  854, change: '+9%',  color: '#8b5cf6' },
  { name: 'Collagen Eye Patch',   sales:  741, change: '+6%',  color: '#f59e0b' },
  { name: 'Lip Plump Gloss',      sales:  630, change: '+4%',  color: '#ec4899' },
];

const kpiCards = [
  {
    id: 'kpi-revenue', label: 'Total Revenue', value: '$48,295', change: '+24.5%', positive: true,
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M15 9H9m6 6H9m3-9v12"/></svg>),
  },
  {
    id: 'kpi-orders', label: 'Total Orders', value: '1,284', change: '+12.3%', positive: true,
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>),
  },
  {
    id: 'kpi-customers', label: 'Customers', value: '892', change: '+8.1%', positive: true,
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  },
  {
    id: 'kpi-products', label: 'Products', value: '340', change: '-2.4%', positive: false,
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>),
  },
];

const STATUS_COLOR = {
  Delivered:  { bg: '#d1fae5', text: '#059669' },
  Processing: { bg: '#dbeafe', text: '#2563eb' },
  Cancelled:  { bg: '#fee2e2', text: '#dc2626' },
};

const dashTooltipStyle = {
  contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#1a1a2e', fontSize: '13px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  itemStyle: { color: '#10b981' },
};

/* ─── Upload Modal Constants ──────────────────────────────── */
const ACCEPTED_TYPES = ['.csv'];
const MAX_SIZE_MB    = 10;
const CHART_COLORS   = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];
const CHART_TYPES    = [
  { id: 'bar', label: 'Bar' }, { id: 'line', label: 'Line' }, { id: 'area', label: 'Area' },
  { id: 'pie', label: 'Pie' }, { id: 'scatter', label: 'Scatter' },
];

const validateCsv = (file) => {
  if (!file) return { ok: false, msg: 'No file selected.' };
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ACCEPTED_TYPES.includes(ext)) return { ok: false, msg: `Invalid format "${ext}". Only .csv files are accepted.` };
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return { ok: false, msg: `File too large (max ${MAX_SIZE_MB} MB).` };
  return { ok: true, msg: `"${file.name}" uploaded successfully!` };
};

/* ═══════════════════════════════════════════════════════════════
   Dashboard Component
   ═══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  /* modal wizard: 0=closed, 1=upload, 2=configure, 3=preview */
  const [modalStep,    setModalStep]    = useState(0);
  const [isDragging,   setIsDragging]   = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const modalInputRef = useRef(null);
  const chartRef      = useRef(null);

  /* CSV parsed data */
  const [csvColumns, setCsvColumns] = useState([]);
  const [csvData,    setCsvData]    = useState([]);
  const [xAxis,      setXAxis]      = useState('');
  const [yAxes,      setYAxes]      = useState([]);
  const [chartType,  setChartType]  = useState('bar');

  /* toast */
  const [toast, setToast] = useState(null);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);
  const showToast = (type, msg) => setToast({ type, msg });

  /* modal helpers */
  const openModal = () => { setModalStep(1); setSelectedFile(null); setCsvColumns([]); setCsvData([]); setXAxis(''); setYAxes([]); setChartType('bar'); };
  const closeModal = () => { setModalStep(0); setSelectedFile(null); setIsDragging(false); };
  const onBackdropClick = (e) => { if (e.target === e.currentTarget) closeModal(); };
  useEffect(() => { const fn = (e) => { if (e.key === 'Escape') closeModal(); }; document.addEventListener('keydown', fn); return () => document.removeEventListener('keydown', fn); }, []);

  /* drag & drop */
  const onDragOver  = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(()  => { setIsDragging(false); }, []);
  const onDrop      = useCallback((e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setSelectedFile(f); }, []);
  const onFileChange = (e) => { const f = e.target.files[0]; if (f) setSelectedFile(f); };

  /* upload + parse */
  const handleUploadSubmit = () => {
    const result = validateCsv(selectedFile);
    if (!result.ok) { showToast('error', result.msg); return; }
    setUploading(true);
    Papa.parse(selectedFile, {
      header: true, skipEmptyLines: true,
      complete: (parsed) => {
        const cols = parsed.meta.fields || [];
        setCsvColumns(cols); setCsvData(parsed.data);
        setXAxis(cols[0] || ''); setYAxes(cols.length > 1 ? [cols[1]] : []);
        setUploading(false); showToast('success', result.msg);
        setModalStep(2);
      },
      error: () => { setUploading(false); showToast('error', 'Failed to parse CSV file.'); },
    });
  };

  /* Y-axis toggle */
  const toggleYAxis = (col) => setYAxes((prev) => prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]);

  /* download chart */
  const handleDownloadChart = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { backgroundColor: '#fafbfc' });
    const link = document.createElement('a');
    link.download = `${selectedFile?.name?.replace('.csv', '') || 'chart'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  /* render dynamic chart */
  const renderModalChart = () => {
    if (!xAxis || yAxes.length === 0) return null;
    const cp = { data: csvData, margin: { top: 20, right: 30, left: 0, bottom: 0 } };
    const gs = { stroke: '#f0f0f5', vertical: false };
    const as = { stroke: '#d1d5db', tick: { fill: '#6b7280', fontSize: 12 }, axisLine: false, tickLine: false };
    const ts = { contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }, itemStyle: { color: '#10b981' } };

    if (chartType === 'pie') {
      const pd = csvData.map((r) => ({ name: r[xAxis], value: parseFloat(r[yAxes[0]]) || 0 }));
      return (<PieChart><Pie data={pd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={130} innerRadius={0} label>{pd.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip {...ts} /><Legend /></PieChart>);
    }
    if (chartType === 'scatter') {
      return (<ScatterChart {...cp}><CartesianGrid {...gs} /><XAxis dataKey={xAxis} name={xAxis} {...as} /><YAxis dataKey={yAxes[0]} name={yAxes[0]} {...as} /><Tooltip cursor={{ strokeDasharray: '3 3' }} {...ts} /><Scatter data={csvData} fill="#10b981" /></ScatterChart>);
    }

    const srs = {
      bar:  (c, i) => <Bar key={c} dataKey={c} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[6, 6, 0, 0]} />,
      line: (c, i) => <Line key={c} type="monotone" dataKey={c} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2.5} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} />,
      area: (c, i) => (<React.Fragment key={c}><defs><linearGradient id={`mg-${c}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.35} /><stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.02} /></linearGradient></defs><Area type="monotone" dataKey={c} stroke={CHART_COLORS[i % CHART_COLORS.length]} fill={`url(#mg-${c})`} strokeWidth={2.5} /></React.Fragment>),
    };
    const Comp = { bar: BarChart, line: LineChart, area: AreaChart }[chartType];
    return (<Comp {...cp}><CartesianGrid {...gs} /><XAxis dataKey={xAxis} {...as} /><YAxis {...as} /><Tooltip {...ts} /><Legend wrapperStyle={{ color: '#6b7280', paddingTop: '12px' }} />{yAxes.map((c, i) => srs[chartType](c, i))}</Comp>);
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="db-container">

      {/* ── Toast ── */}
      {toast && (
        <div className={`db-toast db-toast--${toast.type}`} role="alert">
          <span className="db-toast-icon">
            {toast.type === 'success'
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            }
          </span>
          <span className="db-toast-msg">{toast.msg}</span>
          <button className="db-toast-close" onClick={() => setToast(null)} aria-label="Dismiss">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          Multi-Step Upload Modal Wizard
          ═══════════════════════════════════════════════════════ */}
      {modalStep > 0 && (
        <div className="db-modal-backdrop" onClick={onBackdropClick} role="dialog" aria-modal="true">
          <div className={`db-modal glass-panel ${modalStep >= 3 ? 'db-modal--wide' : ''}`}>

            {/* Header */}
            <div className="db-modal-header">
              <div className="db-modal-title-wrap">
                <div className="db-modal-icon">
                  {modalStep === 1 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
                  {modalStep === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
                  {modalStep === 3 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>}
                </div>
                <div className="db-modal-title-text">
                  <h2 className="db-modal-title">
                    {modalStep === 1 && 'Upload CSV File'}
                    {modalStep === 2 && 'Configure Chart'}
                    {modalStep === 3 && 'Chart Preview'}
                  </h2>
                  <p className="db-modal-subtitle">
                    {modalStep === 1 && `Only .csv files · Max ${MAX_SIZE_MB} MB`}
                    {modalStep === 2 && `${selectedFile?.name || 'File'} · ${csvData.length} rows`}
                    {modalStep === 3 && 'Download or reconfigure your chart'}
                  </p>
                </div>
              </div>

              <button className="db-modal-close" onClick={closeModal} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Step pills */}
            <div className="db-modal-steps">
              {['Upload', 'Configure', 'Preview'].map((label, i) => (
                <span key={i} className={`db-step-pill ${modalStep > i + 1 ? 'done' : ''} ${modalStep === i + 1 ? 'active' : ''}`}>
                  {modalStep > i + 1 ? '✓' : i + 1} {label}
                </span>
              ))}
            </div>

            <div className="db-modal-body">

            {/* ═══ STEP 1: Upload ═══ */}
            {modalStep === 1 && (
              <>
                <div
                  className={`db-modal-dropzone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                  onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                  onClick={() => modalInputRef.current?.click()} role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && modalInputRef.current?.click()}
                >
                  <input ref={modalInputRef} type="file" accept=".csv" className="hidden-file-input" onChange={onFileChange} />
                  {selectedFile ? (
                    <div className="db-modal-file-selected">
                      <div className="db-modal-file-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" width="32" height="32"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </div>
                      <p className="db-modal-file-name">{selectedFile.name}</p>
                      <p className="db-modal-file-size">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      <span className="db-modal-change-hint">Click or drop to change file</span>
                    </div>
                  ) : (
                    <div className="db-modal-drop-hint">
                      <div className="db-modal-drop-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                      <p className="db-modal-drop-title">Drag &amp; drop your CSV here</p>
                      <p className="db-modal-drop-sub">or <span className="db-modal-browse">click to browse</span></p>
                      <span className="db-modal-badge">.CSV only</span>
                    </div>
                  )}
                </div>
                <div className="db-modal-actions">
                  <button className="db-modal-btn-cancel" onClick={closeModal} disabled={uploading}>Cancel</button>
                  <button className={`db-modal-btn-upload ${uploading ? 'loading' : ''}`} onClick={handleUploadSubmit} disabled={!selectedFile || uploading}>
                    {uploading ? (<><span className="db-spinner"></span> Processing…</>) : (<><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Upload &amp; Continue</>)}
                  </button>
                </div>
              </>
            )}

            {/* ═══ STEP 2: Configure ═══ */}
            {modalStep === 2 && (
              <>
                <div className="db-modal-configure">
                  <div className="db-cfg-section">
                    <label className="db-cfg-label">X Axis (Categories)</label>
                    <select className="db-cfg-select" value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                      {csvColumns.map((col) => <option key={col} value={col}>{col}</option>)}
                    </select>
                  </div>
                  <div className="db-cfg-section">
                    <label className="db-cfg-label">Y Axis (Values)</label>
                    {yAxes.length > 0 && (
                      <div className="db-cfg-tags" style={{ marginBottom: '8px' }}>
                        {yAxes.map((col) => (
                          <span key={col} className="db-cfg-tag selected" onClick={() => toggleYAxis(col)} title="Click to remove">
                            {col}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ marginLeft: '4px' }}>
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </span>
                        ))}
                      </div>
                    )}
                    <select
                      className="db-cfg-select"
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !yAxes.includes(val)) {
                          setYAxes([...yAxes, val]);
                        }
                      }}
                    >
                      <option value="" disabled>Select a column to add...</option>
                      {csvColumns
                        .filter((c) => c !== xAxis && !yAxes.includes(c))
                        .map((col) => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                  </div>
                  <div className="db-cfg-section">
                    <label className="db-cfg-label">Chart Type</label>
                    <div className="db-cfg-chart-types">
                      {CHART_TYPES.map((type) => (
                        <button key={type.id} className={`db-cfg-chart-btn ${chartType === type.id ? 'selected' : ''}`} onClick={() => setChartType(type.id)}>{type.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="db-modal-actions">
                  <button className="db-modal-btn-cancel" onClick={() => setModalStep(1)}>← Back</button>
                  <button className="db-modal-btn-upload" onClick={() => setModalStep(3)} disabled={!xAxis || yAxes.length === 0}>Generate Chart →</button>
                </div>
              </>
            )}

            {/* ═══ STEP 3: Preview ═══ */}
            {modalStep === 3 && (
              <>
                <div className="db-modal-chart-preview" ref={chartRef}>
                  <div className="db-modal-chart-preview-container">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderModalChart()}
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="db-modal-actions">
                  <button className="db-modal-btn-cancel" onClick={() => setModalStep(2)}>← Reconfigure</button>
                  <button className="db-modal-btn-cancel" onClick={openModal}>Reset</button>
                  <button className="db-modal-btn-upload" onClick={handleDownloadChart}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PNG
                  </button>
                </div>
              </>
            )}

            </div>
          </div>
        </div>
      )}

      {/* ── Top Header Bar ── */}
      <div className="db-header">
        <div className="db-header-left">
          <p className="db-header-eyebrow">Overview</p>
          <h1 className="db-header-title gradient-text">BeautyPals Dashboard</h1>
        </div>
        <div className="db-header-right">
          <div className="db-date-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Sep 2026
          </div>
          <button className="db-upload-btn" id="dashboard-upload-btn" onClick={openModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload CSV
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="db-kpi-grid">
        {kpiCards.map((card) => (
          <div key={card.id} id={card.id} className="db-kpi-card glass-panel">
            <div className="db-kpi-top">
              <span className="db-kpi-label">{card.label}</span>
              <div className="db-kpi-icon">{card.icon}</div>
            </div>
            <div className="db-kpi-value">{card.value}</div>
            <div className={`db-kpi-change ${card.positive ? 'positive' : 'negative'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" style={{ transform: card.positive ? 'none' : 'rotate(180deg)' }}><polyline points="18 15 12 9 6 15"/></svg>
              {card.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* ── Sales Overview Chart ── */}
      <div className="db-chart-panel glass-panel">
        <div className="db-panel-header">
          <div><h2 className="db-panel-title">Sales Overview</h2><p className="db-panel-subtitle">Monthly revenue for this year</p></div>
          <div className="db-chart-legend"><span className="db-legend-dot" style={{ background: '#10b981' }}></span>Revenue</div>
        </div>
        <div className="db-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs><linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid stroke="#f0f0f5" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={45} />
              <Tooltip {...dashTooltipStyle} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 5, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom 2-col ── */}
      <div className="db-bottom-grid">
        {/* Recent Orders */}
        <div className="db-orders-panel glass-panel">
          <div className="db-panel-header">
            <div><h2 className="db-panel-title">Recent Orders</h2><p className="db-panel-subtitle">Last 6 transactions</p></div>
            <button className="db-view-all-btn" id="view-all-orders-btn">View all →</button>
          </div>
          <div className="db-orders-table-wrapper">
            <div className="db-orders-table">
              <div className="db-table-head"><span>Order ID</span><span>Customer</span><span>Status</span><span className="align-right">Amount</span></div>
              {recentOrders.map((order) => {
                const sc = STATUS_COLOR[order.status] || {};
                return (
                  <div key={order.id} className="db-table-row">
                    <span className="db-order-id">{order.id}</span>
                    <span className="db-customer"><div className="db-avatar">{order.avatar}</div><span className="db-customer-name">{order.customer}</span></span>
                    <span><span className="db-status-badge" style={{ background: sc.bg, color: sc.text }}>{order.status}</span></span>
                    <span className="db-amount">{order.amount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="db-products-panel glass-panel">
          <div className="db-panel-header"><div><h2 className="db-panel-title">Top Products</h2><p className="db-panel-subtitle">By units sold this month</p></div></div>
          <div className="db-products-list">
            {topProducts.map((p, i) => (
              <div key={p.name} className="db-product-row">
                <div className="db-product-rank">{i + 1}</div>
                <div className="db-product-info">
                  <span className="db-product-name">{p.name}</span>
                  <div className="db-product-bar-wrap"><div className="db-product-bar" style={{ width: `${(p.sales / topProducts[0].sales) * 100}%`, background: p.color }}></div></div>
                </div>
                <div className="db-product-meta"><span className="db-product-sales">{p.sales.toLocaleString()}</span><span className="db-product-change positive">{p.change}</span></div>
              </div>
            ))}
          </div>
          <div className="db-products-chart-wrapper" style={{ marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={topProducts.map(p => ({ name: p.name.split(' ')[0], sales: p.sales }))} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...dashTooltipStyle} />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} background={{ fill: '#f3f4f6', radius: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

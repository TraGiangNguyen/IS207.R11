import React, { useState, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';
import './CsvChartBuilder.css';

/* ─── Chart type definitions with SVG icons ─── */
const CHART_TYPES = [
  {
    id: 'bar', label: 'Bar Chart',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
        <rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
  },
  {
    id: 'line', label: 'Line Chart',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
        <polyline points="3 17 9 11 13 15 21 7" /><polyline points="17 7 21 7 21 11" />
      </svg>
    ),
  },
  {
    id: 'area', label: 'Area Chart',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
        <path d="M3 20 L3 17 L9 11 L13 15 L21 7 L21 20 Z" opacity="0.3" fill="currentColor" />
        <polyline points="3 17 9 11 13 15 21 7" />
      </svg>
    ),
  },
  {
    id: 'pie', label: 'Pie Chart',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
        <path d="M12 2a10 10 0 0 1 10 10h-10z" fill="currentColor" opacity="0.3" />
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="2" x2="12" y2="12" /><line x1="12" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    id: 'scatter', label: 'Scatter Plot',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
        <circle cx="7" cy="15" r="2" fill="currentColor" /><circle cx="12" cy="9" r="2" fill="currentColor" />
        <circle cx="17" cy="13" r="2" fill="currentColor" /><circle cx="9" cy="5" r="1.5" fill="currentColor" />
        <circle cx="19" cy="7" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];

const CsvChartBuilder = () => {
  const [step, setStep] = useState(1); // 1: upload, 2: configure, 3: preview
  const [isDragging, setIsDragging] = useState(false);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxes, setYAxes] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [fileName, setFileName] = useState('');
  const [chartTitle, setChartTitle] = useState('');
  const fileInputRef = useRef(null);
  const chartRef = useRef(null);

  const parseFile = (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      alert('Please upload a valid .csv file.');
      return;
    }
    setFileName(file.name);
    setChartTitle(file.name.replace('.csv', '').replace(/[_-]/g, ' '));
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const cols = result.meta.fields || [];
        setColumns(cols);
        setData(result.data);
        setXAxis(cols[0] || '');
        setYAxes(cols.length > 1 ? [cols[1]] : []);
        setStep(2);
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) parseFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const toggleYAxis = (col) => {
    setYAxes((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { backgroundColor: '#fafbfc' });
    const link = document.createElement('a');
    link.download = `${chartTitle || 'chart'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleReset = () => {
    setStep(1);
    setColumns([]);
    setData([]);
    setXAxis('');
    setYAxes([]);
    setChartType('bar');
    setFileName('');
    setChartTitle('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderChart = () => {
    if (!xAxis || yAxes.length === 0) return null;

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 0, bottom: 0 },
    };

    const gridStyle = { stroke: '#f0f0f5', vertical: false };
    const axisStyle = { stroke: '#d1d5db', tick: { fill: '#6b7280', fontSize: 12 }, axisLine: false, tickLine: false };
    const tooltipStyle = {
      contentStyle: {
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '13px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      },
      itemStyle: { color: '#10b981' },
    };

    if (chartType === 'pie') {
      const yCol = yAxes[0];
      const pieData = data.map((row) => ({ name: row[xAxis], value: parseFloat(row[yCol]) || 0 }));
      return (
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}
            innerRadius={60} paddingAngle={3} label>
            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ color: '#aaa', paddingTop: '16px' }} />
        </PieChart>
      );
    }

    if (chartType === 'scatter') {
      return (
        <ScatterChart {...commonProps}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={xAxis} name={xAxis} {...axisStyle} />
          <YAxis dataKey={yAxes[0]} name={yAxes[0]} {...axisStyle} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} {...tooltipStyle} />
          <Scatter data={data} fill="#69ebd0" />
        </ScatterChart>
      );
    }

    const seriesComponents = {
      bar: (col, i) => <Bar key={col} dataKey={col} fill={COLORS[i % COLORS.length]} radius={[6, 6, 0, 0]} />,
      line: (col, i) => <Line key={col} type="monotone" dataKey={col} stroke={COLORS[i % COLORS.length]} strokeWidth={2.5} dot={{ r: 4, fill: '#1a1e25', strokeWidth: 2 }} activeDot={{ r: 6 }} />,
      area: (col, i) => (
        <React.Fragment key={col}>
          <defs>
            <linearGradient id={`grad-${col}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.5} />
              <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={col} stroke={COLORS[i % COLORS.length]} fill={`url(#grad-${col})`} strokeWidth={2.5} />
        </React.Fragment>
      ),
    };

    const ChartComponent = { bar: BarChart, line: LineChart, area: AreaChart }[chartType];

    return (
      <ChartComponent {...commonProps}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={xAxis} {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ color: '#aaa', paddingTop: '16px' }} />
        {yAxes.map((col, i) => seriesComponents[chartType](col, i))}
      </ChartComponent>
    );
  };

  return (
    <div className="csv-builder">

      {/* ── Header ── */}
      <div className="csv-builder-header">
        <div className="csv-header-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div>
          <h2 className="gradient-text">CSV Chart Builder</h2>
          <p className="csv-header-sub">Upload · Configure · Visualize</p>
        </div>
      </div>

      {/* ── Step Stepper ── */}
      <div className="step-stepper">
        {['Upload File', 'Configure Axes', 'Preview & Export'].map((label, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <React.Fragment key={i}>
              {i > 0 && <div className={`step-line ${isDone ? 'done' : ''}`} />}
              <div className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                <div className="step-circle">
                  {isDone ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : stepNum}
                </div>
                <span className="step-label">{label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* ── STEP 1: Upload ── */}
      {step === 1 && (
        <div
          className={`csv-dropzone glass-panel ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            id="csv-file-input"
            className="hidden-input"
            onChange={handleFileChange}
          />

          <div className="csv-drop-content">
            {/* animated cloud icon */}
            <div className="csv-drop-icon-wrap">
              <div className="csv-drop-rings" />
              <svg className="csv-drop-cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="48" height="48">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <h3 className="csv-drop-title">Drag & drop your CSV file here</h3>
            <p className="csv-drop-subtitle">
              or <span className="csv-browse-link">click to browse</span> from your computer
            </p>

            <div className="csv-drop-meta">
              <span className="csv-drop-badge">.CSV</span>
              <span className="csv-drop-limit">Max 10 MB</span>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Configure ── */}
      {step === 2 && (
        <div className="csv-configure glass-panel">
          {/* File info bar */}
          <div className="csv-file-bar">
            <div className="csv-file-bar-left">
              <div className="csv-file-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <span className="csv-file-name">{fileName}</span>
                <span className="csv-file-stats">{data.length} rows · {columns.length} columns</span>
              </div>
            </div>
            <button className="csv-change-file-btn" onClick={handleReset}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Change file
            </button>
          </div>

          {/* Data preview */}
          <div className="csv-data-preview">
            <div className="csv-data-preview-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              <span>Data Preview</span>
              <span className="csv-preview-count">Showing first {Math.min(data.length, 5)} rows</span>
            </div>
            <div className="csv-mini-table-wrap">
              <table className="csv-mini-table">
                <thead>
                  <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, ri) => (
                    <tr key={ri}>{columns.map((col) => <td key={col}>{row[col]}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Axis configuration */}
          <div className="csv-axis-config">
            <div className="csv-axis-section">
              <label className="csv-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                  <line x1="12" y1="20" x2="12" y2="4" /><polyline points="6 10 12 4 18 10" />
                </svg>
                X Axis (Categories)
              </label>
              <div className="csv-select-wrap">
                <select
                  className="csv-select"
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                >
                  {columns.map((col) => <option key={col} value={col}>{col}</option>)}
                </select>
                <svg className="csv-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            <div className="csv-axis-section">
              <label className="csv-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                  <line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" />
                </svg>
                Y Axis (Values) — select one or more
              </label>
              <div className="csv-y-tags">
                {columns.filter((c) => c !== xAxis).map((col) => (
                  <button
                    key={col}
                    className={`csv-y-tag ${yAxes.includes(col) ? 'selected' : ''}`}
                    onClick={() => toggleYAxis(col)}
                  >
                    {yAxes.includes(col) && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart type picker */}
          <div className="csv-chart-picker">
            <label className="csv-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Chart Type
            </label>
            <div className="csv-chart-tiles">
              {CHART_TYPES.map((type) => (
                <button
                  key={type.id}
                  className={`csv-chart-tile ${chartType === type.id ? 'selected' : ''}`}
                  onClick={() => setChartType(type.id)}
                >
                  <div className="csv-tile-icon">{type.icon}</div>
                  <span className="csv-tile-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="csv-configure-actions">
            <button className="csv-btn-secondary" onClick={handleReset}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
            <button
              className="csv-btn-primary"
              onClick={() => setStep(3)}
              disabled={!xAxis || yAxes.length === 0}
            >
              Generate Chart
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Preview ── */}
      {step === 3 && (
        <div className="csv-preview glass-panel">
          {/* Toolbar */}
          <div className="csv-preview-toolbar">
            <div className="csv-preview-info">
              <input
                className="csv-chart-title-input"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Chart title..."
              />
              <div className="csv-preview-tags">
                <span className="csv-info-tag">
                  {CHART_TYPES.find(t => t.id === chartType)?.label}
                </span>
                <span className="csv-info-tag">X: {xAxis}</span>
                <span className="csv-info-tag">Y: {yAxes.join(', ')}</span>
              </div>
            </div>
            <div className="csv-preview-actions">
              <button className="csv-btn-secondary" onClick={() => setStep(2)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Reconfigure
              </button>
              <button className="csv-btn-secondary" onClick={handleReset}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Reset
              </button>
              <button className="csv-btn-download" onClick={handleDownload}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PNG
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="csv-chart-canvas" ref={chartRef}>
            {chartTitle && <h3 className="csv-chart-canvas-title">{chartTitle}</h3>}
            <ResponsiveContainer width="100%" height={420}>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvChartBuilder;

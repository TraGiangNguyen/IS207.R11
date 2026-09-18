import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import './GraphView.css';

const SALES_DATA = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 7200 },
];

const GROWTH_DATA = [
  { name: 'Week 1', users: 120 },
  { name: 'Week 2', users: 250 },
  { name: 'Week 3', users: 480 },
  { name: 'Week 4', users: 890 },
];

const GraphView = () => {
  return (
    <div className="graph-container fade-in">
      <div className="graph-header">
        <h1 className="gradient-text">Analytics & Reports</h1>
        <p className="subtitle">Visualize performance and growth metrics</p>
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel">
          <h3>Monthly Sales</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(105, 235, 208, 0.3)', borderRadius: '8px' }} 
                  itemStyle={{ color: '#49d49d' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="sales" fill="url(#colorSales)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#69ebd0" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#49d49d" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-panel">
          <h3>User Growth</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(73, 212, 157, 0.3)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="users" stroke="#95f9e3" strokeWidth={3} dot={{ r: 6, fill: '#1a1a1a', stroke: '#95f9e3', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphView;

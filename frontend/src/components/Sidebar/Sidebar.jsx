import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Box, Menu, ChevronLeft } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'} glass-panel`}>
      <div className="sidebar-header">
        {isOpen && <h2 className="gradient-text logo-text">BeautyPals</h2>}
        <button className="toggle-btn" onClick={toggleSidebar} title="Toggle Sidebar">
          {isOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;

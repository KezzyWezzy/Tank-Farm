import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/tank-gauging', label: 'Tank Gauging' },
    { path: '/strapping-reports', label: 'Strapping Reports' },
    { path: '/manual-input', label: 'Manual Input' },
    { path: '/compliance', label: 'Compliance' },
    { path: '/settings', label: 'Settings' },
    { path: '/weight-scales', label: 'Weight Scales' },
    { path: '/tag-scanners', label: 'Tag Scanners' },
    { path: '/printers', label: 'Printers' },
    { path: '/tric-card-scanning', label: 'Tric Card Scanning' },
    { path: '/bol-management', label: 'BOL Management' },
    { path: '/barge-loading', label: 'Barge Loading' },
    { path: '/tank-to-tank-transfers', label: 'Tank to Tank Transfers' },
    { path: '/blending', label: 'Blending' },
    { path: '/allocations', label: 'Allocations' },
    { path: '/additives', label: 'Additives' },
    { path: '/analysis-profiles', label: 'Analysis Profiles' },
    { path: '/carriers', label: 'Carriers' },
    { path: '/crude-oil-leases', label: 'Crude Oil Leases' },
    { path: '/suppliers', label: 'Suppliers' },
    { path: '/customers', label: 'Customers' },
    { path: '/destinations-origins', label: 'Destinations & Origins' },
    { path: '/drivers', label: 'Drivers' },
    { path: '/exstars-products', label: 'ExSTARS Products' },
    { path: '/facility-ids', label: 'Facility IDs' },
    { path: '/products', label: 'Products' },
    { path: '/rail-cars', label: 'Rail Cars' },
    { path: '/shippers', label: 'Shippers' },
    { path: '/tank-products', label: 'Tank Products' },
    { path: '/tracking-codes', label: 'Tracking Codes' },
    { path: '/transports', label: 'Transports' },
    { path: '/dot-messages', label: 'DOT Messages' },
    { path: '/footnote-messages', label: 'Footnote Messages' },
    { path: '/database-explorer', label: 'Database Explorer' },
    { path: '/database-navigator', label: 'Database Navigator' },
  ];

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Persist collapse state in localStorage (optional)
  useEffect(() => {
    const savedState = localStorage.getItem('navbarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('navbarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <nav
      className={`fixed top-0 left-0 h-full bg-blue-600 text-white p-4 shadow-md transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Tank Gauge System
        </h1>
        <button
          onClick={toggleCollapse}
          className="text-white focus:outline-none hover:bg-blue-700 p-1 rounded"
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>
      <ul className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block py-2 px-4 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white ${
                  isActive ? 'bg-blue-800 text-white' : ''
                } ${isCollapsed ? 'text-center' : ''}`
              }
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {isCollapsed ? item.label.charAt(0) : item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
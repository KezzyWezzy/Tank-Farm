import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TankGauging from './pages/TankGauging';
import StrappingReports from './pages/StrappingReports';
import ManualInput from './pages/ManualInput';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';
import WeightScales from './pages/WeightScales';
import TagScanners from './pages/TagScanners';
import Printers from './pages/Printers';
import TricCardScanning from './pages/TricCardScanning';
import BOLManagement from './pages/BOLManagement';
import BargeLoading from './pages/BargeLoading';
import TankToTankTransfers from './pages/TankToTankTransfers';
import Blending from './pages/Blending';
import Allocations from './pages/Allocations';
import Additives from './pages/Additives';
import AnalysisProfiles from './pages/AnalysisProfiles';
import Carriers from './pages/Carriers';
import CrudeOilLeases from './pages/CrudeOilLeases';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import DestinationsOrigins from './pages/DestinationsOrigins';
import Drivers from './pages/Drivers';
import ExstarsProducts from './pages/ExstarsProducts';
import FacilityIds from './pages/FacilityIds';
import Products from './pages/Products';
import RailCars from './pages/RailCars';
import Shippers from './pages/Shippers';
import TankProducts from './pages/TankProducts';
import TrackingCodes from './pages/TrackingCodes';
import Transports from './pages/Transports';
import DotMessages from './pages/DotMessages';
import FootnoteMessages from './pages/FootnoteMessages';
import DatabaseExplorer from './pages/DatabaseExplorer';
import DatabaseNavigator from './pages/DatabaseNavigator';
import TankSelector from './components/TankSelector';
import StrappingChartUpload from './components/StrappingChartUpload';
import InfraredScanForm from './components/InfraredScanForm';
import ReportDownload from './components/ReportDownload';

function App() {
  const [reloadKey, setReloadKey] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const [selectedTankId, setSelectedTankId] = useState('Tank_001'); // Global tank state

  const handleSaveAndReload = () => {
    setIsReloading(true);
    setReloadKey((prevKey) => prevKey + 1);
    setTimeout(() => {
      setIsReloading(false); // Reset reloading state before reload
      window.location.reload(); // Perform the reload
    }, 500); // Small delay for feedback
  };

  useEffect(() => {
    if (isReloading) {
      const timer = setTimeout(() => setIsReloading(false), 1000);
      return () => clearTimeout(timer); // Cleanup timer on unmount or re-render
    }
  }, [isReloading]);

  return (
    <Router key={reloadKey}>
      <div className="flex min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 ml-0 md:ml-64 p-4">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tank-gauging" element={<TankGauging />} />
              <Route
                path="/strapping-reports"
                element={
                  <div>
                    <h1 className="text-2xl font-bold mb-6">Strapping Reports</h1>
                    <div className="mb-4">
                      <TankSelector onSelectTank={setSelectedTankId} />
                    </div>
                    <div className="mb-4">
                      <StrappingChartUpload tankId={selectedTankId} />
                    </div>
                    <div className="mb-4">
                      <StrappingReports tankId={selectedTankId} />
                    </div>
                    <div className="mb-4">
                      <InfraredScanForm tankId={selectedTankId} />
                    </div>
                    <div>
                      <ReportDownload tankId={selectedTankId} />
                    </div>
                  </div>
                }
              />
              <Route path="/manual-input" element={<ManualInput />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/weight-scales" element={<WeightScales />} />
              <Route path="/tag-scanners" element={<TagScanners />} />
              <Route path="/printers" element={<Printers />} />
              <Route path="/tric-card-scanning" element={<TricCardScanning />} />
              <Route
                path="/bol-management"
                element={<BOLManagement tankId={selectedTankId} />}
              />
              <Route path="/barge-loading" element={<BargeLoading />} />
              <Route path="/tank-to-tank-transfers" element={<TankToTankTransfers />} />
              <Route path="/blending" element={<Blending />} />
              <Route path="/allocations" element={<Allocations />} />
              <Route path="/additives" element={<Additives />} />
              <Route path="/analysis-profiles" element={<AnalysisProfiles />} />
              <Route path="/carriers" element={<Carriers />} />
              <Route path="/crude-oil-leases" element={<CrudeOilLeases />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/destinations-origins" element={<DestinationsOrigins />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/exstars-products" element={<ExstarsProducts />} />
              <Route path="/facility-ids" element={<FacilityIds />} />
              <Route path="/products" element={<Products />} />
              <Route path="/rail-cars" element={<RailCars />} />
              <Route path="/shippers" element={<Shippers />} />
              <Route path="/tank-products" element={<TankProducts />} />
              <Route path="/tracking-codes" element={<TrackingCodes />} />
              <Route path="/transports" element={<Transports />} />
              <Route path="/dot-messages" element={<DotMessages />} />
              <Route path="/footnote-messages" element={<FootnoteMessages />} />
              <Route path="/database-explorer" element={<DatabaseExplorer />} />
              <Route path="/database-navigator" element={<DatabaseNavigator />} />
            </Routes>
            <button
              onClick={handleSaveAndReload}
              disabled={isReloading}
              className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isReloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isReloading ? 'Reloading...' : 'Save and Reload'}
            </button>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
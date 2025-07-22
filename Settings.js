import { useState, useEffect } from 'react';

const Settings = () => {
  const [tankId, setTankId] = useState('TANK-001');
  const [settings, setSettings] = useState({
    ip_address: '',
    port: '',
    unit_id: '',
    level_register: '',
    temperature_register: '',
    pressure_register: '',
    status_register: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const tanks = ['TANK-001', 'TANK-002', 'TANK-003'];

  // Fetch settings when tankId changes
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setMessage('');
      setError('');
      try {
        const response = await fetch(`http://localhost:8000/modbus/settings/${tankId}`);
        const data = await response.json();
        if (response.ok) {
          setSettings(data);
          setError('');
        } else {
          setError(data.detail || 'Failed to fetch settings');
          setSettings({
            ip_address: '',
            port: '',
            unit_id: '',
            level_register: '',
            temperature_register: '',
            pressure_register: '',
            status_register: ''
          });
        }
      } catch (err) {
        setError('Failed to connect to backend');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [tankId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  // Validate and submit settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Client-side validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(settings.ip_address)) {
      setError('Invalid IP address format');
      setLoading(false);
      return;
    }
    const portNum = parseInt(settings.port);
    if (portNum < 1 || portNum > 65535) {
      setError('Port must be between 1 and 65535');
      setLoading(false);
      return;
    }
    const unitId = parseInt(settings.unit_id);
    if (unitId < 0 || unitId > 247) {
      setError('Unit ID must be between 0 and 247');
      setLoading(false);
      return;
    }
    const registers = [
      settings.level_register,
      settings.temperature_register,
      settings.pressure_register,
      settings.status_register
    ];
    if (registers.some(reg => parseInt(reg) < 0)) {
      setError('Register addresses must be non-negative');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/modbus/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tank_id: tankId, ...settings })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.detail || 'Failed to update settings');
      }
    } catch (err) {
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Modbus Settings</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Tank:</label>
        <select
          value={tankId}
          onChange={(e) => setTankId(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tanks.map(tank => (
            <option key={tank} value={tank}>{tank}</option>
          ))}
        </select>
      </div>
      {message && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <p>{message}</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Configure Modbus for {tankId}</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">IP Address:</label>
          <input
            type="text"
            name="ip_address"
            value={settings.ip_address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 192.168.1.100"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Port:</label>
          <input
            type="number"
            name="port"
            value={settings.port}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="65535"
            placeholder="e.g., 502"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID:</label>
          <input
            type="number"
            name="unit_id"
            value={settings.unit_id}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="247"
            placeholder="e.g., 1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Level Register:</label>
          <input
            type="number"
            name="level_register"
            value={settings.level_register}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="e.g., 0"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Register:</label>
          <input
            type="number"
            name="temperature_register"
            value={settings.temperature_register}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="e.g., 1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pressure Register:</label>
          <input
            type="number"
            name="pressure_register"
            value={settings.pressure_register}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="e.g., 2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Register:</label>
          <input
            type="number"
            name="status_register"
            value={settings.status_register}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="e.g., 3"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;


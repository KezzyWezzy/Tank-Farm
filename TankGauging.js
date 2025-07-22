import { useState, useEffect } from 'react';

const TankGauging = () => {
  const [tankId, setTankId] = useState('TANK-001');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const tanks = ['TANK-001', 'TANK-002', 'TANK-003'];

  const fetchTankData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/modbus/tank-data/${tankId}`);
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        setError(result.error || 'Failed to fetch tank data');
        setData(null);
      }
    } catch (err) {
      setError('Failed to connect to backend');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTankData();
    const interval = setInterval(fetchTankData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [tankId]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tank Gauging</h2>
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
      {loading && (
        <div className="mb-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded">
          <p>Loading...</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      {data && (
        <div className={`p-6 rounded-lg shadow-md ${data.registers.status === 1 ? 'bg-red-100' : 'bg-white'}`}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{data.tank_id} Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Level:</p>
              <p className="text-lg font-semibold">{data.registers.level.toFixed(2)} m</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Temperature:</p>
              <p className="text-lg font-semibold">{data.registers.temperature.toFixed(2)} °C</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pressure:</p>
              <p className="text-lg font-semibold">{data.registers.pressure.toFixed(2)} bar</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status:</p>
              <p className={`text-lg font-semibold ${data.registers.status === 1 ? 'text-red-600' : 'text-green-600'}`}>
                {data.registers.status === 1 ? 'ALARM' : 'OK'}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Last Updated: {new Date(data.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default TankGauging;

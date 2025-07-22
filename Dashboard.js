import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [realTimeData, setRealTimeData] = useState(null);
  const [selectedTank, setSelectedTank] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [page, setPage] = useState(1);
  const [alerts, setAlerts] = useState([]);
  const itemsPerPage = 10;
  const tanks = ['TANK-001', 'TANK-002', 'TANK-003'];

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch('http://localhost:8000/modbus/tank-data/all');
        const data = await response.json();
        if (response.ok) {
          // Transform data to match expected format
          const validData = Array.isArray(data) ? data.map(item => ({
            tank_id: item.tank_id,
            level: item.registers.level,
            temperature: item.registers.temperature,
            pressure: item.registers.pressure,
            status: item.registers.status,
            timestamp: item.timestamp
          })) : [];
          setHistoricalData(validData);
          const newAlerts = validData
            .filter(d => d.status === 1)
            .map(d => ({
              tank_id: d.tank_id,
              timestamp: d.timestamp,
              message: `Abnormal status detected for ${d.tank_id} at ${new Date(d.timestamp).toLocaleString()}`
            }));
          setAlerts(newAlerts);
        } else {
          console.error('Error fetching historical data:', data.error);
          setHistoricalData([]);
          setAlerts([]);
        }
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setHistoricalData([]);
        setAlerts([]);
      }
    };

    const fetchRealTimeData = async () => {
      if (selectedTank !== 'all') {
        try {
          const response = await fetch(`http://localhost:8000/modbus/tank-data/${selectedTank}`);
          const data = await response.json();
          if (response.ok) {
            setRealTimeData({
              tank_id: data.tank_id,
              level: data.registers.level,
              temperature: data.registers.temperature,
              pressure: data.registers.pressure,
              status: data.registers.status,
              timestamp: data.timestamp
            });
          } else {
            console.error('Error fetching real-time data:', data.error);
            setRealTimeData(null);
          }
        } catch (error) {
          console.error('Error fetching real-time Modbus data:', error);
          setRealTimeData(null);
        }
      } else {
        setRealTimeData(null);
      }
    };

    fetchHistoricalData();
    fetchRealTimeData();
    const interval = setInterval(() => {
      fetchHistoricalData();
      fetchRealTimeData();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedTank]);

  const filteredData = selectedTank === 'all'
    ? historicalData.filter(d =>
        (!dateRange.start || new Date(d.timestamp) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(d.timestamp) <= new Date(dateRange.end))
      )
    : historicalData.filter(d =>
        d.tank_id === selectedTank &&
        (!dateRange.start || new Date(d.timestamp) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(d.timestamp) <= new Date(dateRange.end))
      );

  const paginatedData = Array.isArray(filteredData)
    ? filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : [];
  const totalPages = Math.ceil((filteredData.length || 0) / itemsPerPage);

  const chartData = {
    labels: paginatedData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Tank Level (m)',
        data: paginatedData.map((d) => d.level),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Temperature (°C)',
        data: paginatedData.map((d) => d.temperature),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        text: `Historical Tank Data (${selectedTank === 'all' ? 'All Tanks' : selectedTank})`
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const exportCSV = () => {
    const csv = [
      "Tank ID,Level (m),Temperature (°C),Pressure (bar),Status,Timestamp",
      ...filteredData.map(d => `${d.tank_id},${d.level.toFixed(2)},${d.temperature.toFixed(2)},${d.pressure.toFixed(2)},${d.status === 1 ? 'ALARM' : 'OK'},${d.timestamp}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tank_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      {alerts.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <h3 className="font-semibold">Alerts</h3>
          <ul className="list-disc pl-5">
            {alerts.map((alert, index) => (
              <li key={index}>{alert.message}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="mr-2">Tank: </label>
          <select
            value={selectedTank}
            onChange={(e) => setSelectedTank(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Tanks</option>
            {tanks.map(tank => (
              <option key={tank} value={tank}>{tank}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Start Date: </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label className="mr-2">End Date: </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
      </div>
      <button
        onClick={exportCSV}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Export Data as CSV
      </button>
      {realTimeData && selectedTank !== 'all' && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Real-Time Modbus Data ({selectedTank})</h3>
          <div className={realTimeData.status === 1 ? 'bg-red-100 p-4 rounded' : 'p-4'}>
            <p><strong>Level:</strong> {realTimeData.level.toFixed(2)} m</p>
            <p><strong>Temperature:</strong> {realTimeData.temperature.toFixed(2)} °C</p>
            <p><strong>Pressure:</strong> {realTimeData.pressure.toFixed(2)} bar</p>
            <p><strong>Status:</strong> {realTimeData.status === 1 ? 'ALARM' : 'OK'}</p>
            <p><strong>Timestamp:</strong> {new Date(realTimeData.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Tank Data Trends</h3>
        {paginatedData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>No historical data available</p>
        )}
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Recent Data (Page {page} of {totalPages})</h3>
        <div className="mb-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 mr-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Tank ID</th>
              <th className="border p-2">Level (m)</th>
              <th className="border p-2">Temperature (°C)</th>
              <th className="border p-2">Pressure (bar)</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((data) => (
              <tr key={data.id} className={data.status === 1 ? 'bg-red-100' : ''}>
                <td className="border p-2">{data.tank_id}</td>
                <td className="border p-2">{data.level.toFixed(2)}</td>
                <td className="border p-2">{data.temperature.toFixed(2)}</td>
                <td className="border p-2">{data.pressure.toFixed(2)}</td>
                <td className="border p-2">{data.status === 1 ? 'ALARM' : 'OK'}</td>
                <td className="border p-2">{data.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const StrappingReports = ({ tankId }) => {
  const [selectedTankId, setSelectedTankId] = useState(tankId || 'Tank_001');
  const [strappingData, setStrappingData] = useState([]);
  const [latestScan, setLatestScan] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gaugeOff, setGaugeOff] = useState({ tank_id: selectedTankId, level: '' });

  useEffect(() => {
    if (tankId && tankId !== selectedTankId) setSelectedTankId(tankId);
    fetchStrappingData(selectedTankId);
    fetchLatestScan(selectedTankId);
  }, [tankId, selectedTankId]);

  const fetchStrappingData = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/strapping/strapping-charts/retrieve', { tank_id: id });
      setStrappingData(response.data);
      setError('');
    } catch (err) {
      setError(`Error: ${err.response?.data?.detail || err.message}`);
      setStrappingData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestScan = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/strapping/infrared-scans/report', {
        tank_id: id,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString()
      }, { responseType: 'text' }); // Explicitly request text to handle CSV
      const scans = response.data ? response.data.split('\n').slice(1, -1).map(row => row.split(',')) : [];
      const latest = scans
        .map(row => ({
          liquid_height_m: parseFloat(row[3]),
          volume_barrels: parseFloat(row[4]),
          scan_datetime: new Date(row[2])
        }))
        .filter(scan => !isNaN(scan.liquid_height_m) && !isNaN(scan.volume_barrels) && !isNaN(scan.scan_datetime))
        .sort((a, b) => b.scan_datetime - a.scan_datetime)[0];
      setLatestScan(latest || null);
    } catch (err) {
      setError(`Error fetching latest scan: ${err.message}`);
      setLatestScan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/strapping/infrared-scans', {
        tank_id: selectedTankId,
        scan_datetime: new Date().toISOString(),
        liquid_height_m: parseFloat(gaugeOff.level),
        ambient_temp_c: 25.0,
        technician: 'Operator',
        conditions: 'Manual',
        notes: ''
      });
      alert(`Input recorded. Volume: ${response.data.volume_barrels} barrels`);
      fetchStrappingData(selectedTankId);
      fetchLatestScan(selectedTankId);
    } catch (error) {
      setError('Failed to submit gauge-off value');
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    const csvContent = [
      'tank_id,liquid_height_m,volume_barrels',
      ...strappingData.map(row => `${selectedTankId},${row.liquid_height_m},${row.volume_barrels}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `strapping_chart_${selectedTankId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Strapping Report", 10, 10);
    doc.setFontSize(12);
    let y = 20;
    strappingData.forEach(row => {
      doc.text(`Height: ${row.liquid_height_m.toFixed(1)} m`, 10, y);
      doc.text(`Volume: ${row.volume_barrels.toFixed(1)} barrels`, 10, y + 10);
      y += 20;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`strapping_report_${selectedTankId}.pdf`);
  };

  const chartData = {
    labels: ['Tank Level'],
    datasets: [{
      label: 'Liquid Height (m)',
      data: [latestScan ? latestScan.liquid_height_m : 0],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      maxBarThickness: 100
    }, {
      label: 'Max Height (m)',
      data: [15], // Assuming 15m max height
      backgroundColor: 'rgba(192, 192, 192, 0.3)',
      borderColor: 'rgba(192, 192, 192, 1)',
      borderWidth: 1,
      maxBarThickness: 100
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 15,
        title: { display: true, text: 'Height (m)' }
      }
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Tank Liquid Level' }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Strapping Reports</h2>
      <div className="flex flex-col md:flex-row mb-6">
        <div className="mb-4 md:mb-0 md:mr-6">
          <label className="mr-2 text-sm font-medium text-gray-700">Select Tank: </label>
          <select
            value={selectedTankId}
            onChange={(e) => setSelectedTankId(e.target.value)}
            className="p-2 border rounded"
          >
            {['Tank_001', 'Tank_002', 'Tank_003'].map(tank => (
              <option key={tank} value={tank}>{tank}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          {latestScan || strappingData.length > 0 ? (
            <div className="flex flex-col md:flex-row">
              <div className="md:mr-6">
                <div className="mb-4">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600">Strapping Scale</h4>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2">Liquid Height (m)</th>
                        <th className="border p-2">Volume (Barrels)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strappingData.map((row) => (
                        <tr key={row.liquid_height_m}>
                          <td className="border p-2">{row.liquid_height_m.toFixed(1)}</td>
                          <td className="border p-2">{row.volume_barrels.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {latestScan && (
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm font-medium text-gray-600">Level:</p><p className="text-lg font-semibold">{latestScan.liquid_height_m.toFixed(1)} m</p></div>
                    <div><p className="text-sm font-medium text-gray-600">Volume:</p><p className="text-lg font-semibold">{latestScan.volume_barrels.toFixed(1)} barrels</p></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No data available for {selectedTankId}</p>
          )}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Enter Gauge-Off Value</h3>
        <form onSubmit={handleSubmission} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tank ID</label>
            <select
              value={gaugeOff.tank_id}
              onChange={(e) => setGaugeOff({ ...gaugeOff, tank_id: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {['Tank_001', 'Tank_002', 'Tank_003'].map(tank => (
                <option key={tank} value={tank}>{tank}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level (m)</label>
            <input
              type="number"
              value={gaugeOff.level}
              onChange={(e) => setGaugeOff({ ...gaugeOff, level: e.target.value })}
              className="w-full p-2 border rounded"
              step="0.1"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit Gauge-Off
          </button>
        </form>
      </div>
      <div className="mb-6">
        <button onClick={downloadCsv} className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600">
          Download CSV
        </button>
        <button onClick={exportPdf} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Export PDF
        </button>
      </div>
      {loading && <div className="mb-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded"><p>Loading...</p></div>}
      {error && <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded"><p>{error}</p></div>}
    </div>
  );
};

export default StrappingReports;
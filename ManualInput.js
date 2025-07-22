import React, { useState } from 'react';

const ManualInput = () => {
  const [formData, setFormData] = useState({ tank_id: 'TANK-001', level: '', temperature: '', pressure: '' });
  const tanks = ['TANK-001', 'TANK-002', 'TANK-003'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/logistics/manual-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tank_id: formData.tank_id,
          level: parseFloat(formData.level),
          temperature: parseFloat(formData.temperature) || 25.0,
          pressure: parseFloat(formData.pressure) || 6.0
        })
      });
      const result = await response.json();
      console.log('Manual Input Submitted:', formData);
      alert(`Input recorded. Barrel Count: ${result.barrel_count} barrels`);
    } catch (error) {
      console.error('Error submitting manual input:', error);
      alert('Failed to submit manual input');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manual Input</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tank ID</label>
          <select
            value={formData.tank_id}
            onChange={(e) => setFormData({ ...formData, tank_id: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {tanks.map(tank => (
              <option key={tank} value={tank}>{tank}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Level (m)</label>
          <input
            type="number"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
          <input
            type="number"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pressure (bar)</label>
          <input
            type="number"
            value={formData.pressure}
            onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
      </form>
    </div>
  );
};

export default ManualInput;
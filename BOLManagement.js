import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BOLManagement = ({ tankId }) => {
  const [bols, setBols] = useState([]);
  const [newBOL, setNewBOL] = useState({ shipment_id: '', details: { tank_id: tankId || 'Tank_001' }, status: 'pending' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBOLs();
  }, []);

  const fetchBOLs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/logistics/bol-messages');
      const filteredBOLs = response.data.filter(bol => !tankId || bol.details.tank_id === tankId);
      setBols(filteredBOLs);
    } catch (err) {
      setError('Failed to fetch BOLs');
      console.error(err);
    }
  };

  const handleCreateBOL = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/logistics/bol-messages', {
        ...newBOL,
        details: { ...newBOL.details, tank_id: tankId || 'Tank_001' }
      });
      setBols([...bols, response.data]);
      setNewBOL({ shipment_id: '', details: { tank_id: tankId || 'Tank_001' }, status: 'pending' });
      setError(null);
    } catch (err) {
      setError('Failed to create BOL');
      console.error(err);
    }
  };

  const handleUpdateBOL = async (shipment_id, updatedBOL) => {
    try {
      await axios.put(`http://localhost:8000/logistics/bol-messages/${shipment_id}`, {
        ...updatedBOL,
        details: { ...updatedBOL.details, tank_id: tankId || updatedBOL.details.tank_id }
      });
      fetchBOLs(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Failed to update BOL');
      console.error(err);
    }
  };

  const handleDeleteBOL = async (shipment_id) => {
    try {
      await axios.delete(`http://localhost:8000/logistics/bol-messages/${shipment_id}`);
      setBols(bols.filter(bol => bol.shipment_id !== shipment_id));
      setError(null);
    } catch (err) {
      setError('Failed to delete BOL');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">BOL Management for Tank {tankId || 'All'}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleCreateBOL} className="mb-4">
        <input
          type="number"
          value={newBOL.shipment_id}
          onChange={(e) => setNewBOL({ ...newBOL, shipment_id: e.target.value })}
          placeholder="Shipment ID"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          value={JSON.stringify(newBOL.details)}
          onChange={(e) => setNewBOL({ ...newBOL, details: JSON.parse(e.target.value) || {} })}
          placeholder='Details (e.g., {"status": "delivered"})'
          className="border p-2 mr-2"
          required
        />
        <select
          value={newBOL.status}
          onChange={(e) => setNewBOL({ ...newBOL, status: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">Create BOL</button>
      </form>
      <ul>
        {bols.map((bol) => (
          <li key={bol.shipment_id} className="mb-2 p-2 border">
            <p>Shipment ID: {bol.shipment_id}</p>
            <p>Details: {JSON.stringify(bol.details)}</p>
            <p>Status: {bol.status}</p>
            <p>Created At: {bol.created_at}</p>
            <button
              onClick={() => handleUpdateBOL(bol.shipment_id, { ...bol, status: 'delivered' })}
              className="bg-green-500 text-white p-1 mr-2"
            >
              Mark Delivered
            </button>
            <button
              onClick={() => handleDeleteBOL(bol.shipment_id)}
              className="bg-red-500 text-white p-1"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BOLManagement;
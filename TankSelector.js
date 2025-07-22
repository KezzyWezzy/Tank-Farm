import React from 'react';

const TankSelector = ({ onSelectTank }) => {
  const tanks = ['Tank_001', 'Tank_002', 'Tank_003'];
  return (
    <select onChange={(e) => onSelectTank(e.target.value)} className="p-2 border rounded">
      {tanks.map(tank => (
        <option key={tank} value={tank}>{tank}</option>
      ))}
    </select>
  );
};

export default TankSelector;
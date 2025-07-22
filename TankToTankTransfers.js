import { useEffect } from 'react';
import InProgress from '../components/InProgress';

const TankToTankTransfers = () => {
  useEffect(() => {
    const payload = {
      resource: "tank_transfer",
      action: "get",
      skip: 0,
      limit: 10
    };
    fetch('http://localhost:8000/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => console.log("Tank Transfer Data:", data))
    .catch(error => console.error("Error:", error));
  }, []);

  return <InProgress feature="Tank-to-Tank Transfers" />;
};

export default TankToTankTransfers;
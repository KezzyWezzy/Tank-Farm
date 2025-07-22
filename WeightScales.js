import { useEffect } from 'react';
import InProgress from '../components/InProgress';

const WeightScales = () => {
  useEffect(() => {
    const payload = {
      resource: "weight_scales",
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
    .then(data => console.log("Weight Scales Data:", data))
    .catch(error => console.error("Error:", error));
  }, []);

  return <InProgress feature="Weight Scales" />;
};

export default WeightScales;
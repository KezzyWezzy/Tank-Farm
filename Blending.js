import { useEffect } from 'react';
import InProgress from '../components/InProgress';

const Blending = () => {
  useEffect(() => {
    const payload = {
      resource: "blending",
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
    .then(data => console.log("Blending Data:", data))
    .catch(error => console.error("Error:", error));
  }, []);

  return <InProgress feature="Blending" />;
};

export default Blending;
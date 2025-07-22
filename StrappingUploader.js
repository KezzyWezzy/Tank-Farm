import React, { useState } from 'react';
import axios from 'axios';

const StrappingUploader = ({ tankId }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('tank_id', tankId);
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/strapping/strapping-charts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus(`Uploaded ${res.data.count} records.`);
    } catch (err) {
      setStatus('Upload failed.');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload Strapping Chart</button>
      <p>{status}</p>
    </form>
  );
};

export default StrappingUploader;
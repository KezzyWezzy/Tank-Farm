import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';

const StrappingChartUpload = ({ tankId }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('tank_id', tankId || 'Tank_001');
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8000/strapping/strapping-charts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`Imported ${response.data.count} records for ${tankId || 'Tank_001'}`);
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tank ID"
          value={tankId || 'Tank_001'}
          disabled
          sx={{ marginBottom: 2, width: '200px' }}
        />
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Upload Strapping Chart
        </Button>
      </form>
      {message && <Typography sx={{ marginTop: 2 }}>{message}</Typography>}
    </div>
  );
};

export default StrappingChartUpload;
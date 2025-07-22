import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';

const ReportDownload = ({ tankId }) => {
  const [formData, setFormData] = useState({
    tank_id: tankId || 'Tank_001',
    start_date: '',
    end_date: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/strapping/infrared-scans/report',
        formData,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scan_report_${formData.tank_id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('Report downloaded successfully');
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleDownload}>
        <TextField
          name="tank_id"
          label="Tank ID"
          value={formData.tank_id}
          onChange={handleChange}
          sx={{ marginBottom: 2, width: '200px' }}
          required
        />
        <TextField
          name="start_date"
          label="Start Date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          sx={{ marginBottom: 2, marginLeft: 2, width: '200px' }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          name="end_date"
          label="End Date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          sx={{ marginBottom: 2, marginLeft: 2, width: '200px' }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Download Scan Report
        </Button>
      </form>
      {message && <Typography sx={{ marginTop: 2 }}>{message}</Typography>}
    </div>
);
};

export default ReportDownload;
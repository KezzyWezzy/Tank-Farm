import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const InfraredScanForm = ({ tankId }) => {
  const [formData, setFormData] = useState({
    tank_id: tankId || 'Tank_001',
    scan_datetime: '',
    liquid_height_m: '',
    ambient_temp_c: '',
    technician: '',
    conditions: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [previewHeight, setPreviewHeight] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/strapping/infrared-scans', {
        ...formData,
        liquid_height_m: parseFloat(formData.liquid_height_m),
        ambient_temp_c: parseFloat(formData.ambient_temp_c) || 0
      });
      setMessage(`Scan added! Volume: ${response.data.volume_barrels} barrels`);
      setPreviewHeight(parseFloat(formData.liquid_height_m));
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'liquid_height_m') {
      setPreviewHeight(parseFloat(e.target.value) || 0);
    }
  };

  const chartData = {
    labels: ['Tank Level'],
    datasets: [{
      label: 'Liquid Height (m)',
      data: [previewHeight],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      maxBarThickness: 100
    }, {
      label: 'Max Height (m)',
      data: [15],
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
      title: { display: true, text: 'Preview Tank Level' }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="tank_id"
          label="Tank ID"
          value={formData.tank_id}
          onChange={handleChange}
          sx={{ marginBottom: 2, width: '200px' }}
          required
        />
        <TextField
          name="scan_datetime"
          label="Scan DateTime"
          type="datetime-local"
          value={formData.scan_datetime}
          onChange={handleChange}
          sx={{ marginBottom: 2, marginLeft: 2, width: '200px' }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          name="liquid_height_m"
          label="Liquid Height (m)"
          type="number"
          step="0.1"
          value={formData.liquid_height_m}
          onChange={handleChange}
          sx={{ marginBottom: 2, marginLeft: 2, width: '150px' }}
          required
        />
        <TextField
          name="ambient_temp_c"
          label="Ambient Temp (°C)"
          type="number"
          value={formData.ambient_temp_c}
          onChange={handleChange}
          sx={{ marginBottom: 2, marginLeft: 2, width: '150px' }}
        />
        <TextField
          name="technician"
          label="Technician"
          value={formData.technician}
          onChange={handleChange}
          sx={{ marginBottom: 2, marginLeft: 2, width: '200px' }}
        />
        <TextField
          name="conditions"
          label="Conditions"
          value={formData.conditions}
          onChange={handleChange}
          sx={{ marginBottom: 2, marginLeft: 2, width: '200px' }}
        />
        <TextField
          name="notes"
          label="Notes"
          value={formData.notes}
          onChange={handleChange}
          sx={{ marginBottom: 2, marginLeft: 2, width: '300px' }}
          multiline
        />
        <Box sx={{ mb: 2 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
        <Box>
          <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
            Submit Scan
          </Button>
        </Box>
      </form>
      {message && <Typography sx={{ marginTop: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default InfraredScanForm;
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import { isValidUrl, generateShortCode } from '../utils/helpers';
import { logEvent } from '../utils/logger';

const ShortenerPage = () => {
  const [entries, setEntries] = useState([
    { longUrl: '', shortcode: '', validity: '', error: '', result: null },
  ]);

  const handleChange = (index, key, value) => {
    const copy = [...entries];
    copy[index][key] = value;
    setEntries(copy);
  };

  const addEntry = () => {
    if (entries.length < 5) {
      setEntries([...entries, { longUrl: '', shortcode: '', validity: '', error: '', result: null }]);
    }
  };

  const shortenUrls = () => {
    const updated = entries.map((entry) => {
      if (!isValidUrl(entry.longUrl)) {
        return { ...entry, error: 'Invalid URL' };
      }
      const validity = parseInt(entry.validity);
      if (entry.validity && (isNaN(validity) || validity <= 0)) {
        return { ...entry, error: 'Invalid validity time' };
      }

      let shortcode = entry.shortcode.trim() || generateShortCode();
      const now = new Date();
      const expiry = new Date(now.getTime() + (validity || 30) * 60000);
      const result = {
        shortUrl: `http://localhost:3000/${shortcode}`,
        expiry: expiry.toLocaleString(),
      };

      logEvent('URL_SHORTENED', {
        longUrl: entry.longUrl,
        shortUrl: result.shortUrl,
        expiry: result.expiry,
      });

      localStorage.setItem(shortcode, JSON.stringify({
        longUrl: entry.longUrl,
        createdAt: now.toISOString(),
        expiry: expiry.toISOString(),
        clicks: []
      }));

      return { ...entry, error: '', result };
    });
    setEntries(updated);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {entries.map((entry, idx) => (
        <Paper key={idx} style={{ padding: 16, marginBottom: 10 }}>
          <TextField label="Long URL" fullWidth value={entry.longUrl} onChange={(e) => handleChange(idx, 'longUrl', e.target.value)} margin="dense" />
          <TextField label="Shortcode (optional)" fullWidth value={entry.shortcode} onChange={(e) => handleChange(idx, 'shortcode', e.target.value)} margin="dense" />
          <TextField label="Validity (minutes, optional)" fullWidth value={entry.validity} onChange={(e) => handleChange(idx, 'validity', e.target.value)} margin="dense" />
          {entry.error && <Typography color="error">{entry.error}</Typography>}
          {entry.result && (
            <Typography color="primary">Short URL: <a href={entry.result.shortUrl}>{entry.result.shortUrl}</a> (Expires: {entry.result.expiry})</Typography>
          )}
        </Paper>
      ))}
      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={shortenUrls}>Shorten</Button>
        <Button variant="outlined" onClick={addEntry}>Add URL</Button>
      </Box>
    </Container>
  );
};

export default ShortenerPage;
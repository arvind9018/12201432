import React from 'react';
import { Typography, Container, Paper } from '@mui/material';

const StatsPage = () => {
  const data = [];
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key));
        if (parsed.longUrl) {
          data.push({ shortcode: key, ...parsed });
        }
      } catch {}
    }
  }

  return (
    <Container>
      <Typography variant="h4">URL Statistics</Typography>
      {data.map((item, idx) => (
        <Paper key={idx} style={{ padding: 16, marginTop: 10 }}>
          <Typography variant="h6">Short URL: <a href={`/${item.shortcode}`}>{`/${item.shortcode}`}</a></Typography>
          <Typography>Original URL: {item.longUrl}</Typography>
          <Typography>Created At: {new Date(item.createdAt).toLocaleString()}</Typography>
          <Typography>Expires At: {new Date(item.expiry).toLocaleString()}</Typography>
          <Typography>Total Clicks: {item.clicks.length}</Typography>
          <Typography>Click Details:</Typography>
          <ul>
            {item.clicks.map((click, i) => (
              <li key={i}>{click.timestamp} - {click.referrer || 'direct'} - {click.location || 'unknown'}</li>
            ))}
          </ul>
        </Paper>
      ))}
    </Container>
  );
};

export default StatsPage;
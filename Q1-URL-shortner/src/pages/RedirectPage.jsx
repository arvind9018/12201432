import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logEvent } from '../utils/logger';

const RedirectPage = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const recordClick = async () => {
      const entry = JSON.parse(localStorage.getItem(shortcode));
      if (!entry) {
        alert('Invalid or expired short URL');
        navigate('/');
        return;
      }

      const now = new Date();
      const expiry = new Date(entry.expiry);
      if (now > expiry) {
        alert('This link has expired');
        navigate('/');
        return;
      }

      const click = {
        timestamp: now.toISOString(),
        referrer: document.referrer,
        location: 'Unknown', // Add IP API call if backend supported
      };

      entry.clicks.push(click);
      localStorage.setItem(shortcode, JSON.stringify(entry));
      logEvent('CLICK_TRACKED', { shortcode, ...click });
      window.location.href = entry.longUrl;
    };

    recordClick();
  }, [shortcode, navigate]);

  return <p>Redirecting...</p>;
};

export default RedirectPage;

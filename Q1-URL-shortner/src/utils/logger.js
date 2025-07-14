export const logEvent = (type, data) => {
  const log = {
    timestamp: new Date().toISOString(),
    type,
    data,
  };
  const existingLogs = JSON.parse(localStorage.getItem('logs')) || [];
  existingLogs.push(log);
  localStorage.setItem('logs', JSON.stringify(existingLogs));
};
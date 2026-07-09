const mongoose = require('mongoose');

/**
 * @desc Get system health status
 * @route GET /api/v1/health
 * @access Public
 */
const getHealthStatus = (req, res) => {
  const readyState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING'
  };

  const healthData = {
    status: 'UP',
    database: dbStatusMap[readyState] || 'UNKNOWN',
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  const isHealthy = readyState === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: true,
    message: isHealthy ? 'System is healthy' : 'System is degraded (database connection issue)',
    data: healthData,
    errors: null
  });
};

module.exports = {
  getHealthStatus
};

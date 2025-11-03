module.exports = {
  apps: [
    {
      name: 'backend-server',
      script: './server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      // Disable PM2's require-in-the-middle module tracing
      // which is causing issues with Express middleware
      trace: false,
      disable_trace: true,
      pmx: false
    }
  ]
};

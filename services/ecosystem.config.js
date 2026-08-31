module.exports = {
  apps: [
    {
      name: 'data-gateway',
      script: 'lib/index.js',
      watch: false,
      exp_backoff_restart_delay: 100,
      time: true,
      node_args: '-r dotenv/config',
    },
  ],
};

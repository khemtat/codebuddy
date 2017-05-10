/**
 * Expose `redis config` for used in `connect-redis`
 */
module.exports = {
  redisConfig: {
    /**
     * Redis configuration for development site
     */
    development: {
      host: 'localhost',
      port: 32768
    },
    /**
     * Redis configuration for production site
     */
    production: {
      host: undefined,
      port: undefined
    }
  }
}

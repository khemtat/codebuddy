const socketio = require('socket.io')
const winston = require('winston')
const Redis = require('ioredis')
const redisConf = require('../config/redis')
const _ = require('lodash')

/**
 * @param {Object} server server instance
 */
module.exports = (server) => {
  // Initiate socket.io conection
  const io = socketio(server)

  // Initiate redis connection for persist data
  const redis = new Redis(redisConf.development)

  // Event routing
  io.on('connection', (client) => {
    // recieve project id from client and stored in projectId
    let projectId = ''

    winston.info('Client connected')

    /**
     * `join project` evnet trigged when user joining project in playground page
     * @param {Object} payload receive project id from client payload
     */
    client.on('join project', (payload) => {
      projectId = payload.pid
      winston.info(`User joined at pid: ${payload.pid}`)
      client.join(payload.pid)
    })

    /**
     * `code change` event trigged when user typing in editor
     * @param {Object} payload receive code from client payload
     */
    client.on('code change', (payload) => {
      const origin = !!payload.code.origin
      // origin mustn't be an `undefined` type
      if (origin) {
        client.broadcast.to(projectId).emit('editor update', payload.code)
      }
    })

    /**
     * `disconnect` event trigged when user exit from playground page
     * by exit means: reload page, close page/browser, session lost
     */
    client.on('disconnect', () => {
      client.leave(projectId)
      winston.info('Client disconnected')
    })
  })
}

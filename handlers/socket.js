const socketio = require('socket.io')
const winston = require('winston')
const Redis = require('ioredis')
const mongoose = require('mongoose')
const _ = require('lodash')

const Project = mongoose.model('Project')

/**
 * @param {Object} server server instance
 */
module.exports = (server) => {
  // Initiate socket.io conection
  const io = socketio(server)

  // Initiate redis connection for persist data
  const redis = new Redis()

  // Event routing
  io.on('connection', (client) => {
    // recieve project id from client and stored in projectId
    let projectId = ''

    winston.info('Client connected')

    /**
     * `join project` evnet trigged when user joining project in playground page
     * @param {Object} payload receive project id from client payload
     * after that socket will fire `init state` with editor code to initiate local editor
     */
    client.on('join project', async (payload) => {
      projectId = payload.pid
      winston.info(`User ${payload.username} joined at pid: ${payload.pid}`)
      client.join(projectId)
      Project.update({ pid: projectId }, { $set: { createdAt: Date.now() } }, (err) => {
        if (err) throw err
        winston.info(`Update ${projectId} date modified successfully!`)
      })
      client.emit('init state', {
        editor: await redis.hget(`project:${projectId}`, 'editor', (err, ret) => ret)
      })
    })

    /**
     * `code change` event trigged when user typing in editor
     * @param {Object} payload receive code from client payload
     */
    client.on('code change', (payload) => {
      const origin = !!payload.code.origin && (payload.code.origin !== 'setValue')
      // origin mustn't be an `undefined` or `setValue` type
      if (origin) {
        winston.info(`Emitted 'editor update' to client with pid: ${projectId}`)
        client.to(projectId).emit('editor update', payload.code)
        redis.hset(`project:${projectId}`, 'editor', payload.editor)
      }
    })

    client.on('user status', (payload) => {
      client.to(projectId).emit('update status', payload)
    })

    client.on('run code', (payload) => {
      winston.info(`Receive code ${payload}`)
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

const socketio = require('socket.io')
const winston = require('winston')
const Redis = require('ioredis')
const mongoose = require('mongoose')

const Project = mongoose.model('Project')

/**
 * @param {Object} server server instance
 */
module.exports = (server) => {
  // Initiate socket.io conection
  const io = socketio(server)

  // Initiate redis connection for persist data
  const redis = new Redis()
  let projects = {} // store users role in each project

  // Event routing
  io.on('connection', (client) => {
    // recieve project id from client and stored in projectId
    let projectId = ''
    let curUser = ''

    winston.info('Client connected')

    /**
     * `join project` evnet trigged when user joining project in playground page
     * @param {Object} payload receive project id from client payload
     * after that socket will fire `init state` with editor code to initiate local editor
     */
    client.on('join project', async (payload) => {
      projectId = payload.pid
      curUser = payload.username
      winston.info(`User ${payload.username} joined at pid: ${payload.pid}`)
      client.join(projectId)
      Project.update({ pid: projectId }, { $set: { createdAt: Date.now() } }, (err) => {
        if (err) throw err
        // winston.info(`Update ${projectId} date modified successfully!`)
      })

      // assign roles
      if (!projects[projectId]) {
        winston.info(`created new projects['${projectId}']`)
        projects[projectId] = null
        io.in(projectId).emit('user roles', projects[projectId])
      }

      client.emit('init state', {
        editor: await redis.hget(`project:${projectId}`, 'editor', (err, ret) => ret),
        roles: projects[projectId]
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
        // winston.info(`Emitted 'editor update' to client with pid: ${projectId}`)
        client.to(projectId).emit('editor update', payload.code)
        redis.hset(`project:${projectId}`, 'editor', payload.editor)
      }
    })

    client.on('user status', (payload) => {
      client.to(projectId).emit('update status', payload)
    })

    // client.on('selected role', (payload) => {
    //   winston.info(payload)
    //   if (payload.select === 0) { // user select `reviewer role`
    //     projects[projectId].coder = payload.partner
    //     projects[projectId].reviewer = curUser
    //   } else {
    //     projects[projectId].coder = curUser
    //     projects[projectId].reviewer = payload.partner
    //   }
    //   io.in(projectId).emit('roles update', projects[projectId])
    // })

    // client.on('role selected', async (payload) => {
    //   if (payload === 0) {  // reviewer role selected
    //     await redis.hset(`project:${projectId}`, 'reviewer', username)
    //   } else { // coder role selected
    //     await redis.hset(`project:${projectId}`, 'coder', username)
    //   }
    //   io.in(projectId).emit('user roles', {
    //     role: {
    //       coder: await redis.hget(`project:${projectId}`, 'coder', (err, ret) => ret),
    //       reviewer: await redis.hget(`project:${projectId}`, 'reviewer', (err, ret) => ret)
    //     }
    //   })
    // })

    client.on('run code', (payload) => {
      const fs = require('fs')
      const path = require('path')
      fs.writeFile('pytest.py', payload.code, (err) => {
        if (err) throw err
      })
      const nodepty = require('node-pty')
      const pty = nodepty.spawn('python', ['pytest.py'])
      pty.on('data', (data) => {
        winston.info(data)
        io.in(projectId).emit('term update', data)
      })
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

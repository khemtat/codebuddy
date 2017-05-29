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
  const projects = {} // store users role in each project

  // Event routing
  io.on('connection', (client) => {
    // recieve project id from client and stored in projectId
    let projectId = ''
    let curUser = ''

    winston.info('Client connected')

    client.on('submit review', (payload) => {
      winston.info(payload)
      io.in(projectId).emit('new review', payload)
    })

    /**
     * `join project` evnet trigged when user joining project in playground page
     * @param {Object} payload receive project id from client payload
     * after that socket will fire `init state` with editor code to initiate local editor
     */
    client.on('join project', async (payload) => {
      try {
        projectId = payload.pid
        curUser = payload.username
        winston.info(`User ${payload.username} joined at pid: ${payload.pid}`)
        client.join(projectId)
        Project.update({
          pid: projectId
        }, {
          $set: {
            createdAt: Date.now()
          }
        }, (err) => {
          if (err) throw err
        })

        // Checking if this project hasn't have any roles assigned.
        if (!projects[projectId]) {
          winston.info(`created new projects['${projectId}']`)
          projects[projectId] = {
            roles: {
              coder: '',
              reviewer: ''
            },
            count: 1
          }
          winston.info(projects[projectId].count)
          client.emit('role selection')
        } else {
          projects[projectId].count += 1
          winston.info(projects[projectId].count)
          client.emit('role updated', projects[projectId])
        }

        client.emit('init state', {
          editor: await redis.hget(`project:${projectId}`, 'editor', (err, ret) => ret)
        })
      } catch (error) {
        winston.info(`catching error: ${error}`)
      }
    })

    /**
     * `role selected` event fired when one of the project user select his role
     * @param {Ibject} payload user selected role and partner username
     * then socket will broadcast the role to his partner
     */
    client.on('role selected', (payload) => {
      if (payload.select === 0) {
        projects[projectId].roles.reviewer = curUser
        projects[projectId].roles.coder = payload.partner
      } else {
        projects[projectId].roles.reviewer = payload.partner
        projects[projectId].roles.coder = curUser
      }
      io.in(projectId).emit('role updated', projects[projectId])
    })

    /**
     * `code change` event fired when user typing in editor
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

    /**
     * `user status` event fired every 3 seconds for checking user status
     * @param {Object} payload user status from client-side
     */
    client.on('user status', (payload) => {
      client.to(projectId).emit('update status', payload)
    })

    /**
     * `run code` event fired when user click on run button from front-end
     * @param {Object} payload code from editor
     */
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
     * `disconnect` event fired when user exit from playground page
     * by exit means: reload page, close page/browser, session lost
     */
    client.on('disconnect', () => {
      try {
        projects[projectId].count -= 1
        winston.info(`user left project ${projectId} now has ${projects[projectId].count} user(s) online`)
        if (projects[projectId].count === 0) {
          delete projects[projectId]
        }
        client.leave(projectId)
        winston.info('Client disconnected')
      } catch (error) {
        winston.info(`catching error: ${error}`)
      }
    })
  })
}

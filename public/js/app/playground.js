/**
 * Dependencies declaration
 */
const socket = io()
const peer = new Peer({ key: 'tetugzaynsvy4x6r' })
let role = 0

/**
 * get query parameter from URL
 * @param {String} name parameter name that you want to get value from
 * http://stackoverflow.com/a/901144/4181203
 */
function getParameterByName(name) {
  const url = window.location.href
  const param = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)

  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * Initiate local editor
 */
let editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
  lineNumbers: true,
  mode: {
    name: 'python',
    version: 3,
    singleLineStringErrors: false
  },
  theme: 'material',
  indentUnit: 4,
  matchBrackets: true
})

/**
 * Code review modal
 */
editor.on('dblclick', () => {
  let A1 = editor.getCursor().line
  let A2 = editor.getCursor().ch
  let B1 = editor.findWordAt({
    line: A1,
    ch: A2
  }).anchor.ch
  let B2 = editor.findWordAt({
    line: A1,
    ch: A2
  }).head.ch
  $('input.disabled').val(A1+1)
  $('.ui.modal').modal('show')
})

/**
 * PeerJS connection
 */
peer.on('open', (id) => {
  console.log(`my peer id is ${id}`)
})

if (user === 'khemtat') {
  editor.setOption('readOnly', 'nocursor')
}

/**
 * User join the project
 */
socket.emit('join project', {
  pid: getParameterByName('pid'),
  username: user
})

socket.on('init state', (payload) => {
  editor.setValue(payload.editor)
})

/**
 * If user exit or going elsewhere which can be caused this project window closed
 * `beforeunload` event will fired and sending client disconnection to the server
 */
$(window).on('beforeunload', () => {
  socket.disconnect()
})

/**
 * Local editor value is changing, to handle that we'll emit our changes to server
 */
editor.on('change', (ins, data) => {
  socket.emit('code change', {
    code: data,
    editor: editor.getValue()
  })
})

/**
 * Recieve new changes editor value from server and applied them to local editor
 */
socket.on('editor update', (payload) => {
  editor.replaceRange(payload.text, payload.from, payload.to)
})

/**
 * User status checking
 */
let windowIsFocus = false

$(window).focus(() => {
  windowIsFocus = true
}).blur(() => {
  windowIsFocus = false
})

setInterval(() => {
  socket.emit('user status', {
    status: windowIsFocus
  })
}, 3000)

socket.on('update status', (payload) => {
  let hidden = payload.status ? 'Online' : 'Offline'
  $(".user.status").html(`<strong><em>${hidden}</em></strong>`)
})

socket.on('run result', (payload) => {
  console.log(`Result from running code: ${payload.result}`)
})

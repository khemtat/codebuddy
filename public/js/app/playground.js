const socket = io()

// from http://stackoverflow.com/a/901144/4181203
function getParameterByName(name) {
  const url = window.location.href
  const param = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)

  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

let editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
  lineNumbers: true,
  mode: {
    name: 'python',
    version: 3,
    singleLineStringErrors: false
  },
  theme: 'blackboard',
  indentUnit: 4,
  matchBrackets: true
})

if (user === 'khemtat') {
  editor.setOption('readOnly', 'nocursor')
}

$.ajax({
  url: `/project/getCode/${getParameterByName('pid')}`,
  success: (payload) => {
    editor.setValue(payload)
  }
})

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
  $('input.disabled').val(A1)
  $('.ui.modal').modal('show')
})

socket.emit('join project', {
  pid: getParameterByName('pid')
})

editor.on('change', (ins, data) => {
  console.log('### editor `change` event called')
  socket.emit('code change', {
    code: data,
    editor: editor.getValue()
  })
})

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


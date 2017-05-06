const socket = io()

// from http://stackoverflow.com/a/901144/4181203
function getParameterByName(name) {
  const url = window.location.href
  const param = name.replace(/[\[\]]/g, "\\$&")
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  const results = regex.exec(url)

  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

const editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
  mode: {
    name: 'python',
    version: 3,
    singleLineStringErrors: false
  },
  lineNumbers: true,
  indentUnit: 4,
  theme: 'blackboard',
  matchBrackets: true
})

editor.on('dblclick', function () {
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

  $("input.disabled").val(A1)

  $('.ui.modal').modal('show')
})

editor.on('keyup', () => {
  const message = {
    id: getParameterByName('pid'),
    value: editor.getValue()
  }
  socket.emit('code update', message)
})

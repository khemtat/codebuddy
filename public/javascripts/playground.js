let socket = io()

// from http://stackoverflow.com/a/901144/4181203
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
  mode: {
    name: 'python',
    version: 3,
    singleLineStringErrors: false
  },
  lineNumbers: true,
  indentUnit: 4,
  matchBrackets: true
})

editor.on('dblclick', function () {
  let A1 = editor.getCursor().line
  let A2 = editor.getCursor().ch
  let B1 = editor.findWordAt({
    line: A1,
    ch: A2
  }).anchor.ch;
  let B2 = editor.findWordAt({
    line: A1,
    ch: A2
  }).head.ch;

  $("input.disabled").val(A1)

  $('.ui.modal').modal('show')
})

editor.on('keyup', () => {
  let message = {
    id: getParameterByName('pid'),
    value: editor.getValue()
  }
  socket.emit('document-update', message)
})

socket.on('document-update', (message) => {

})
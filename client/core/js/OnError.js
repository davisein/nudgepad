window.onerror = function(message, url, lineNumber) {
  mixpanel.track('I got a javascript error')
  $('.nudgepad#nudgepadJavascriptError').prepend('<div>Javascript Error: '+message+'</div>').show()
  //save error and send to server for example.
  return false
}

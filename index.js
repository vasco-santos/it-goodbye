const endable = require('./endable')

module.exports = (stream, goodbye) => {
  goodbye = goodbye || 'GOODBYE'
  const e = endable(goodbye)

  return {
    // when the source ends,
    // send the goodbye and then wait to recieve
    // the other goodbye.
    source: e(stream.source),
    sink: source => stream.sink((async function * () {
      // when the goodbye is received, allow the source to end.
      for await (const chunk of source) {
        if (chunk !== goodbye) yield chunk
        e.end()
      }
    })())
  }
}

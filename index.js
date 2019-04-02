const endable = require('./endable')

module.exports = (stream, goodbye) => {
  goodbye = Buffer.from(goodbye || 'GOODBYE')
  const e = endable(goodbye)

  return {
    // when the source ends,
    // send the goodbye and then wait to recieve
    // the other goodbye.
    source: e(stream.source),
    sink: source => stream.sink((async function * () {
      // when the goodbye is received, allow the source to end.
      for await (const chunk of source) {
        const buff = Buffer.from(chunk)
        const done = buff.slice(-goodbye.length).equals(goodbye)
        if (done) {
          const remaining = buff.length - goodbye.length
          if (remaining > 0) {
            yield buff.slice(0, remaining)
          }
          e.end()
        } else {
          yield buff
        }
      }
    })())
  }
}

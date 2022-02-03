// In order for our ES6 shim to find the class, we must export it
// from the root of the CommonJS bundle
const Dropper = require('./dropper.js')
exports.Dropper = Dropper

import index_bin from './html/index.html'

exports.handlers = {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (url.pathname == "/fti_drop") {
        return await handleRequest(request, env)
      }
      //TODO token drop for feedback
      //if (url.pathname == "/submit_feedback") {
      //  return await handleRequest(request, env)
      //}
      //if (url.pathname == "/feedback") {
      //  return await handleRequest(request, env)
      //}
      return new Response(index_bin, {status: 200, headers: {"Content-Type": "text/html"}})
    } catch (e) {
      return new Response(e.message)
    }
  },
}

async function handleRequest(request, env) {
  let id = env.DROPPER.idFromName('dropper')
  let obj = env.DROPPER.get(id)
  return obj.fetch(request.url)
  let resp = await obj.fetch(request.url)
  return new Response(await resp.text())
}
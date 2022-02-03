const Near = require('./near.js')

module.exports = class Dropper {
  constructor(controller, env) {
    globalThis.controller = controller;
    globalThis.storage = controller.storage;
    globalThis.ticking = false;
    globalThis.env = env;

    controller.blockConcurrencyWhile(async () => {
        let state = await globalThis.storage.get("state") || {};
        globalThis.state = state;

        globalThis.used_voucher = await globalThis.storage.list({prefix: "used_voucher:"}) || new Map();
        for (const key of new Map(globalThis.used_voucher).keys()) {
          const new_key = key.replace("used_voucher:", "")
          globalThis.used_voucher.set(new_key, globalThis.used_voucher.get(key));
          globalThis.used_voucher.delete(key);
        }

        globalThis.used_address = await globalThis.storage.list({prefix: "used_address:"}) || new Map();
        for (const key of new Map(globalThis.used_address).keys()) {
          const new_key = key.replace("used_address:", "")
          globalThis.used_address.set(new_key, globalThis.used_address.get(key));
          globalThis.used_address.delete(key);
        }
    })
  }

  async fetch(request) {
    let url = new URL(request.url);

    switch (url.pathname) {

    //2 Voucher modes, 1 with static vouchers one->many, 2 with dynamic one->one, depending on honesty of event participants
    //Setup for static voucher one->many is much simpler

    case "/fti_drop":
      let voucher = url.searchParams.get("voucher")
      let address = url.searchParams.get("address")
      if (address.length != 64) {
        return new Response(JSON.stringify({error: "address_must_be_32_bytes"})); 
      }
      if (globalThis.used_address.get(address)) {
        return new Response(JSON.stringify({error: "address_already_funded"})); 
      }
      if (voucher != "SOMETHING_STATIC") {
        return new Response(JSON.stringify({error: "invalid_voucher"})); 
      }
      let res = await Near.send_near(address, Near.TEN_CENT)
      if (res.error != "ok") {
        return new Response(JSON.stringify(res)); 
      }

      globalThis.used_address.set(address, 0.1)
      await globalThis.storage.put(`used_address:${address}`, 0.1, {noCache: true})
      return new Response(JSON.stringify({error: "ok"}));

    //TODO dynamic voucher mode

    default:
      return new Response("Not found", {status: 404});
    }
  }
}

# Temu testproxy (Deno Deploy)

This project is a small, serverless HTTP proxy deployed on Deno. It can fetch
HTML and selected assets for `temu.com` from Deno's servers, rather than from
the browser's local network. It is **not a VPN**: it does not tunnel all device
traffic, and the current browser wrapper cannot run every site's scripts or
network requests.

The proxy is intentionally restricted to `temu.com` and its subdomains. Do not
remove that restriction or expose an unrestricted public proxy.

## Deploy in Deno Playground

1. Open the Deno Playground for your app.
2. Add a file named `worker.js` and copy in this repository's `worker.js`.
3. Replace `main.ts` with:

   ```ts
   import worker from "./worker.js";

   Deno.serve((request) => worker.fetch(request, {}));
   ```

4. Deploy the Playground.
5. Open `https://YOUR-APP.deno.dev/health`; it should return `ok`.
6. Test `https://YOUR-APP.deno.dev/proxy?url=https%3A%2F%2Fwww.temu.com`.
   A returned HTML page means Deno could fetch Temu. It does not guarantee
   that Temu's full JavaScript application will work in the browser wrapper.
7. On the GitHub Pages site, click the gear button and enter
   `https://YOUR-APP.deno.dev`, then try `temu.com`.

The Deno Playground app must be deployed before these URLs work. Keep its
resource limits in mind; free service limits can change.

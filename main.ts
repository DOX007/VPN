import worker from "./worker.js";

Deno.serve((request) => worker.fetch(request, {}));

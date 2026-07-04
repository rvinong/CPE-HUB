function appendHeader(headers, key, value) {
  if (Array.isArray(value)) {
    value.forEach((item) => headers.append(key, item));
    return;
  }

  if (value !== undefined) {
    headers.set(key, String(value));
  }
}

function firstHeader(value) {
  return Array.isArray(value) ? value[0] : value;
}

function createRequestUrl(req) {
  const host =
    firstHeader(req.headers["x-forwarded-host"]) ||
    firstHeader(req.headers.host) ||
    "localhost";
  const protocol = firstHeader(req.headers["x-forwarded-proto"]) || "https";
  return new URL(req.url || "/", `${protocol}://${host}`).toString();
}

function toWebRequest(req) {
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => appendHeader(headers, key, value));

  const init = {
    method: req.method || "GET",
    headers,
  };

  if (init.method !== "GET" && init.method !== "HEAD") {
    init.body = req;
    init.duplex = "half";
  }

  return new Request(createRequestUrl(req), init);
}

async function sendWebResponse(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  const body = Buffer.from(await response.arrayBuffer());
  res.end(body);
}

function nodeHandler(fetchHandler) {
  return async function handler(req, res) {
    try {
      const response = await fetchHandler(toWebRequest(req));
      await sendWebResponse(res, response);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ message: "Server handler failed." }));
    }
  };
}

module.exports = { nodeHandler };

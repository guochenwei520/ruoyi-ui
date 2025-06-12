export default async function handler(req, res) {
  const targetUrl = "https://your-backend.com/api" + req.url;
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  });
  res.status(response.status).json(await response.json());
}

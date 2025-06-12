export default async function handler(req, res) {
    // 设置 CORS 头（解决跨域）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 处理 GET 请求
    if (req.method === 'GET') {
        const { query } = req;
        res.status(200).json({ message: 'GET 成功', query });
    }

    // 处理 POST 请求
    if (req.method === 'POST') {
        const data = req.body;
        res.status(200).json({ message: 'POST 成功', data });
    }
}

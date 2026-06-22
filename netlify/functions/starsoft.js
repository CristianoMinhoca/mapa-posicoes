const http = require('http');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { xml, action } = JSON.parse(event.body);
  const url = 'http://201.76.181.43/wsga/awsgaservice.aspx';

  const result = await new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': action,
        'Content-Length': Buffer.byteLength(xml)
      }
    };

    const urlObj = new URL(url);
    options.hostname = urlObj.hostname;
    options.path = urlObj.pathname;
    options.port = 80;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.write(xml);
    req.end();
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ result })
  };
};

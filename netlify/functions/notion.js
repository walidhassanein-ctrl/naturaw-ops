const https = require('https');

exports.handler = function(event, context, callback) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (!NOTION_TOKEN) {
    return callback(null, { statusCode: 500, headers: headers, body: JSON.stringify({ error: 'NOTION_TOKEN not set' }) });
  }

  if (event.httpMethod === 'OPTIONS') {
    return callback(null, { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS' }, body: '' });
  }

  var path = '/v1' + ((event.queryStringParameters && event.queryStringParameters.path) || '');

  var reqOptions = {
    hostname: 'api.notion.com',
    port: 443,
    path: path,
    method: event.httpMethod || 'GET',
    headers: {
      'Authorization': 'Bearer ' + NOTION_TOKEN,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  };

  var req = https.request(reqOptions, function(res) {
    var data = '';
    res.on('data', function(chunk) { data += chunk; });
    res.on('end', function() {
      callback(null, {
        statusCode: res.statusCode,
        headers: headers,
        body: data
      });
    });
  });

  req.on('error', function(err) {
    callback(null, {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: err.message })
    });
  });

  if (event.body && event.httpMethod !== 'GET') {
    req.write(event.body);
  }

  req.end();
};

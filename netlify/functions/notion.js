exports.handler = async function(event) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  if (!NOTION_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'NOTION_TOKEN environment variable not set' })
    };
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const path = event.queryStringParameters?.path || '';
    const notionUrl = `https://api.notion.com/v1${path}`;

    const options = {
      method: event.httpMethod,
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    };

    if (event.body && event.httpMethod !== 'GET') {
      options.body = event.body;
    }

    const response = await fetch(notionUrl, options);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};

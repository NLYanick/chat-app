export async function sendRequest(endpoint, method = 'GET', body = null, headers = {}) {
  try {
    const apiKey = 'c72e5304-cfc2-4ab5-a74f-4b8da996d9f7'
    const url = `http://localhost:3000/api/v1${endpoint}`;

    const newBody = body ? JSON.stringify(body) : null

    const res = await fetch(url, {
      method,
      headers: {
        ...headers, 
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: newBody
    });

    return {
      json: await res.json(),
      status: res.status
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

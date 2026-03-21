export async function sendRequest(endpoint, method = 'GET', body = null, headers = {}) {
  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    const url = `http://localhost:3000/api/v1${endpoint}`;

    let newBody = null;
    let contentType = 'application/json';

    if (body) {
      if (body instanceof FormData) {
        newBody = body;
        contentType = null;
      } else 
        newBody = JSON.stringify(body);
    }

    const fetchOptions = {
      method,
      headers: {
        ...headers, 
        'x-api-key': apiKey
      },
      body: newBody
    };

    if (contentType) {
      fetchOptions.headers['Content-Type'] = contentType;
    }

    const res = await fetch(url, fetchOptions);

    return {
      json: await res.json(),
      status: res.status
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

import { getAccessToken } from './token-store';

export async function sendRequest(endpoint, method = 'GET', body = null, headers = {}, keepalive = false, credentials = 'include', _isRetry = false) {
  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    const url = import.meta.env.VITE_BACKEND_URL + endpoint;
    
    let newBody = null;
    let contentType = 'application/json';

    if (body) {
      if (body instanceof FormData) {
        newBody = body;
        contentType = null;
      } else 
        newBody = JSON.stringify(body);
    }

    const accessToken = getAccessToken();

    const fetchOptions = {
      method,
      headers: {
        ...headers, 
        'x-api-key': apiKey,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: newBody,
      keepalive,
      credentials
    };

    if (contentType) {
      fetchOptions.headers['Content-Type'] = contentType;
    }

    const res = await fetch(url, fetchOptions);

    if (res.status === 401 && !_isRetry && endpoint !== '/authenticate/refresh') {
      const { json: refreshJson, status: refreshStatus } = await sendRequest('/authenticate/refresh', 'POST', null, {}, false, 'include', true);
  
      if (refreshStatus === 200 && refreshJson.accessToken) {
        setAccessToken(refreshJson.accessToken);
        return sendRequest(endpoint, method, body, headers, keepalive, credentials, true);
      }
    }

    const json = res.status !== 204 ? await res.json() : { message: "Success", success: true };

    return {
      json,
      status: res.status
    };
  } catch (error) {
    console.error(error);
    return {
      json: { error: 'Network Error | Please check your connection and try again' },
      status: 500
    };
  }
}

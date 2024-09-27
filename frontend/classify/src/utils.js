// Ensure polyfills are loaded
import 'whatwg-fetch';  // Fetch polyfill
import 'es6-promise/auto';  // Promise polyfill

class FetchWrapper {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  async request(endpoint, method, body, headers = {}, timeout = 5000, onSuccess, onError, onTimeout) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: method.toUpperCase(),
      headers: { ...this.defaultHeaders, ...headers },
    };

    if (body) {
      if (body instanceof FormData) {
        config.body = body;
        delete config.headers['Content-Type'];
      } else {
        config.body = JSON.stringify(body);
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return this._timeoutFetch(url, config, timeout, onSuccess, onError, onTimeout);
  }

  _timeoutFetch(url, config, timeout, onSuccess, onError, onTimeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const error = new Error('Request timed out');
        if (onTimeout) onTimeout(error);
        reject({ status: 408, message: error.message });
      }, timeout);

      fetch(url, config)
        .then(async response => {
          clearTimeout(timer);
          let responseData = {};
          try {
            responseData = await response.json();
          } catch (e) {
            // Handle JSON parse error if any
            responseData = {};
          }

          if (response.ok) {
            if (onSuccess) onSuccess(responseData, response.status);
            resolve({ data: responseData, status: response.status });
          } else {
            const error = { status: response.status, message: responseData };
            if (onError) onError(error, response.status);
            reject(error);
          }
        })
        .catch(err => {
          clearTimeout(timer);
          const error = { status: 500, message: err.message };
          if (onError) onError(error, null);
          reject(error);
        });
    }).catch(err => {
      if (onError) onError(err, err.status);
      return Promise.reject(err);
    });
  }

  get(endpoint, headers = {}, timeout = 5000, onSuccess, onError, onTimeout) {
    return this.request(endpoint, 'GET', null, headers, timeout, onSuccess, onError, onTimeout);
  }

  post(endpoint, body, headers = {}, timeout = 5000, onSuccess, onError, onTimeout) {
    return this.request(endpoint, 'POST', body, headers, timeout, onSuccess, onError, onTimeout);
  }

  put(endpoint, body, headers = {}, timeout = 5000, onSuccess, onError, onTimeout) {
    return this.request(endpoint, 'PUT', body, headers, timeout, onSuccess, onError, onTimeout);
  }

  delete(endpoint, headers = {}, timeout = 5000, onSuccess, onError, onTimeout) {
    return this.request(endpoint, 'DELETE', null, headers, timeout, onSuccess, onError, onTimeout);
  }

  patch(endpoint, body, headers = {}, timeout = 5000, onSuccess, onError, onTimeout) {
    return this.request(endpoint, 'PATCH', body, headers, timeout, onSuccess, onError, onTimeout);
  }
}

export const api = new FetchWrapper('https://vocational-fish-techwithdunamix-65e5eda3.koyeb.app/api/v1', {
  'Authorization': `Token ${localStorage.getItem("token")}`
});

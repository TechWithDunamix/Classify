import { callApi } from "@zayne-labs/callapi";

if (!Object.entries) {
  Object.entries = function (obj) {
    let ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); 
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

class FetchWrapper {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.callApiInstance = callApi.create({
      baseURL: this.baseURL,
      headers: this.defaultHeaders,
    });
  }

  async request(endpoint, method, body, headers = {}, timeout = 5000, onSuccess, onError, onTimeout) {
    const config = {
      method: method.toUpperCase(),
      headers: headers,
      timeout: timeout,
      onResponse: ({ data, response }) => {
        if (onSuccess) onSuccess(data, response.status);
      },
      onResponseError: ({ errorData, response }) => {
        const error = { status: response.status, message: errorData };
        if (onError) onError(error, response.status);
      },
      onRequestError: ({ error }) => {
        const timeoutError = { status: 408, message: error.message };
        if (onTimeout && error.name === 'AbortError') {
          onTimeout(timeoutError);
        } else if (onError) {
          onError(timeoutError, 408);
        }
      }
    };

    if (body) {
      if (body instanceof FormData) {
        config.body = body;
      } else {
        config.body = body; 
      }
    }

    try {
      const { data, error } = await this.callApiInstance(endpoint, config);
      if (error) {
        throw error;
      }
      return { data, status: 200 };  
    } catch (error) {
      return Promise.reject(error);
    }
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
const url = "https://entire-shelli-techwithdunamix-13993bf2.koyeb.app/"
// const url = "http://127.0.0.1:8000/api/v1"

export const api = new FetchWrapper(url, {
  'Authorization': `Token ${localStorage.getItem("token")}`
});

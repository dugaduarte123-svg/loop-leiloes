export function impersonateHubHttp(axiosClient) {
  return {
    async get(url, {
      headers,
      timeout,
      query
    } = {}) {
      const response = await axiosClient.get(url, {
        headers,
        timeout,
        params: query,
        validateStatus: status => status >= 200
      });
      return response.data;
    },
    async post(url, {
      data,
      headers,
      timeout,
      query
    } = {}) {
      const response = await axiosClient.post(url, data, {
        headers,
        timeout,
        params: query,
        validateStatus: status => status >= 200
      });
      return response.data;
    },
    async delete(url, {
      headers,
      timeout,
      query
    } = {}) {
      const response = await axiosClient.delete(url, {
        headers,
        timeout,
        params: query,
        validateStatus: status => status >= 200
      });
      return response.data;
    },
    async put(url, {
      data,
      headers,
      timeout,
      query
    } = {}) {
      const response = await axiosClient.put(url, data, {
        headers,
        timeout,
        params: query,
        validateStatus: status => status >= 200
      });
      return response.data;
    },
    async patch(url, {
      data,
      headers,
      timeout,
      query
    } = {}) {
      const response = await axiosClient.patch(url, data, {
        headers,
        timeout,
        params: query,
        validateStatus: status => status >= 200
      });
      return response.data;
    }
  };
}
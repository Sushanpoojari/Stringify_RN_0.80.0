import axios from "axios";

const baseUrl = "https://stringifybackend-3.onrender.com"; 
// const baseUrl = "http://localhost:8000"; 

const headers = {
  'Content-Type': 'application/json',
};

const formDataHeaders = {
  'Content-Type': 'multipart/form-data',
}

const handleError = (errorMessage) => {
  console.log("Error :: ", errorMessage);
};

export const get = async (endpoint, params = {}, token = null) => {
  const headersWithToken = {
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      headers: headersWithToken,
      params: params,
    });
    return response;
  } catch (error) {
    handleError(error.message || error);
    return null;
  }
};

export const post = async (endpoint, params = {}, token = null) => {
  const headersWithToken = {
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await axios.post(`${baseUrl}${endpoint}`, params, {
      headers: headersWithToken,
    });
    return response;
  } catch (error) {
   const errorMessage = error.response?.data?.errorMessage ||error.message|| "Something went wrong";
    handleError(errorMessage);
    throw new Error(errorMessage);
  }
};


export const postFormData = async (endpoint, params = {}, token = null) => {
  const headersWithToken = {
    ...formDataHeaders,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await axios.post(`${baseUrl}${endpoint}`, params, {
      headers: headersWithToken,
    });
    console.log('response', JSON.stringify(response, null, 2))
    return response;
  } catch (error) {
   const errorMessage = error.response?.data?.errorMessage ||error.message|| "Something went wrong";
    handleError(errorMessage);
    throw new Error(errorMessage);
  }
};

export const put = async (endpoint, data = {}, token = null) => {
  const headersWithToken = {
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await axios.put(`${baseUrl}${endpoint}`, data, {
      headers: headersWithToken,
    });
    return response;
  } catch (error) {
    handleError(error.message || error);
    return null;
  }
};


export const del = async (endpoint, params = {}, token = null) => {
  const headersWithToken = {
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await axios.delete(`${baseUrl}${endpoint}`, {
      headers: headersWithToken,
      params,
    });
    return response;
  } catch (error) {
    handleError(error.message || error);
    return null;
  }
};

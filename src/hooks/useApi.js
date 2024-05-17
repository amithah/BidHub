import axios from 'axios';

const useApi = (baseUrl = "http://localhost:3000") => {
  const fetchDataWithHeaders = async (url,data, options = {}) => {
    return await axios({
      url: baseUrl + url,
      data,
      ...options,
    });
  };

  return { fetchDataWithHeaders };
};

export default useApi;

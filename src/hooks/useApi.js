import axios from 'axios';

// eslint-disable-next-line no-undef
const useApi = (baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL) => {
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

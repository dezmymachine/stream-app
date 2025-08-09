import apiClient from "../config";
const API_KEY = import.meta.env.VITE_API_KEY

const getAllTrending = () => {
  return apiClient({
    url: `/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`,
    method: "get",
  });
};

export { getAllTrending }

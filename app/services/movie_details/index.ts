import apiClient from "../config";
const API_KEY = import.meta.env.VITE_API_KEY

const getMovieDetails = (id: number) => {
  return apiClient({
    url: `/movie/${id}?api_key=${API_KEY}`,
    method: "get",
  });
};

const getTvDetails = (id: number) => {
  return apiClient({
    url: `/tv/${id}?api_key=${API_KEY}`,
    method: "get",
  });
};

export { getTvDetails, getMovieDetails }

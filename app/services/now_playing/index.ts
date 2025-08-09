import apiClient from "../config";
const API_KEY = import.meta.env.VITE_API_KEY

const getNowPlaying = () => {
  return apiClient({
    url: `/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
    method: "get",
  });
};

export { getNowPlaying }

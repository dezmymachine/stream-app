import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllMovies from "./pages/AllMovies";
import AllTvShows from "./pages/AllTvShows";
import MoviePage from "./pages/MoviePage";
import TvPage from "./pages/TvPage";
import SearchBar from "./pages/Search";
import Main from "./pages/Main";
import "./App.css"
const router = createBrowserRouter([
  {path:"/",element:<Main/>},
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "/allmovies", element: <AllMovies /> },
      { path: "/alltvshows", element: <AllTvShows /> },
      { path: "/search", element: <SearchBar /> },
      { path: "/movie/:id", element: <MoviePage /> },
      { path: "/tv/:id", element: <TvPage /> },
    ],
  },
]);
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F5C518",
    },
  },
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(","),
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

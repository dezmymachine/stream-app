import React, { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import MovieCard from "../components/Card";
import { Grid, Typography } from "@mui/material";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";

const AllMovies = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const { data, loading } = useFetch(
    `${baseUrl}/trending/movie/week?${apiKey}&language=en-US&page=${currentPage}`
  );

  useEffect(() => {
    setMovies(data);
  }, [data, currentPage]);

  if (loading) return <Loading />;

  return (
    <>
      <div style={{ padding: "2rem", marginBottom: "2.5rem" }}>
        <Typography variant="h5" color="primary" sx={{paddingBottom:"0.5rem"}}>
          All Movies
        </Typography>
        <Grid container spacing={2}>
          {movies &&
            movies.map((film) => {
              const posterImg = `https://image.tmdb.org/t/p/w500${film.poster_path}`;
              return (
                <Grid item xl={2} xs={6} sm={4} md={3} key={film.id}>
                  <MovieCard
                    id={film.id}
                    key={film.id}
                    poster={posterImg}
                    title={film.title}
                    type={film.media_type}
                  />
                </Grid>
              );
            })}
        </Grid>
        <Pagination page={currentPage} setPage={setCurrentPage} />
      </div>
    </>
  );
};

export default AllMovies;
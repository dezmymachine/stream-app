import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Container, Typography, Grid, Button } from "@mui/material";
import Loading from "../components/Loading";
import { useFetch } from "../hooks/useFetch";
import MovieCard from "../components/Card";

export default function SearchBar() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading } = useFetch(
    `${baseUrl}/search/multi?${apiKey}&language=en-US&query=${searchTerm}&include_adult=false`
  );

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div style={{ paddingTop: "1rem", marginBottom: "3.5rem" }}>
        <Container sx={{ marginBottom: "2rem" }}>
          <TextField
            placeholder="Search for your favourite movie,tv shows ..."
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Container>
        <Container>
          {loading && <Loading />}
          <Grid container spacing={2}>
            {data.map((film) => (
              <>
                <Grid item xl={3} xs={6} sm={4} md={3} key={film.id}>
                  <MovieCard
                    key={film.id}
                    id={film.id}
                    title={film.title}
                    name={film.name}
                    type={film.media_type}
                    rating={film.vote_average}
                    poster={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                  />
                  <Button variant="outlined">{film.media_type}</Button>
                </Grid>
              </>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
}

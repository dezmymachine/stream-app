import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import { Button, Typography, Box } from "@mui/material";
import { PlayCircleOutline } from "@mui/icons-material";

const contentStyle = {
  textAlign: "center",
};
const TrendingTv = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  const { data, loading } = useFetch(
    `${baseUrl}/discover/tv?${apiKey}&language=en-US&page=1`
  );

  if (loading) return <Loading />;
  return (
    <>
      <div style={{ padding: "0.5rem", marginBottom: "5rem" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <Typography color="primary">Discover TV shows</Typography>
          <Link to="/alltvshows" style={{ textDecoration: "none" }}>
            <Button
              color="primary"
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              See more
            </Button>
          </Link>
        </Box>
        <Carousel arrows dots={false} infinite={false}>
          {data &&
            data.map((film) => (
              <div style={contentStyle} key={film.id} className="carousel-item">
                <img
                  src={`https://image.tmdb.org/t/p/original${film.backdrop_path}`}
                  style={{
                    maxHeight: "400px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                <Box
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "0.1rem",
                    paddingTop: "1rem",
                  }}
                >
                  <Typography color="primary">{film.name}</Typography>

                  <Link to={`/tv/${film.id}`}>
                    <Button variant="contained">
                      <Typography>Watch Now</Typography>
                      <PlayCircleOutline />
                    </Button>
                  </Link>
                </Box>
              </div>
            ))}
        </Carousel>
      </div>
    </>
  );
};

export default TrendingTv;

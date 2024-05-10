import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import { StarOutlineOutlined } from "@mui/icons-material";
import Loading from "../components/Loading";
import { Container, Box, Button, Typography, Stack, Grid } from "@mui/material";

const MoviePage = () => {
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const token = import.meta.env.VITE_API_TOKEN;

  const [movieData, setMovieData] = useState(null);
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/movie/${id}?${apiKey}&language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const movie = await response.json();
        setMovieData(movie);
        setLoading(false);
        const bannerResponse = await fetch(
          `${baseUrl}/movie/${id}/images?api_key=${apiKey}`
        );
        const bannerData = await bannerResponse.json();
        if (bannerData.backdrops && bannerData.backdrops.length > 0) {
          const firstBackdrop = bannerData.backdrops[0];

          const fullImageUrl = `https://image.tmdb.org/t/p/original${firstBackdrop.file_path}`;
          setBannerUrl(fullImageUrl);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovieData();
  }, [id, baseUrl, apiKey]);

  const playMovie = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) return <Loading />;
  return (
    <>
      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={bannerUrl}
          alt="banner"
          style={{
            width: "100%",
            maxHeight: "60dvh",
            opacity: "0.8",
            borderRadius: "0.5rem",
          }}
        />
        <Button
          variant="contained"
          sx={{ position: "absolute" }}
          onClick={playMovie}
        >
          Play Now
          <PlayArrowIcon />
        </Button>
      </Box>
      <Box sx={{ marginTop: "" }}>
        {movieData && (
          <Container>
            <Stack
              spacing={2}
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "1rem",
              }}
            >
              <Typography variant="h4" color="primary">
                {movieData.title}
              </Typography>
              <Typography variant="" color="primary">
                {movieData.runtime}min
              </Typography>
            </Stack>

            <Typography variant="" color="">
              <strong style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
                Overview:
              </strong>
              <br></br>
              {movieData.overview}
            </Typography>
            <Typography
              variant=""
              color="primary"
              sx={{ alignItems: "center", display: "flex" }}
            >
              {Math.ceil(movieData.vote_average)}
              <StarOutlineOutlined />
            </Typography>
          </Container>
        )}
      </Box>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              padding: "",
              borderRadius: "0.5rem",
            }}
          >
            <iframe
              src={`https://vidsrc.to/embed/movie/${id}`}
              allowFullScreen
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
              }}
            />
            <CloseIcon
              color="primary"
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                color: "white",
                cursor: "pointer",
              }}
              onClick={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default MoviePage;

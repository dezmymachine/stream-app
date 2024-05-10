import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, Stack, Typography, Button } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
export default function MovieCard({ poster, title, name, type, rating, id }) {
  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          maxHeight: 400,
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height=""
            loading="lazy"
            image={poster}
            alt="title"
            sx={{ objectFit: "cover" }}
          />
          <Link to={`/${type}/${id}`}>
            <IconButton
              size="xlarge"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <PlayCircleIcon color="primary" />
            </IconButton>
          </Link>
        </CardActionArea>
      </Card>
      <Typography>{title}</Typography>
      <Typography>{name}</Typography>
    </>
  );
}

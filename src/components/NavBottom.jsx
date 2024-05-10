import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
export default function NavBottom() {
  const [value, setValue] = React.useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation showLabels value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Home"
            value="Home"
            component={Link}
            to="/"
            icon={<HomeOutlinedIcon color="primary" />}
          />
          <BottomNavigationAction
            label="Search"
            value="Search"
            component={Link}
            to="/search"
            icon={<SearchIcon color="primary" />}
          />
          <BottomNavigationAction
            label="Movies"
            value="Movies"
            component={Link}
            to="/allmovies"
            icon={<MovieOutlinedIcon color="primary" />}
          />

          <BottomNavigationAction
            label="Tv"
            value="Tv"
            component={Link}
            to="/alltvshows"
            icon={<LiveTvOutlinedIcon color="primary" />}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}

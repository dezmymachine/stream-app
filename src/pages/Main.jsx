import React from "react";
import Home from "./Home";
import Hero from "../components/Hero";
import TrendingTv from "../components/TrendingTv";
import Attribution from "../components/Attribution";

const Main = () => {
  return (
    <div>
      <Hero />
      <TrendingTv/>
      <Attribution/>
      <Home />
    </div>
  );
};

export default Main;

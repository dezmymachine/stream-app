import type { Route } from "./+types/home";
import Hero from "~/components/hero";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AltFlix" },
    { name: "description", content: "Stream all your fav movies and tv shows anywhere and on any device for free!" },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}

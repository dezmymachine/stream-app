import SearchBar from "./searchbar"
import { ModeToggle } from "./mode-toggle";
import { Link } from "react-router";
const Navbar = () => {
  return (

    <nav className="flex items-center  justify-between px-4 py-2">
      <Link to="/" className="font-extrabold">AltFlix</Link>
      <div className="flex items-center">
        <SearchBar />
        <div className="ml-2">
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar;

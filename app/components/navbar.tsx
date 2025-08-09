import SearchBar from "./searchbar"
import { ModeToggle } from "./mode-toggle";
const Navbar = () => {
  return (

    <nav className="flex items-center  justify-end px-4 py-2">
      <SearchBar />
      <div className="ml-2">
        <ModeToggle />
      </div>
    </nav>
  )
}

export default Navbar;

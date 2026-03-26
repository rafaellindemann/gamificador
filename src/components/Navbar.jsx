import { Link } from "react-router-dom"
import './Navbar.css'
function Navbar() {
  return (
    <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/pagina1">Página 1</Link>
        <Link to="/pagina2">Página II</Link>
        <Link to="/pagina3">Página três</Link>
    </nav>
  )
}

export default Navbar

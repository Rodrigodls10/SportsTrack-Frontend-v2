import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <NavLink to="/dashboard">
                Dashboard
            </NavLink>

            {" | "}

            <NavLink to="/activities">
                Actividades
            </NavLink>
        </nav>
    );
};

export default Navbar;
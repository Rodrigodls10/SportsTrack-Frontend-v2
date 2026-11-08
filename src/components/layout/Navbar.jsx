import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    logout
} from "../../features/auth.slice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const usuario = useSelector(
        state => state.auth.user
    );

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        dispatch(
            logout()
        );

        navigate(
            "/login"
        );
    };

    return (
        <nav className="navbar">

            <div className="navbar-container">

                <div className="navbar-brand">
                    <NavLink to="/dashboard">
                        SportsTrack
                    </NavLink>
                </div>

                <div className="navbar-links">

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "navbar-link active"
                                : "navbar-link"
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/activities"
                        className={({ isActive }) =>
                            isActive
                                ? "navbar-link active"
                                : "navbar-link"
                        }
                    >
                        Actividades
                    </NavLink>

                    <NavLink
                        to="/sports"
                        className={({ isActive }) =>
                            isActive
                                ? "navbar-link active"
                                : "navbar-link"
                        }
                    >
                        Deportes
                    </NavLink>

                    {usuario?.role === "ADMIN" && (
                        <NavLink
                            to="/categories"
                            className={({ isActive }) =>
                                isActive
                                    ? "navbar-link active"
                                    : "navbar-link"
                            }
                        >
                            Categorías
                        </NavLink>
                    )}

                </div>

                <div className="navbar-user">

                    <div className="navbar-user-info">
                        <span>
                            {usuario?.username}
                        </span>

                        <small>
                            {usuario?.plan}
                        </small>
                    </div>

                    <button
                        type="button"
                        className="navbar-logout"
                        onClick={
                            cerrarSesion
                        }
                    >
                        Cerrar sesión
                    </button>

                </div>

            </div>

        </nav>
    );
};

export default Navbar;
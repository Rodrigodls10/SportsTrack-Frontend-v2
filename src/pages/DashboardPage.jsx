import {
    useDispatch,
    useSelector
} from "react-redux";

import { useNavigate } from "react-router-dom";

import UpgradePlanButton from "../components/dashboard/UpgradePlanButton";
import ActivityChart from "../components/dashboard/ActivityChart";

import Navbar from "../components/layout/Navbar";
import PlanUsageCard from "../components/dashboard/PlanUsageCard";

import { logout } from "../features/auth.slice";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const usuario = useSelector(
        state => state.auth.user
    );

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        dispatch(logout());

        navigate("/login");
    };

    return (
        <div>
            <Navbar />

            <h1>
                SportsTrack
            </h1>

            <h2>
                Bienvenido, {usuario?.username}
            </h2>

            <p>
                Email: {usuario?.email}
            </p>

            <p>
                Rol: {usuario?.role}
            </p>

            <p>
                Plan: {usuario?.plan}
            </p>

            <PlanUsageCard />

            <UpgradePlanButton />

            <ActivityChart />

            <button
                type="button"
                onClick={cerrarSesion}
            >
                Cerrar sesión
            </button>
        </div>
    );
};

export default DashboardPage;
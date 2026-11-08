import {
    useSelector
} from "react-redux";

import Navbar from "../components/layout/Navbar";
import PlanUsageCard from "../components/dashboard/PlanUsageCard";
import UpgradePlanButton from "../components/dashboard/UpgradePlanButton";
import ActivityChart from "../components/dashboard/ActivityChart";

const DashboardPage = () => {
    const usuario = useSelector(
        state => state.auth.user
    );

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-container">

                <section className="dashboard-header">

                    <div>
                        <span className="dashboard-eyebrow">
                            PANEL PERSONAL
                        </span>

                        <h1>
                            Bienvenido, {usuario?.username}
                        </h1>

                        <p>
                            Revisá tu actividad, tu plan
                            y el progreso de tus entrenamientos.
                        </p>
                    </div>

                    <div className="dashboard-user-card">

                        <div className="dashboard-user-avatar">
                            {usuario?.username
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {usuario?.username}
                            </strong>

                            <span>
                                {usuario?.email}
                            </span>
                        </div>

                    </div>

                </section>

                <section className="dashboard-info-grid">

                    <article className="dashboard-info-card">
                        <span>
                            Rol
                        </span>

                        <strong>
                            {usuario?.role}
                        </strong>
                    </article>

                    <article className="dashboard-info-card">
                        <span>
                            Plan actual
                        </span>

                        <strong>
                            {usuario?.plan}
                        </strong>
                    </article>

                </section>

                <section className="dashboard-main-grid">

                    <div className="dashboard-plan-column">

                        <PlanUsageCard />

                        <UpgradePlanButton />

                    </div>

                    <div className="dashboard-chart-column">

                        <ActivityChart />

                    </div>

                </section>

            </main>
        </div>
    );
};

export default DashboardPage;
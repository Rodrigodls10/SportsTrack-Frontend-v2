import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import SportsPage from "./pages/SportsPage";
import SportsEventDetailPage from "./pages/SportsEventDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProtectedRoute from "./app/guards/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/register"
                element={<RegisterPage />}
            />

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                />

                <Route
                    path="/activities"
                    element={<ActivitiesPage />}
                />

                <Route
                    path="/sports"
                    element={<SportsPage />}
                />

                <Route
                    path="/sports/:id"
                    element={<SportsEventDetailPage />}
                />

                <Route
                    path="/categories"
                    element={<CategoriesPage />}
                />

            </Route>

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default App;
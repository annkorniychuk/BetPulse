import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MainLayout from "./layouts/main-layout";
import SplashScreen from './components/SplashScreen';
import { BetSlipProvider } from './context/BetSlipContext';
import BetSlip from './components/BetSlip/BetSlip';

// 👇 1. ДОДАЛИ ІМПОРТИ ДЛЯ СПОВІЩЕНЬ
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import AdminLayout from './layouts/AdminLayout';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCompetitionsPage from './pages/AdminCompetitionsPage.tsx';
import RegisterPage from './pages/RegisterPage';
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from './pages/ProfilePage';
import AdminPromotionsPage from './pages/AdminPromotionsPage';
import AdminSportsPage from './pages/AdminSportsPage';
import SportsCatalogPage from './pages/SportsCatalogPage';
import CompetitionDetailsPage from './pages/CompetitionDetailsPage';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    if (isLoading) {
        return <SplashScreen onFinish={() => setIsLoading(false)} />;
    }

    return (
        /* 👇 Обертаємо всю програму в наш провайдер */
        <BetSlipProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/sports" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/catalog" element={<SportsCatalogPage />} />
                        <Route path="/competition/:id" element={<CompetitionDetailsPage />} />
                    </Route>

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="sports" replace />} />

                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="competitions" element={<AdminCompetitionsPage />} />
                        <Route path="promotions" element={<AdminPromotionsPage />} />
                        <Route path="sports" element={<AdminSportsPage/>} />
                    </Route>
                </Routes>
            </BrowserRouter>

            {/* 👇 Додаємо сам купон (він буде висіти поверх усіх сторінок) */}
            <BetSlip />

            {/* 👇 2. ДОДАЛИ КОНТЕЙНЕР ДЛЯ ТОСТІВ (темна тема під дизайн сайту) */}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </BetSlipProvider>
    );
}

export default App;